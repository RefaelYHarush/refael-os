import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-brand-white dark:bg-brand-surface-card border border-brand-black/8 dark:border-brand/15 rounded-card shadow-card dark:shadow-card-dark ${className}`}
    >
      {children}
    </div>
  );
}
