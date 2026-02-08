import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as googleTasksApi from '../lib/googleTasksApi';

const GoogleTasksContext = createContext(null);

export function GoogleTasksProvider({ children, accessToken }) {
  const [taskLists, setTaskLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTaskLists = useCallback(async () => {
    if (!accessToken) return;
    setError(null);
    setLoading(true);
    try {
      const lists = await googleTasksApi.getTaskLists(accessToken);
      setTaskLists(lists);
      if (lists.length > 0 && !selectedListId) setSelectedListId(lists[0].id);
      if (lists.length > 0 && selectedListId && !lists.some((l) => l.id === selectedListId))
        setSelectedListId(lists[0].id);
    } catch (e) {
      setError(e.message || 'שגיאה בטעינת רשימות המשימות');
      setTaskLists([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, selectedListId]);

  const loadTasks = useCallback(async () => {
    if (!accessToken || !selectedListId) {
      setTasks([]);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const items = await googleTasksApi.getTasks(accessToken, selectedListId);
      setTasks(items);
    } catch (e) {
      setError(e.message || 'שגיאה בטעינת משימות');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, selectedListId]);

  useEffect(() => {
    loadTaskLists();
  }, [loadTaskLists]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const refresh = useCallback(() => {
    loadTaskLists().then(() => loadTasks());
  }, [loadTaskLists, loadTasks]);

  const addTask = useCallback(
    async (title, notes) => {
      if (!accessToken || !selectedListId) return;
      setError(null);
      try {
        const newTask = await googleTasksApi.insertTask(accessToken, selectedListId, { title, notes });
        setTasks((prev) => [newTask, ...prev]);
      } catch (e) {
        setError(e.message || 'שגיאה בהוספת משימה');
        throw e;
      }
    },
    [accessToken, selectedListId]
  );

  const toggleTask = useCallback(
    async (taskId) => {
      if (!accessToken || !selectedListId) return;
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      const newStatus = task.status === 'completed' ? 'needsAction' : 'completed';
      setError(null);
      try {
        await googleTasksApi.updateTask(accessToken, selectedListId, taskId, { status: newStatus });
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
      } catch (e) {
        setError(e.message || 'שגיאה בעדכון משימה');
      }
    },
    [accessToken, selectedListId, tasks]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      if (!accessToken || !selectedListId) return;
      setError(null);
      try {
        await googleTasksApi.deleteTask(accessToken, selectedListId, taskId);
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } catch (e) {
        setError(e.message || 'שגיאה במחיקת משימה');
      }
    },
    [accessToken, selectedListId]
  );

  const value = {
    hasToken: !!accessToken,
    taskLists,
    selectedListId,
    setSelectedListId,
    tasks,
    loading,
    error,
    refresh,
    addTask,
    toggleTask,
    deleteTask,
  };

  return (
    <GoogleTasksContext.Provider value={value}>
      {children}
    </GoogleTasksContext.Provider>
  );
}

export function useGoogleTasks() {
  const ctx = useContext(GoogleTasksContext);
  return ctx;
}
