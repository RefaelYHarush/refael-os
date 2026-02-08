import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../ui/Card';

const SETUPS = ['Opening Range Breakout', 'Reversal', 'Trend Following', 'News Event', 'Choppy', 'Scalp', 'Trend', 'Other'];
const MOODS = ['Calm', 'Anxious', 'Confident', 'Excited', 'Bored', 'Neutral', 'Flow'];

export function AddTradeModal({ onClose, onSave, initialDate }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(initialDate ?? today);
  const [symbol, setSymbol] = useState('NQ');
  const [pnl, setPnl] = useState('');
  const [setup, setSetup] = useState(SETUPS[0]);
  const [mood, setMood] = useState(MOODS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const pnlNum = parseInt(pnl, 10);
    if (Number.isNaN(pnlNum)) return;
    onSave({ date, symbol, pnl: pnlNum, setup, mood });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-trade-title">
      <Card className="w-full max-w-md p-6 shadow-card-dark max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 id="add-trade-title" className="text-lg font-bold text-brand-black dark:text-on-brand">עסקה חדשה</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-button hover:bg-brand-black/5 dark:hover:bg-brand/10 text-brand-black/60 dark:text-on-brand-muted transition-colors" aria-label="סגור">
            <X size={20} aria-hidden />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="add-trade-date" className="label-brand">תאריך</label>
            <input id="add-trade-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-brand" />
          </div>
          <div>
            <label htmlFor="add-trade-symbol" className="label-brand">נכס</label>
            <select id="add-trade-symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="input-brand" aria-label="נכס">
              {['NQ', 'ES', 'GC', 'CL', 'Other'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="add-trade-pnl" className="label-brand">P&L ($)</label>
            <input
              id="add-trade-pnl"
              type="number"
              value={pnl}
              onChange={(e) => setPnl(e.target.value)}
              placeholder="למשל 450 או -120"
              className="input-brand"
              required
            />
          </div>
          <div>
            <label htmlFor="add-trade-setup" className="label-brand">Setup</label>
            <select id="add-trade-setup" value={setup} onChange={(e) => setSetup(e.target.value)} className="input-brand" aria-label="אסטרטגיה">
              {SETUPS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="add-trade-mood" className="label-brand">מצב רוח</label>
            <select id="add-trade-mood" value={mood} onChange={(e) => setMood(e.target.value)} className="input-brand" aria-label="מצב רוח">
              {MOODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-button border border-brand-black/15 dark:border-brand/25 text-brand-black/70 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 font-semibold transition-colors">
              ביטול
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-button bg-brand-dark text-[var(--text-on-dark)] hover:opacity-95 font-bold shadow-card transition-opacity">
              שמירה
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
