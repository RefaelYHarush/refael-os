import React, { useState, useEffect } from 'react';
import { X, Trash2, Pencil } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const SETUPS = ['Opening Range Breakout', 'Reversal', 'Trend Following', 'News Event', 'Choppy', 'Scalp', 'Trend', 'Other'];
const MOODS = ['Calm', 'Anxious', 'Confident', 'Excited', 'Bored', 'Neutral', 'Flow'];

export function TradeDetailModal({ trade, onClose, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(trade?.date ?? '');
  const [symbol, setSymbol] = useState(trade?.symbol ?? 'NQ');
  const [pnl, setPnl] = useState(trade != null ? String(trade.pnl) : '');
  const [setup, setSetup] = useState(trade?.setup ?? SETUPS[0]);
  const [mood, setMood] = useState(trade?.mood ?? MOODS[0]);

  useEffect(() => {
    if (!trade) return;
    setDate(trade.date);
    setSymbol(trade.symbol ?? 'NQ');
    setPnl(String(trade.pnl));
    setSetup(trade.setup ?? SETUPS[0]);
    setMood(trade.mood ?? MOODS[0]);
  }, [trade?.id]);

  if (!trade) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const pnlNum = parseInt(pnl, 10);
    if (Number.isNaN(pnlNum)) return;
    onUpdate({ ...trade, date, symbol, pnl: pnlNum, setup, mood });
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('למחוק את העסקה?')) {
      onDelete(trade.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="trade-detail-title">
      <Card className="w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h3 id="trade-detail-title" className="text-lg font-bold">פרטי עסקה</h3>
          <div className="flex items-center gap-1">
            {!editing ? (
              <button type="button" onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" aria-label="ערוך">
                <Pencil size={18} aria-hidden />
              </button>
            ) : null}
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" aria-label="סגור">
              <X size={20} aria-hidden />
            </button>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="trade-edit-date" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">תאריך</label>
              <input id="trade-edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" required />
            </div>
            <div>
              <label htmlFor="trade-edit-symbol" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">נכס</label>
              <select id="trade-edit-symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                {['NQ', 'ES', 'GC', 'CL', 'Other'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="trade-edit-pnl" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">P&L ($)</label>
              <input id="trade-edit-pnl" type="number" value={pnl} onChange={(e) => setPnl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" required />
            </div>
            <div>
              <label htmlFor="trade-edit-setup" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Setup</label>
              <select id="trade-edit-setup" value={setup} onChange={(e) => setSetup(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                {SETUPS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="trade-edit-mood" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">מצב רוח</label>
              <select id="trade-edit-mood" value={mood} onChange={(e) => setMood(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium">ביטול</button>
              <button type="submit" className="flex-1 py-2 rounded-lg bg-brand-dark text-white font-bold">שמירה</button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">תאריך</span>
                <span className="font-medium">{trade.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">נכס</span>
                <span className="font-bold">{trade.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">אסטרטגיה</span>
                <Badge color="blue">{trade.setup}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">מצב רוח</span>
                <span>{trade.mood}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">P&L</span>
                <span className={`font-bold ${trade.pnl >= 0 ? 'text-brand-dark dark:text-brand' : 'text-rose-500'}`}>
                  {trade.pnl >= 0 ? '+' : ''}{trade.pnl}$
                </span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button type="button" onClick={handleDelete} className="flex-1 py-2 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-medium flex items-center justify-center gap-2">
                <Trash2 size={16} /> מחיקה
              </button>
              <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">סגור</button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
