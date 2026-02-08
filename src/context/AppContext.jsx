import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import {
  DEFAULT_TRADES,
  DEFAULT_SAAS_PROJECTS,
  DEFAULT_VISION_MILESTONES,
  DEFAULT_DAILY_TASKS,
  DEFAULT_HEALTH_ENTRIES,
  DEFAULT_LEARNING_ITEMS,
  DEFAULT_FINANCE_GOALS,
  DEFAULT_RELATIONSHIP_ITEMS,
  INITIAL_XP,
  INITIAL_LEVEL,
  STORAGE_KEYS,
  DEFAULT_ENABLED_CATEGORIES,
  ALL_CATEGORY_IDS,
  getOnboardingStorageKey,
} from '../data/constants';
import { hasSupabase } from '../lib/supabase';
import { loadAll, saveTrades, saveSaasProjects, saveVisionMilestones, saveDailyTasks, saveUserProfile, saveCalendarProfile, saveHealthEntries, saveLearningItems, saveFinanceGoals, saveRelationships } from '../lib/supabaseSync';

const MAX_SYNC_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function withRetry(fn, onError) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_SYNC_RETRIES; attempt++) {
    try {
      await fn();
      return;
    } catch (e) {
      lastErr = e;
      if (attempt < MAX_SYNC_RETRIES) {
        const delayMs = RETRY_DELAY_MS * (attempt + 1);
        await new Promise((r) => setTimeout(r, delayMs));
      }
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
  const [healthEntries, setHealthEntries] = usePersistedState(STORAGE_KEYS.HEALTH, DEFAULT_HEALTH_ENTRIES);
  const [learningItems, setLearningItems] = usePersistedState(STORAGE_KEYS.LEARNING, DEFAULT_LEARNING_ITEMS);
  const [financeGoals, setFinanceGoals] = usePersistedState(STORAGE_KEYS.FINANCE, DEFAULT_FINANCE_GOALS);
  const [relationshipItems, setRelationshipItems] = usePersistedState(STORAGE_KEYS.RELATIONSHIPS, DEFAULT_RELATIONSHIP_ITEMS);
  const [displayName, setDisplayName] = useState('');
  const [syncError, setSyncError] = useState(null);
  const [syncBannerDismissed, setSyncBannerDismissed] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(true);
  const [enabledCategories, setEnabledCategories] = useState(() => DEFAULT_ENABLED_CATEGORIES);
  const [onboardingLoaded, setOnboardingLoaded] = useState(false);
  const [calendarEmbedUrl, setCalendarEmbedUrl] = useState('');
  const [selectedCalendarId, setSelectedCalendarId] = useState('primary');

  useEffect(() => {
    const key = getOnboardingStorageKey(userId);
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      if (raw == null) {
        setOnboardingDone(false);
        setEnabledCategories(DEFAULT_ENABLED_CATEGORIES);
      } else {
        const data = JSON.parse(raw);
        setOnboardingDone(!!data.done);
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          const merged = [...new Set([...data.categories, ...ALL_CATEGORY_IDS])];
          setEnabledCategories(merged);
        }
      }
    } catch {
      setOnboardingDone(false);
      setEnabledCategories(DEFAULT_ENABLED_CATEGORIES);
    }
    setOnboardingLoaded(true);
  }, [userId]);

  const completeOnboarding = useCallback((categories) => {
    setEnabledCategories(categories);
    setOnboardingDone(true);
    const key = getOnboardingStorageKey(userId);
    try {
      localStorage.setItem(key, JSON.stringify({ done: true, categories }));
    } catch (e) {
      console.warn('Failed to save onboarding', e);
    }
  }, [userId]);

  const reopenOnboarding = useCallback(() => {
    setOnboardingDone(false);
  }, []);

  useEffect(() => {
    if (!hasSupabase || !userId) {
      setLoading(false);
      return;
    }
    loadAll(userId)
      .then((data) => {
        if (data) {
          setSyncError(null);
          setSyncBannerDismissed(false);
          setTrades(data.trades);
          setSaasProjects(data.saasProjects);
          setVisionMilestones(data.visionMilestones);
          setDailyTasks(data.dailyTasks);
          setUserXP(data.userXP);
          setUserLevel(data.userLevel);
          setDisplayName(data.displayName || '');
          if (Array.isArray(data.healthEntries)) setHealthEntries(data.healthEntries);
          if (Array.isArray(data.learningItems)) setLearningItems(data.learningItems);
          if (Array.isArray(data.financeGoals)) setFinanceGoals(data.financeGoals);
          if (Array.isArray(data.relationshipItems)) setRelationshipItems(data.relationshipItems);
          if (Array.isArray(data.enabledCategories) && data.enabledCategories.length > 0) {
            setEnabledCategories(data.enabledCategories);
            setOnboardingDone(true);
            try {
              const key = getOnboardingStorageKey(userId);
              localStorage.setItem(key, JSON.stringify({ done: true, categories: data.enabledCategories }));
            } catch (e) {
              console.warn('Failed to persist onboarding from Supabase', e);
            }
          }
          if (data.calendarEmbedUrl != null) setCalendarEmbedUrl(data.calendarEmbedUrl);
          if (data.selectedCalendarId != null) setSelectedCalendarId(data.selectedCalendarId);
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
      setSyncError('שגיאה בסנכרון המסחר – נשמר מקומית');
    });
  }, [userId, trades]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveSaasProjects(userId, saasProjects), (e) => {
      console.warn('saveSaasProjects failed', e);
      setSyncError('שגיאה בסנכרון פרויקטי SaaS – נשמר מקומית');
    });
  }, [userId, saasProjects]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveVisionMilestones(userId, visionMilestones), (e) => {
      console.warn('saveVisionMilestones failed', e);
      setSyncError('שגיאה בסנכרון החזון – נשמר מקומית');
    });
  }, [userId, visionMilestones]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveDailyTasks(userId, dailyTasks), (e) => {
      console.warn('saveDailyTasks failed', e);
      setSyncError('שגיאה בסנכרון המשימות – נשמר מקומית');
    });
  }, [userId, dailyTasks]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveUserProfile(userId, userXP, userLevel, displayName, enabledCategories), (e) => {
      console.warn('saveUserProfile failed', e);
      setSyncError('שגיאה בסנכרון הפרופיל – נשמר מקומית');
    });
  }, [userId, userXP, userLevel, displayName, enabledCategories]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveCalendarProfile(userId, calendarEmbedUrl, selectedCalendarId), (e) => {
      console.warn('saveCalendarProfile failed', e);
      setSyncError('שגיאה בשמירת הגדרות היומן – נשמר מקומית');
    });
  }, [userId, calendarEmbedUrl, selectedCalendarId]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveHealthEntries(userId, healthEntries), (e) => {
      console.warn('saveHealthEntries failed', e);
      setSyncError('שגיאה בסנכרון הבריאות – נשמר מקומית');
    });
  }, [userId, healthEntries]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveLearningItems(userId, learningItems), (e) => {
      console.warn('saveLearningItems failed', e);
      setSyncError('שגיאה בסנכרון הלמידה – נשמר מקומית');
    });
  }, [userId, learningItems]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveFinanceGoals(userId, financeGoals), (e) => {
      console.warn('saveFinanceGoals failed', e);
      setSyncError('שגיאה בסנכרון הכספים – נשמר מקומית');
    });
  }, [userId, financeGoals]);

  useEffect(() => {
    if (!hasSupabase || !userId || !initialLoadDone.current) return;
    withRetry(() => saveRelationships(userId, relationshipItems), (e) => {
      console.warn('saveRelationships failed', e);
      setSyncError('שגיאה בסנכרון היחסים – נשמר מקומית');
    });
  }, [userId, relationshipItems]);

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

  const addHealthEntry = useCallback(
    (entry) => {
      const id = Math.max(0, ...healthEntries.map((e) => e.id)) + 1;
      setHealthEntries((prev) => [{ ...entry, id }, ...prev]);
    },
    [healthEntries, setHealthEntries]
  );

  const updateHealthEntry = useCallback(
    (updated) => {
      setHealthEntries((prev) => prev.map((e) => (e.id === updated.id ? { ...updated } : e)));
    },
    [setHealthEntries]
  );

  const deleteHealthEntry = useCallback(
    (id) => setHealthEntries((prev) => prev.filter((e) => e.id !== id)),
    [setHealthEntries]
  );

  const addLearningItem = useCallback(
    (item) => {
      const id = Math.max(0, ...learningItems.map((i) => i.id)) + 1;
      setLearningItems((prev) => [...prev, { ...item, id, progress: item.progress ?? 0 }]);
    },
    [learningItems, setLearningItems]
  );

  const updateLearningItem = useCallback(
    (updated) => {
      setLearningItems((prev) => prev.map((i) => (i.id === updated.id ? { ...updated } : i)));
    },
    [setLearningItems]
  );

  const deleteLearningItem = useCallback(
    (id) => setLearningItems((prev) => prev.filter((i) => i.id !== id)),
    [setLearningItems]
  );

  const addFinanceGoal = useCallback(
    (goal) => {
      const id = Math.max(0, ...financeGoals.map((g) => g.id)) + 1;
      setFinanceGoals((prev) => [...prev, { ...goal, id, currentAmount: goal.currentAmount ?? 0 }]);
    },
    [financeGoals, setFinanceGoals]
  );

  const updateFinanceGoal = useCallback(
    (updated) => {
      setFinanceGoals((prev) => prev.map((g) => (g.id === updated.id ? { ...updated } : g)));
    },
    [setFinanceGoals]
  );

  const deleteFinanceGoal = useCallback(
    (id) => setFinanceGoals((prev) => prev.filter((g) => g.id !== id)),
    [setFinanceGoals]
  );

  const addRelationshipItem = useCallback(
    (item) => {
      const id = Math.max(0, ...relationshipItems.map((r) => r.id)) + 1;
      setRelationshipItems((prev) => [...prev, { ...item, id, lastContact: item.lastContact || '' }]);
    },
    [relationshipItems, setRelationshipItems]
  );

  const updateRelationshipItem = useCallback(
    (updated) => {
      setRelationshipItems((prev) => prev.map((r) => (r.id === updated.id ? { ...updated } : r)));
    },
    [setRelationshipItems]
  );

  const deleteRelationshipItem = useCallback(
    (id) => setRelationshipItems((prev) => prev.filter((r) => r.id !== id)),
    [setRelationshipItems]
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
    calendarEmbedUrl,
    setCalendarEmbedUrl,
    selectedCalendarId,
    setSelectedCalendarId,
    toggleTask,
    addTrade,
    updateTrade,
    deleteTrade,
    addTask,
    loading,
    syncError,
    setSyncError,
    syncBannerDismissed,
    setSyncBannerDismissed,
    onboardingDone,
    onboardingLoaded,
    enabledCategories,
    completeOnboarding,
    reopenOnboarding,
    healthEntries,
    setHealthEntries,
    addHealthEntry,
    updateHealthEntry,
    deleteHealthEntry,
    learningItems,
    setLearningItems,
    addLearningItem,
    updateLearningItem,
    deleteLearningItem,
    financeGoals,
    setFinanceGoals,
    addFinanceGoal,
    updateFinanceGoal,
    deleteFinanceGoal,
    relationshipItems,
    setRelationshipItems,
    addRelationshipItem,
    updateRelationshipItem,
    deleteRelationshipItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
