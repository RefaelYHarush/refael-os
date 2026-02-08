import React, { useState } from 'react';
import { Wallet, Plus, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';

function formatMoney(n) {
  return new Intl.NumberFormat('he-IL', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n) + ' ₪';
}

export function FinanceView() {
  const { financeGoals, addFinanceGoal, updateFinanceGoal, deleteFinanceGoal } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', targetAmount: 10000, currentAmount: 0, deadline: '' });

  const openAdd = () => {
    setForm({ name: '', targetAmount: 10000, currentAmount: 0, deadline: '' });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (goal) => {
    setForm({
      name: goal.name,
      targetAmount: goal.targetAmount ?? 0,
      currentAmount: goal.currentAmount ?? 0,
      deadline: goal.deadline || '',
    });
    setEditing(goal);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount) || 0,
      currentAmount: Number(form.currentAmount) || 0,
      deadline: form.deadline.trim() || undefined,
    };
    if (editing) {
      updateFinanceGoal({ ...editing, ...payload });
      setEditing(null);
    } else {
      addFinanceGoal(payload);
    }
    setShowForm(false);
  };

  const setCurrentAmount = (goal, value) => {
    const n = Math.max(0, Number(value) || 0);
    updateFinanceGoal({ ...goal, currentAmount: n });
  };

  const totalTarget = financeGoals.reduce((s, g) => s + (g.targetAmount || 0), 0);
  const totalCurrent = financeGoals.reduce((s, g) => s + (g.currentAmount || 0), 0);
  const overallPct = totalTarget > 0 ? Math.min(100, (totalCurrent / totalTarget) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-on-brand">כספים</h2>
          <p className="text-sm text-slate-500 dark:text-on-brand-muted">יעדי חיסכון ומעקב התקדמות</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-dark text-on-brand font-bold text-sm hover:bg-brand-dark-hover transition-colors"
        >
          <Plus size={18} /> יעד חדש
        </button>
      </div>

      {financeGoals.length > 0 && (
        <Card className="p-5 bg-brand-dark text-on-brand border-brand-dark">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={22} className="text-brand" />
            <span className="font-bold">סה״כ חיסכון</span>
          </div>
          <div className="text-2xl font-black mb-2">{formatMoney(totalCurrent)}</div>
          <div className="text-sm text-on-brand-muted mb-2">מתוך {formatMoney(totalTarget)}</div>
          <ProgressBar value={overallPct} colorClass="bg-brand" heightClass="h-2" />
        </Card>
      )}

      {showForm && (
        <Card className="p-5 border-t-4 border-t-brand">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">שם היעד</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="למשל: קופת חירום, רכב"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
                required
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">יעד (₪)</span>
                <input
                  type="number"
                  min="0"
                  value={form.targetAmount}
                  onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">נצבר עד כה (₪)</span>
                <input
                  type="number"
                  min="0"
                  value={form.currentAmount}
                  onChange={(e) => setForm((f) => ({ ...f, currentAmount: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">דדליין (אופציונלי, למשל 2025-12)</span>
              <input
                type="text"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                placeholder="YYYY-MM"
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

      {financeGoals.length === 0 && !showForm ? (
        <Card className="p-8 text-center text-slate-500 dark:text-on-brand-muted">
          <Wallet size={40} className="mx-auto mb-3 opacity-50" />
          <p>אין עדיין יעדי חיסכון. הוסף יעד והתחל לעקוב.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {financeGoals.map((goal) => {
            const target = goal.targetAmount || 1;
            const current = goal.currentAmount || 0;
            const pct = Math.min(100, (current / target) * 100);
            return (
              <Card key={goal.id} className="p-4 border-t-4 border-t-brand-dark dark:border-t-brand">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-on-brand">{goal.name}</h3>
                    {goal.deadline && (
                      <p className="text-xs text-slate-500 dark:text-on-brand-muted">יעד: {goal.deadline}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => openEdit(goal)} className="p-2 rounded-lg text-slate-400 hover:text-brand-dark dark:hover:text-brand" aria-label="ערוך">
                      <Edit2 size={16} />
                    </button>
                    <button type="button" onClick={() => deleteFinanceGoal(goal.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500" aria-label="מחק">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <span className="text-lg font-black text-brand-dark dark:text-brand">{formatMoney(current)}</span>
                  <span className="text-slate-400 dark:text-on-brand-muted">/</span>
                  <span className="text-slate-600 dark:text-on-brand-muted">{formatMoney(goal.targetAmount)}</span>
                  <input
                    type="number"
                    min="0"
                    value={current}
                    onChange={(e) => setCurrentAmount(goal, e.target.value)}
                    className="w-24 px-2 py-1 text-sm rounded border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
                    aria-label="עדכן סכום נצבר"
                  />
                  <span className="text-xs text-slate-500">עדכן נצבר</span>
                </div>
                <div className="mt-2">
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
