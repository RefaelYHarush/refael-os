import React, { useState } from 'react';
import { ListTodo, CheckCircle2, Circle, Trash2, RefreshCw, Plus } from 'lucide-react';
import { Card } from './ui/Card';
import { useGoogleTasks } from '../context/GoogleTasksContext';
import { useAuth } from '../context/AuthContext';

export function GoogleTasksCard() {
  const { signInWithGoogle } = useAuth();
  const {
    hasToken,
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
  } = useGoogleTasks();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleConnectGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle({ requestTasksScope: true });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e?.preventDefault();
    const title = newTaskTitle?.trim();
    if (!title || adding) return;
    setAdding(true);
    try {
      await addTask(title);
      setNewTaskTitle('');
    } catch {
      // error already set in context
    } finally {
      setAdding(false);
    }
  };

  if (!hasToken) {
    return (
      <Card className="p-6 border border-slate-200 dark:border-brand-dark/50">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100 dark:bg-brand-dark/50 rounded-lg shrink-0">
            <ListTodo size={20} className="text-slate-600 dark:text-on-brand-muted" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-on-brand mb-1">משימות גוגל</h3>
            <p className="text-sm text-slate-600 dark:text-on-brand-muted mb-4">
              חבר את חשבון גוגל כדי לצפות ולנהל את משימות Google Tasks ישירות מהאתר.
            </p>
            <button
              type="button"
              onClick={handleConnectGoogle}
              disabled={googleLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-brand-dark/50 hover:bg-slate-200 dark:hover:bg-brand-dark border border-slate-200 dark:border-brand-dark font-medium text-slate-700 dark:text-on-brand transition-colors disabled:opacity-60"
            >
              {googleLoading ? '...' : 'חבר גישה למשימות גוגל'}
            </button>
          </div>
        </div>
      </Card>
    );
  }

  const selectedList = taskLists.find((l) => l.id === selectedListId);

  return (
    <Card className="p-6 border border-slate-200 dark:border-brand-dark/50">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-on-brand">
          <ListTodo size={18} className="text-brand-dark dark:text-brand" /> משימות גוגל
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={selectedListId ?? ''}
            onChange={(e) => setSelectedListId(e.target.value || null)}
            className="text-sm rounded-lg border border-slate-200 dark:border-brand-dark bg-white dark:bg-brand-surface text-slate-700 dark:text-on-brand px-3 py-2 min-w-[140px]"
            aria-label="בחר רשימת משימות"
          >
            {taskLists.length === 0 && <option value="">טוען...</option>}
            {taskLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="p-2 rounded-lg border border-slate-200 dark:border-brand-dark hover:bg-slate-50 dark:hover:bg-brand-dark/30 transition-colors disabled:opacity-50"
            aria-label="רענן משימות"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
          <p className="mb-2">{error}</p>
          {(error.includes('403') || error.includes('Insufficient') || error.includes('Permission')) && (
            <button
              type="button"
              onClick={handleConnectGoogle}
              disabled={googleLoading}
              className="text-sm font-medium underline hover:no-underline"
            >
              {googleLoading ? '...' : 'בקש גישה למשימות גוגל'}
            </button>
          )}
        </div>
      )}

      {taskLists.length > 0 && selectedListId && (
        <>
          <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="משימה חדשה..."
              className="flex-1 min-w-0 rounded-lg border border-slate-200 dark:border-brand-dark bg-white dark:bg-brand-surface text-slate-800 dark:text-on-brand px-3 py-2 text-sm placeholder:text-slate-400"
              aria-label="הוסף משימה"
            />
            <button
              type="submit"
              disabled={adding || !newTaskTitle.trim()}
              className="shrink-0 p-2 rounded-lg bg-brand-dark dark:bg-brand text-on-brand hover:opacity-90 disabled:opacity-50 transition-opacity"
              aria-label="הוסף"
            >
              <Plus size={18} />
            </button>
          </form>

          {loading && tasks.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-on-brand-muted py-4">טוען משימות...</p>
          ) : (
            <ul className="space-y-2" role="list">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-brand-dark/50 hover:border-slate-200 dark:hover:border-brand-dark/70 transition-colors group"
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="shrink-0 w-6 h-6 rounded-md border flex items-center justify-center border-slate-300 dark:border-on-brand-muted hover:border-brand transition-colors"
                    aria-label={task.status === 'completed' ? 'בטל סימון' : 'סמן כהושלם'}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 size={14} className="text-brand" />
                    ) : (
                      <Circle size={14} className="text-slate-400" />
                    )}
                  </button>
                  <span
                    className={`flex-1 min-w-0 text-sm text-right ${
                      task.status === 'completed'
                        ? 'text-slate-400 line-through dark:text-on-brand-muted'
                        : 'text-slate-700 dark:text-on-brand'
                    }`}
                  >
                    {task.title || 'ללא כותרת'}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="מחק משימה"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!loading && tasks.length === 0 && selectedList && (
            <p className="text-sm text-slate-500 dark:text-on-brand-muted py-4">
              אין משימות ב"{selectedList.title}". הוסף משימה למעלה.
            </p>
          )}
        </>
      )}

      {taskLists.length === 0 && !loading && hasToken && !error && (
        <p className="text-sm text-slate-500 dark:text-on-brand-muted py-4">
          לא נמצאו רשימות משימות. צור רשימה ב־Google Tasks ואז רענן.
        </p>
      )}
    </Card>
  );
}
