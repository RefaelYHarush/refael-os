import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../ui/Card';

export function AddTaskModal({ onClose, onSave }) {
  const [label, setLabel] = useState('');
  const [xp, setXp] = useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) return;
    onSave({ label: trimmed, xp: Number(xp) || 50 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-task-title">
      <Card className="w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 id="add-task-title" className="text-lg font-bold">משימה יומית חדשה</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" aria-label="סגור">
            <X size={20} aria-hidden />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="add-task-label" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">תיאור</label>
            <input
              id="add-task-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="למשל: הכנה לשוק, קריאה 30 דק׳"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="add-task-xp" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">XP להשלמה</label>
            <input
              id="add-task-xp"
              type="number"
              min={10}
              max={500}
              value={xp}
              onChange={(e) => setXp(parseInt(e.target.value, 10) || 50)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
              ביטול
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg bg-brand-dark text-white hover:bg-brand-dark/90 font-bold shadow-lg shadow-brand-dark/20">
              הוספה
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
