import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../ui/Card';

const SETUPS = ['Opening Range Breakout', 'Reversal', 'Trend Following', 'News Event', 'Choppy', 'Scalp', 'Trend', 'Other'];
const MOODS = ['Calm', 'Anxious', 'Confident', 'Excited', 'Bored', 'Neutral', 'Flow'];

export function AddTradeModal({ onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <Card className="w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">עסקה חדשה</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">תאריך</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">נכס</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {['NQ', 'ES', 'GC', 'CL', 'Other'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">P&L ($)</label>
            <input
              type="number"
              value={pnl}
              onChange={(e) => setPnl(e.target.value)}
              placeholder="למשל 450 או -120"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Setup</label>
            <select
              value={setup}
              onChange={(e) => setSetup(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {SETUPS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">מצב רוח</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {MOODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
              ביטול
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg bg-brand-dark text-white hover:bg-brand-dark/90 font-bold shadow-lg shadow-brand-dark/20">
              שמירה
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
