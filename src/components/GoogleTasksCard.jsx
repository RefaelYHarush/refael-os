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
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-brand/15 dark:bg-brand/20 rounded-card shrink-0">
            <ListTodo size={20} className="text-brand-dark dark:text-brand" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-brand-black dark:text-on-brand mb-1">משימות גוגל</h3>
            <p className="text-sm text-brand-black/65 dark:text-on-brand-muted mb-4">
              כדי לראות ולנהל משימות גוגל מהאתר, התחבר עם גוגל ואשר גישה ל־Google Tasks בהמשך ההתחברות.
            </p>
            <button
              type="button"
              onClick={handleConnectGoogle}
              disabled={googleLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-button bg-brand-dark/10 dark:bg-brand/15 hover:bg-brand-dark/15 dark:hover:bg-brand/20 border border-brand-dark/20 dark:border-brand/25 font-semibold text-brand-black dark:text-on-brand transition-colors disabled:opacity-60"
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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-bold flex items-center gap-2 text-brand-black dark:text-on-brand">
          <ListTodo size={18} className="text-brand-dark dark:text-brand" /> משימות גוגל
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={selectedListId ?? ''}
            onChange={(e) => setSelectedListId(e.target.value || null)}
            className="text-sm rounded-button border border-brand-black/15 dark:border-brand/25 bg-brand-white dark:bg-brand-surface text-brand-black dark:text-on-brand px-3 py-2 min-w-[140px] focus:ring-2 focus:ring-brand focus:border-transparent"
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
            className="p-2 rounded-button border border-brand-black/12 dark:border-brand/20 hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors disabled:opacity-50"
            aria-label="רענן משימות"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-card bg-brand-accent-secondary/10 border border-brand-accent-secondary/20 text-brand-accent-secondary text-sm">
          <p className="mb-2">{error}</p>
          {(error.includes('403') || error.includes('Insufficient') || error.includes('Permission')) && (
            <button
              type="button"
              onClick={handleConnectGoogle}
              disabled={googleLoading}
              className="text-sm font-semibold underline hover:no-underline"
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
              className="flex-1 min-w-0 rounded-button border border-brand-black/15 dark:border-brand/25 bg-brand-white dark:bg-brand-surface text-brand-black dark:text-on-brand px-3 py-2 text-sm placeholder-brand-black/40 dark:placeholder-brand/50 focus:ring-2 focus:ring-brand focus:border-transparent"
              aria-label="הוסף משימה"
            />
            <button
              type="submit"
              disabled={adding || !newTaskTitle.trim()}
              className="shrink-0 p-2 rounded-button bg-brand-dark text-[var(--text-on-dark)] hover:opacity-95 disabled:opacity-50 transition-opacity"
              aria-label="הוסף"
            >
              <Plus size={18} />
            </button>
          </form>

          {loading && tasks.length === 0 ? (
            <p className="text-sm text-brand-black/55 dark:text-on-brand-muted py-4">טוען משימות...</p>
          ) : (
            <ul className="space-y-2" role="list">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-button border border-brand-black/8 dark:border-brand/15 hover:border-brand/25 dark:hover:border-brand/25 transition-colors group"
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center border-brand-black/25 dark:border-on-brand-muted hover:border-brand transition-colors"
                    aria-label={task.status === 'completed' ? 'בטל סימון' : 'סמן כהושלם'}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 size={14} className="text-brand" />
                    ) : (
                      <Circle size={14} className="text-brand-black/40 dark:text-on-brand-muted" />
                    )}
                  </button>
                  <span
                    className={`flex-1 min-w-0 text-sm text-right font-medium ${
                      task.status === 'completed'
                        ? 'text-brand-black/50 line-through dark:text-on-brand-muted'
                        : 'text-brand-black dark:text-on-brand'
                    }`}
                  >
                    {task.title || 'ללא כותרת'}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="shrink-0 p-1.5 rounded-button text-brand-black/45 dark:text-on-brand-muted hover:text-brand-accent-secondary hover:bg-brand-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="מחק משימה"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!loading && tasks.length === 0 && selectedList && (
            <p className="text-sm text-brand-black/55 dark:text-on-brand-muted py-4">
              אין משימות ב"{selectedList.title}". הוסף משימה למעלה.
            </p>
          )}
        </>
      )}

      {taskLists.length === 0 && !loading && hasToken && !error && (
        <div className="text-sm text-brand-black/55 dark:text-on-brand-muted py-4 space-y-2">
          <p>לא נמצאו רשימות משימות.</p>
          <p>אם התחברת בלי לאשר גישה למשימות: התחבר מחדש עם גוגל ואשר גישה ל־Google Tasks, או צור רשימה ב־Google Tasks ורענן.</p>
        </div>
      )}
    </Card>
  );
}
