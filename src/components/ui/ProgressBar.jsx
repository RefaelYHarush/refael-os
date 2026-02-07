import React from 'react';

export function ProgressBar({ value, colorClass, heightClass = 'h-2' }) {
  const pct = Math.min(Math.max(Number(value), 0), 100);
  return (
    <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heightClass}`}>
      <div
        className={`${colorClass} h-full transition-all duration-1000 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
