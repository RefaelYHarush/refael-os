import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white dark:bg-brand-surface-card border border-slate-200 dark:border-brand/10 rounded-2xl shadow-sm dark:shadow-brand-glow-soft ${className}`}
    >
      {children}
    </div>
  );
}
