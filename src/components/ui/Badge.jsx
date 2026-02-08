import React from 'react';

/** פלטת צבעים – רק צבעי מותג (ליים, ירוק כהה, אדום משני) */
const colors = {
  emerald: 'bg-brand/20 text-brand-dark dark:bg-brand/20 dark:text-brand',
  blue: 'bg-brand/15 text-brand-dark dark:bg-brand/20 dark:text-brand',
  amber: 'bg-brand/20 text-brand-dark dark:bg-brand/20 dark:text-brand',
  purple: 'bg-brand/15 text-brand-dark dark:bg-brand/20 dark:text-brand',
  slate: 'bg-brand-black/10 text-brand-black/80 dark:bg-brand/15 dark:text-on-brand-muted',
  rose: 'bg-brand-accent-secondary/15 text-brand-accent-secondary dark:bg-brand-accent-secondary/20 dark:text-brand-accent-secondary',
  gold: 'bg-brand/20 text-brand-dark dark:bg-brand/20 dark:text-brand',
  brand: 'bg-brand/20 text-brand-dark dark:bg-brand-dark dark:text-brand',
};

export function Badge({ children, color = 'slate' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-button text-[10px] font-bold uppercase tracking-wider ${colors[color] || colors.slate}`}
    >
      {children}
    </span>
  );
}
