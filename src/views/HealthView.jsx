import React, { useState, useMemo } from 'react';
import { Activity, Moon, Droplets, Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useApp } from '../context/AppContext';

const TYPE_LABELS = { workout: 'אימון', sleep: 'שינה', water: 'מים' };
const TYPE_ICONS = { workout: Activity, sleep: Moon, water: Droplets };
const TYPE_UNITS = { workout: 'דק׳', sleep: 'שעות', water: 'כוסות' };

export function HealthView() {
  const { healthEntries, addHealthEntry, deleteHealthEntry } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), type: 'workout', value: 30, note: '' });

  const byDate = useMemo(() => {
    const map = new Map();
    healthEntries.forEach((e) => {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date).push(e);
    });
    map.forEach((arr) => arr.sort((a, b) => (b.id || 0) - (a.id || 0)));
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 21);
  }, [healthEntries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addHealthEntry({ ...form, value: Number(form.value) || 0 });
    setForm({ date: new Date().toISOString().slice(0, 10), type: 'workout', value: 30, note: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-black dark:text-on-brand">בריאות</h2>
          <p className="text-sm text-brand-black/500 dark:text-on-brand-muted">מעקב אימונים, שינה ומים</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-dark text-on-brand font-bold text-sm hover:bg-brand-dark-hover transition-colors"
        >
          <Plus size={18} /> הוסף רשומה
        </button>
      </div>

      {showForm && (
        <Card className="p-5 border-t-4 border-t-brand">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-brand-black/500 dark:text-on-brand-muted block mb-1">תאריך</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-brand-black/10 dark:border-brand/20 bg-brand-white dark:bg-brand-surface text-brand-black dark:text-on-brand"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-brand-black/500 dark:text-on-brand-muted block mb-1">סוג</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-brand-black/10 dark:border-brand/20 bg-brand-white dark:bg-brand-surface text-brand-black dark:text-on-brand"
                >
                  <option value="workout">אימון</option>
                  <option value="sleep">שינה</option>
                  <option value="water">מים</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-brand-black/500 dark:text-on-brand-muted block mb-1">
                  ערך ({TYPE_UNITS[form.type]})
                </span>
                <input
                  type="number"
                  min="0"
                  step={form.type === 'sleep' ? 0.5 : 1}
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-brand-black/10 dark:border-brand/20 bg-brand-white dark:bg-brand-surface text-brand-black dark:text-on-brand"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-brand-black/500 dark:text-on-brand-muted block mb-1">הערה (אופציונלי)</span>
                <input
                  type="text"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="למשל: אימון כוח, ריצה"
                  className="w-full px-3 py-2 rounded-lg border border-brand-black/10 dark:border-brand/20 bg-brand-white dark:bg-brand-surface text-brand-black dark:text-on-brand"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded-lg bg-brand-dark text-on-brand font-medium text-sm">
                שמירה
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-brand-black/10 dark:border-brand/20 text-brand-black/600 dark:text-on-brand-muted text-sm">
                ביטול
              </button>
            </div>
          </form>
        </Card>
      )}

      {byDate.length === 0 ? (
        <Card className="p-8 text-center text-brand-black/500 dark:text-on-brand-muted">
          <Activity size={40} className="mx-auto mb-3 opacity-50" />
          <p>אין עדיין רשומות. הוסף אימון, שעות שינה או כוסות מים.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {byDate.map(([date, entries]) => (
            <div key={date}>
              <h3 className="text-sm font-bold text-brand-black/500 dark:text-on-brand-muted mb-2">
                {new Date(date + 'T12:00:00').toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
              </h3>
              <div className="space-y-2">
                {entries.map((entry) => {
                  const Icon = TYPE_ICONS[entry.type] || Activity;
                  return (
                    <Card key={entry.id} className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-brand/10 dark:bg-brand/20">
                          <Icon size={18} className="text-brand-dark dark:text-brand" />
                        </div>
                        <div>
                          <span className="font-medium text-brand-black dark:text-on-brand">{TYPE_LABELS[entry.type]}</span>
                          <span className="text-brand-black/500 dark:text-on-brand-muted mr-2">
                            {' '}
                            {entry.value} {TYPE_UNITS[entry.type]}
                          </span>
                          {entry.note && <span className="text-sm text-brand-black/400"> · {entry.note}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteHealthEntry(entry.id)}
                        className="p-2 rounded-lg text-brand-black/400 hover:text-brand-accent-secondary hover:bg-brand-accent-secondary/10 transition-colors"
                        aria-label="מחק"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
