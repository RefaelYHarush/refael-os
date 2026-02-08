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

const MAX_SYNC_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

async function withRetry(fn, onError) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_SYNC_RETRIES; attempt++) {
    try {
      await fn();
      return;
    } catch (e) {
      lastErr = e;
      if (attempt < MAX_SYNC_RETRIES) await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
  onError?.(lastErr);
}

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
  const [syncError, setSyncError] = useState(null);

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
      .catch((e) => {
        console.warn('Supabase load failed', e);
        setSyncError('שגיאה בטעינת הנתונים – מוצגים נתונים מקומיים');
      })
      .finally(() => {
        setLoading(false);
        initialLoadDone.current = true;
      });
  }, [userId]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveTrades(userId, trades), (e) => {
      console.warn('saveTrades failed', e);
      setSyncError('שגיאה בסנכרון – הנתונים נשמרו מקומית');
    });
  }, [userId, trades]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveSaasProjects(userId, saasProjects), (e) => {
      console.warn('saveSaasProjects failed', e);
      setSyncError('שגיאה בסנכרון – הנתונים נשמרו מקומית');
    });
  }, [userId, saasProjects]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveVisionMilestones(userId, visionMilestones), (e) => {
      console.warn('saveVisionMilestones failed', e);
      setSyncError('שגיאה בסנכרון – הנתונים נשמרו מקומית');
    });
  }, [userId, visionMilestones]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveDailyTasks(userId, dailyTasks), (e) => {
      console.warn('saveDailyTasks failed', e);
      setSyncError('שגיאה בסנכרון – הנתונים נשמרו מקומית');
    });
  }, [userId, dailyTasks]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveUserProfile(userId, userXP, userLevel, displayName), (e) => {
      console.warn('saveUserProfile failed', e);
      setSyncError('שגיאה בסנכרון – הנתונים נשמרו מקומית');
    });
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

  const updateTrade = useCallback(
    (updated) => {
      setTrades((prev) => prev.map((t) => (t.id === updated.id ? { ...updated } : t)));
    },
    [setTrades]
  );

  const deleteTrade = useCallback(
    (id) => {
      setTrades((prev) => prev.filter((t) => t.id !== id));
    },
    [setTrades]
  );

  const addTask = useCallback(
    (task) => {
      const id = `custom-${Date.now()}`;
      setDailyTasks((prev) => [...prev, { ...task, id, completed: false }]);
    },
    [setDailyTasks]
  );

  const addSaasProject = useCallback(
    (project) => {
      const id = Math.max(0, ...saasProjects.map((p) => p.id)) + 1;
      setSaasProjects((prev) => [...prev, { ...project, id }]);
    },
    [saasProjects, setSaasProjects]
  );

  const updateSaasProject = useCallback(
    (project) => {
      setSaasProjects((prev) => prev.map((p) => (p.id === project.id ? { ...project } : p)));
    },
    [setSaasProjects]
  );

  const deleteSaasProject = useCallback(
    (id) => {
      setSaasProjects((prev) => prev.filter((p) => p.id !== id));
    },
    [setSaasProjects]
  );

  const value = {
    trades,
    setTrades,
    saasProjects,
    setSaasProjects,
    addSaasProject,
    updateSaasProject,
    deleteSaasProject,
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
    updateTrade,
    deleteTrade,
    addTask,
    loading,
    syncError,
    setSyncError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
