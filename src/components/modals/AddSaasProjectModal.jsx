import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';

const STATUS_OPTIONS = [
  { value: 'Idea', label: 'Idea Phase' },
  { value: 'In Progress', label: 'In Development' },
  { value: 'Live', label: 'Live & Growing' },
];

export function AddSaasProjectModal({ project: initialProject, onClose, onSave, onDelete }) {
  const isEdit = !!initialProject;
  const [name, setName] = useState(initialProject?.name ?? '');
  const [status, setStatus] = useState(initialProject?.status ?? 'Idea');
  const [mrr, setMrr] = useState(String(initialProject?.mrr ?? '0'));
  const [tasks, setTasks] = useState(String(initialProject?.tasks ?? '0'));
  const [completed, setCompleted] = useState(String(initialProject?.completed ?? '0'));

  useEffect(() => {
    if (!initialProject) return;
    setName(initialProject.name ?? '');
    setStatus(initialProject.status ?? 'Idea');
    setMrr(String(initialProject.mrr ?? 0));
    setTasks(String(initialProject.tasks ?? 0));
    setCompleted(String(initialProject.completed ?? 0));
  }, [initialProject?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tasksNum = Math.max(0, parseInt(tasks, 10) || 0);
    const completedNum = Math.max(0, Math.min(tasksNum, parseInt(completed, 10) || 0));
    const payload = {
      name: name.trim() || 'פרויקט חדש',
      status,
      mrr: Math.max(0, parseInt(mrr, 10) || 0),
      tasks: tasksNum,
      completed: completedNum,
    };
    onSave(isEdit ? { ...initialProject, ...payload } : payload);
    onClose();
  };

  const handleDelete = () => {
    if (isEdit && onDelete && window.confirm('למחוק את הפרויקט?')) {
      onDelete(initialProject.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-saas-title">
      <Card className="w-full max-w-md p-6 shadow-card-dark max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h3 id="add-saas-title" className="text-lg font-bold text-brand-black dark:text-on-brand">{isEdit ? 'ערוך פרויקט' : 'פרויקט חדש'}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-button hover:bg-brand-black/5 dark:hover:bg-brand/10 text-brand-black/60 dark:text-on-brand-muted transition-colors" aria-label="סגור">
            <X size={20} aria-hidden />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="add-saas-name" className="label-brand">שם הפרויקט</label>
            <input id="add-saas-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="למשל My SaaS" className="input-brand" autoFocus />
          </div>
          <div>
            <label htmlFor="add-saas-status" className="label-brand">סטטוס</label>
            <select id="add-saas-status" value={status} onChange={(e) => setStatus(e.target.value)} className="input-brand" aria-label="סטטוס">
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="add-saas-mrr" className="label-brand">MRR ($)</label>
            <input id="add-saas-mrr" type="number" min="0" value={mrr} onChange={(e) => setMrr(e.target.value)} className="input-brand" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="add-saas-tasks" className="label-brand">סה״כ משימות</label>
              <input id="add-saas-tasks" type="number" min="0" value={tasks} onChange={(e) => setTasks(e.target.value)} className="input-brand" />
            </div>
            <div>
              <label htmlFor="add-saas-completed" className="label-brand">הושלמו</label>
              <input id="add-saas-completed" type="number" min="0" value={completed} onChange={(e) => setCompleted(e.target.value)} className="input-brand" />
            </div>
          </div>
          <div className="flex gap-2 pt-2 flex-wrap">
            {isEdit && onDelete && (
              <button type="button" onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 rounded-button border border-brand-accent-secondary/40 text-brand-accent-secondary hover:bg-brand-accent-secondary/10 font-semibold transition-colors">
                <Trash2 size={16} /> מחיקה
              </button>
            )}
            <button type="button" onClick={onClose} className="flex-1 min-w-[80px] py-2.5 rounded-button border border-brand-black/15 dark:border-brand/25 text-brand-black/70 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 font-semibold transition-colors">
              ביטול
            </button>
            <button type="submit" className="flex-1 min-w-[80px] py-2.5 rounded-button bg-brand-dark text-[var(--text-on-dark)] hover:opacity-95 font-bold shadow-card transition-opacity">
              שמירה
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
