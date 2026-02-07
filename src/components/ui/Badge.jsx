import React from 'react';

const colors = {
  emerald: 'bg-brand/20 text-brand-dark dark:bg-brand/20 dark:text-brand',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  amber: 'bg-brand/20 text-brand-dark dark:bg-brand/20 dark:text-brand',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  gold: 'bg-brand/20 text-brand-dark dark:bg-brand/20 dark:text-brand',
  brand: 'bg-brand/20 text-brand-dark dark:bg-brand-dark dark:text-brand',
};

export function Badge({ children, color = 'slate' }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[color] || colors.slate}`}
    >
      {children}
    </span>
  );
}
