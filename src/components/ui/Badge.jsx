import React from 'react';

/* פלטת נגישות בלבד – צבעי מותג מהלוגו */
const colors = {
  emerald: 'bg-brand/20 text-brand-dark dark:bg-brand/20 dark:text-brand',
  blue: 'bg-brand/15 text-brand-dark dark:bg-brand/20 dark:text-brand',
  amber: 'bg-brand/20 text-brand-dark dark:bg-brand/20 dark:text-brand',
  purple: 'bg-brand/15 text-brand-dark dark:bg-brand/20 dark:text-brand',
  slate: 'bg-slate-100 text-slate-700 dark:bg-brand-dark/60 dark:text-on-brand-muted',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
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
