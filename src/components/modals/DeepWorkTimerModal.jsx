import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { Card } from '../ui/Card';

const DEFAULT_MINUTES = 25;

export function DeepWorkTimerModal({ onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const display = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="timer-title">
      <Card className="w-full max-w-sm p-6 shadow-xl text-center" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h3 id="timer-title" className="text-lg font-bold">Deep Work Timer</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" aria-label="סגור">
            <X size={20} aria-hidden />
          </button>
        </div>
        <div className="text-5xl font-mono font-bold text-brand-dark dark:text-brand mb-6 tabular-nums" aria-live="polite">
          {display}
        </div>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-dark text-white font-bold shadow-lg hover:opacity-90"
            aria-label={running ? 'השהה' : 'התחל'}
          >
            {running ? <Pause size={20} /> : <Play size={20} />}
            {running ? 'השהה' : 'התחל'}
          </button>
          <button
            type="button"
            onClick={() => { setRunning(false); setSecondsLeft(DEFAULT_MINUTES * 60); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            aria-label="איפוס"
          >
            <RotateCcw size={18} /> איפוס
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">סשן עבודה מרוכזת ({DEFAULT_MINUTES} דקות)</p>
      </Card>
    </div>
  );
}
