import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import {
  DEFAULT_TRADES,
  DEFAULT_SAAS_PROJECTS,
  DEFAULT_VISION_MILESTONES,
  DEFAULT_DAILY_TASKS,
  INITIAL_XP,
  INITIAL_LEVEL,
  STORAGE_KEYS,
} from '../data/constants';
import { hasSupabase } from '../lib/supabase';
import { loadAll, saveTrades, saveSaasProjects, saveVisionMilestones, saveDailyTasks, saveUserProfile } from '../lib/supabaseSync';

const AppContext = createContext(null);

export function AppProvider({ children, userId }) {
  const [loading, setLoading] = useState(hasSupabase && !!userId);
  const initialLoadDone = useRef(false);

  const [trades, setTrades] = usePersistedState(STORAGE_KEYS.TRADES, DEFAULT_TRADES);
  const [saasProjects, setSaasProjects] = usePersistedState(STORAGE_KEYS.SAAS_PROJECTS, DEFAULT_SAAS_PROJECTS);
  const [visionMilestones, setVisionMilestones] = usePersistedState(STORAGE_KEYS.VISION, DEFAULT_VISION_MILESTONES);
  const [dailyTasks, setDailyTasks] = usePersistedState(STORAGE_KEYS.DAILY_TASKS, DEFAULT_DAILY_TASKS);
  const [userXP, setUserXP] = usePersistedState(STORAGE_KEYS.USER_XP, INITIAL_XP);
  const [userLevel, setUserLevel] = usePersistedState(STORAGE_KEYS.USER_LEVEL, INITIAL_LEVEL);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!hasSupabase || !userId) {
      setLoading(false);
      return;
    }
    loadAll(userId)
      .then((data) => {
        if (data) {
          setTrades(data.trades);
          setSaasProjects(data.saasProjects);
          setVisionMilestones(data.visionMilestones);
          setDailyTasks(data.dailyTasks);
          setUserXP(data.userXP);
          setUserLevel(data.userLevel);
          setDisplayName(data.displayName || '');
        }
      })
      .catch((e) => console.warn('Supabase load failed', e))
      .finally(() => {
        setLoading(false);
        initialLoadDone.current = true;
      });
  }, [userId]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    saveTrades(userId, trades).catch((e) => console.warn('saveTrades failed', e));
  }, [userId, trades]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    saveSaasProjects(userId, saasProjects).catch((e) => console.warn('saveSaasProjects failed', e));
  }, [userId, saasProjects]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    saveVisionMilestones(userId, visionMilestones).catch((e) => console.warn('saveVisionMilestones failed', e));
  }, [userId, visionMilestones]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    saveDailyTasks(userId, dailyTasks).catch((e) => console.warn('saveDailyTasks failed', e));
  }, [userId, dailyTasks]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    saveUserProfile(userId, userXP, userLevel, displayName).catch((e) => console.warn('saveUserProfile failed', e));
  }, [userId, userXP, userLevel, displayName]);

  const toggleTask = useCallback(
    (id) => {
      setDailyTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const newStatus = !t.completed;
          if (newStatus) setUserXP((x) => x + t.xp);
          else setUserXP((x) => x - t.xp);
          return { ...t, completed: newStatus };
        })
      );
    },
    [setDailyTasks, setUserXP]
  );

  const addTrade = useCallback(
    (trade) => {
      const id = Math.max(0, ...trades.map((t) => t.id)) + 1;
      setTrades((prev) => [{ ...trade, id }, ...prev]);
    },
    [trades, setTrades]
  );

  const addTask = useCallback(
    (task) => {
      const id = `custom-${Date.now()}`;
      setDailyTasks((prev) => [...prev, { ...task, id, completed: false }]);
    },
    [setDailyTasks]
  );

  const value = {
    trades,
    setTrades,
    saasProjects,
    setSaasProjects,
    visionMilestones,
    setVisionMilestones,
    dailyTasks,
    setDailyTasks,
    userXP,
    setUserXP,
    userLevel,
    setUserLevel,
    displayName,
    setDisplayName,
    toggleTask,
    addTrade,
    addTask,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
