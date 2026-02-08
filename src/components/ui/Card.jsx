import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white dark:bg-brand-surface border border-slate-200 dark:border-brand-dark/50 rounded-2xl shadow-sm dark:shadow-brand-dark/20 ${className}`}
    >
      {children}
    </div>
  );
}
