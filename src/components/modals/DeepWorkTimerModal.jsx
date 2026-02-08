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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="timer-title">
      <Card className="w-full max-w-sm p-6 shadow-card-dark text-center" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h3 id="timer-title" className="text-lg font-bold text-brand-black dark:text-on-brand">Deep Work Timer</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-button hover:bg-brand-black/5 dark:hover:bg-brand/10 text-brand-black/60 dark:text-on-brand-muted transition-colors" aria-label="סגור">
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-button bg-brand-dark text-[var(--text-on-dark)] font-bold shadow-card hover:opacity-95 transition-opacity"
            aria-label={running ? 'השהה' : 'התחל'}
          >
            {running ? <Pause size={20} /> : <Play size={20} />}
            {running ? 'השהה' : 'התחל'}
          </button>
          <button
            type="button"
            onClick={() => { setRunning(false); setSecondsLeft(DEFAULT_MINUTES * 60); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-button border border-brand-black/15 dark:border-brand/25 text-brand-black/70 dark:text-on-brand-muted font-semibold hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors"
            aria-label="איפוס"
          >
            <RotateCcw size={18} /> איפוס
          </button>
        </div>
        <p className="text-xs text-brand-black/55 dark:text-on-brand-muted mt-4">סשן עבודה מרוכזת ({DEFAULT_MINUTES} דקות)</p>
      </Card>
    </div>
  );
}
