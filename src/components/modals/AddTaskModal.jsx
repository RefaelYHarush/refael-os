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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-task-title">
      <Card className="w-full max-w-md p-6 shadow-card-dark" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 id="add-task-title" className="text-lg font-bold text-brand-black dark:text-on-brand">משימה יומית חדשה</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-button hover:bg-brand-black/5 dark:hover:bg-brand/10 text-brand-black/60 dark:text-on-brand-muted transition-colors" aria-label="סגור">
            <X size={20} aria-hidden />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="add-task-label" className="label-brand">תיאור</label>
            <input
              id="add-task-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="למשל: הכנה לשוק, קריאה 30 דק׳"
              className="input-brand"
              required
            />
          </div>
          <div>
            <label htmlFor="add-task-xp" className="label-brand">XP להשלמה</label>
            <input
              id="add-task-xp"
              type="number"
              min={10}
              max={500}
              value={xp}
              onChange={(e) => setXp(parseInt(e.target.value, 10) || 50)}
              className="input-brand"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-button border border-brand-black/15 dark:border-brand/25 text-brand-black/70 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 font-semibold transition-colors">
              ביטול
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-button bg-brand-dark text-[var(--text-on-dark)] hover:opacity-95 font-bold shadow-card transition-opacity">
              הוספה
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
