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

  const btnClose = 'p-2 rounded-button hover:bg-brand-black/5 dark:hover:bg-brand/10 text-brand-black/60 dark:text-on-brand-muted transition-colors';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="trade-detail-title">
      <Card className="w-full max-w-md p-6 shadow-card-dark" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h3 id="trade-detail-title" className="text-lg font-bold text-brand-black dark:text-on-brand">פרטי עסקה</h3>
          <div className="flex items-center gap-1">
            {!editing ? (
              <button type="button" onClick={() => setEditing(true)} className={btnClose} aria-label="ערוך">
                <Pencil size={18} aria-hidden />
              </button>
            ) : null}
            <button type="button" onClick={onClose} className={btnClose} aria-label="סגור">
              <X size={20} aria-hidden />
            </button>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="trade-edit-date" className="label-brand">תאריך</label>
              <input id="trade-edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-brand" required />
            </div>
            <div>
              <label htmlFor="trade-edit-symbol" className="label-brand">נכס</label>
              <select id="trade-edit-symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="input-brand">
                {['NQ', 'ES', 'GC', 'CL', 'Other'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="trade-edit-pnl" className="label-brand">P&L ($)</label>
              <input id="trade-edit-pnl" type="number" value={pnl} onChange={(e) => setPnl(e.target.value)} className="input-brand" required />
            </div>
            <div>
              <label htmlFor="trade-edit-setup" className="label-brand">Setup</label>
              <select id="trade-edit-setup" value={setup} onChange={(e) => setSetup(e.target.value)} className="input-brand">
                {SETUPS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="trade-edit-mood" className="label-brand">מצב רוח</label>
              <select id="trade-edit-mood" value={mood} onChange={(e) => setMood(e.target.value)} className="input-brand">
                {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-button border border-brand-black/15 dark:border-brand/25 text-brand-black/70 dark:text-on-brand-muted font-semibold hover:bg-brand-black/5 dark:hover:bg-brand/10">ביטול</button>
              <button type="submit" className="flex-1 py-2.5 rounded-button bg-brand-dark text-[var(--text-on-dark)] font-bold hover:opacity-95">שמירה</button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-black/55 dark:text-on-brand-muted">תאריך</span>
                <span className="font-medium text-brand-black dark:text-on-brand">{trade.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-black/55 dark:text-on-brand-muted">נכס</span>
                <span className="font-bold text-brand-black dark:text-on-brand">{trade.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-black/55 dark:text-on-brand-muted">אסטרטגיה</span>
                <Badge color="blue">{trade.setup}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-black/55 dark:text-on-brand-muted">מצב רוח</span>
                <span className="text-brand-black dark:text-on-brand">{trade.mood}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-black/55 dark:text-on-brand-muted">P&L</span>
                <span className={`font-bold ${trade.pnl >= 0 ? 'text-brand-dark dark:text-brand' : 'text-brand-accent-secondary'}`}>
                  {trade.pnl >= 0 ? '+' : ''}{trade.pnl}$
                </span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-brand-black/8 dark:border-brand/15 flex gap-2">
              <button type="button" onClick={handleDelete} className="flex-1 py-2.5 rounded-button border border-brand-accent-secondary/40 text-brand-accent-secondary hover:bg-brand-accent-secondary/10 font-semibold flex items-center justify-center gap-2 transition-colors">
                <Trash2 size={16} /> מחיקה
              </button>
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-button bg-brand-black/5 dark:bg-brand/10 text-brand-black dark:text-on-brand font-semibold hover:bg-brand-black/10 dark:hover:bg-brand/15 transition-colors">סגור</button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
