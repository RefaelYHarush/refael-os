import React, { useState } from 'react';
import { BookOpen, BookMarked, Lightbulb, Plus, Trash2, Edit2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';

const TYPE_LABELS = { course: 'קורס', book: 'ספר', skill: 'מיומנות' };
const TYPE_ICONS = { course: BookOpen, book: BookMarked, skill: Lightbulb };
const STATUS_LABELS = { planned: 'מתוכנן', in_progress: 'בתהליך', done: 'הושלם' };

export function LearningView() {
  const { learningItems, addLearningItem, updateLearningItem, deleteLearningItem } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'course', status: 'in_progress', progress: 0, note: '' });

  const openAdd = () => {
    setForm({ title: '', type: 'course', status: 'in_progress', progress: 0, note: '' });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({ title: item.title, type: item.type || 'course', status: item.status || 'in_progress', progress: item.progress ?? 0, note: item.note || '' });
    setEditing(item);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateLearningItem({ ...editing, ...form, progress: Number(form.progress) || 0 });
      setEditing(null);
    } else {
      addLearningItem({ ...form, progress: Number(form.progress) || 0 });
    }
    setShowForm(false);
  };

  const setProgress = (item, delta) => {
    const next = Math.min(100, Math.max(0, (item.progress ?? 0) + delta));
    updateLearningItem({ ...item, progress: next, status: next >= 100 ? 'done' : item.status });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-on-brand">למידה</h2>
          <p className="text-sm text-slate-500 dark:text-on-brand-muted">קורסים, ספרים ומיומנויות</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-dark text-on-brand font-bold text-sm hover:bg-brand-dark-hover transition-colors"
        >
          <Plus size={18} /> פריט חדש
        </button>
      </div>

      {showForm && (
        <Card className="p-5 border-t-4 border-t-brand">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">כותרת</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="שם הקורס / הספר / המיומנות"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
                required
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">סוג</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
                >
                  <option value="course">קורס</option>
                  <option value="book">ספר</option>
                  <option value="skill">מיומנות</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">סטטוס</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
                >
                  <option value="planned">מתוכנן</option>
                  <option value="in_progress">בתהליך</option>
                  <option value="done">הושלם</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">התקדמות %</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) => setForm((f) => ({ ...f, progress: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">הערה (אופציונלי)</span>
              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
              />
            </label>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded-lg bg-brand-dark text-on-brand font-medium text-sm">
                {editing ? 'עדכון' : 'הוספה'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 text-slate-600 dark:text-on-brand-muted text-sm">
                ביטול
              </button>
            </div>
          </form>
        </Card>
      )}

      {learningItems.length === 0 ? (
        <Card className="p-8 text-center text-slate-500 dark:text-on-brand-muted">
          <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
          <p>אין עדיין פריטי למידה. הוסף קורס, ספר או מיומנות.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {learningItems.map((item) => {
            const Icon = TYPE_ICONS[item.type] || BookOpen;
            const pct = Math.min(100, Math.max(0, item.progress ?? 0));
            return (
              <Card key={item.id} className="p-4 border-t-4 border-t-brand-dark dark:border-t-brand">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-brand/10 dark:bg-brand/20 shrink-0">
                      <Icon size={18} className="text-brand-dark dark:text-brand" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-on-brand truncate">{item.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-on-brand-muted">
                        {TYPE_LABELS[item.type]} · {STATUS_LABELS[item.status] || item.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setProgress(item, -10)}
                      className="w-8 h-8 rounded-lg border border-slate-200 dark:border-brand-dark/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-brand-dark/30 text-sm font-bold"
                      aria-label="הפחת 10%"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-700 dark:text-on-brand">{pct}%</span>
                    <button
                      type="button"
                      onClick={() => setProgress(item, 10)}
                      className="w-8 h-8 rounded-lg border border-slate-200 dark:border-brand-dark/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-brand-dark/30 text-sm font-bold"
                      aria-label="הוסף 10%"
                    >
                      +
                    </button>
                    <button type="button" onClick={() => openEdit(item)} className="p-2 rounded-lg text-slate-400 hover:text-brand-dark dark:hover:text-brand" aria-label="ערוך">
                      <Edit2 size={16} />
                    </button>
                    <button type="button" onClick={() => deleteLearningItem(item.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500" aria-label="מחק">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar value={pct} colorClass="bg-brand-dark dark:bg-brand" heightClass="h-1.5" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
