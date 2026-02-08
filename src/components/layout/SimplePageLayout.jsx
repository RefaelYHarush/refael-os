import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';

export function SimplePageLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark text-brand-black dark:text-on-brand" dir="rtl">
      <header className="border-b border-brand-black/8 dark:border-brand/15 bg-brand-page/95 dark:bg-brand-dark/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90">
            <div className="w-10 h-10 bg-brand-dark rounded-card flex items-center justify-center shadow-card">
              <Zap className="text-brand" fill="currentColor" size={20} />
            </div>
            <span className="font-extrabold text-lg text-brand-black dark:text-on-brand">REFAEL OS</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-black/65 dark:text-on-brand-muted hover:text-brand-dark dark:hover:text-brand transition-colors"
          >
            <ArrowRight size={16} />
            חזרה לדף הבית
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold mb-6 text-brand-black dark:text-on-brand">{title}</h1>
        <div className="prose prose-brand max-w-none text-brand-black/85 dark:text-on-brand-muted [&_a]:text-brand-dark dark:[&_a]:text-brand [&_a]:font-semibold [&_a]:underline [&_a]:hover:no-underline">{children}</div>
      </main>
      <footer className="border-t border-brand-black/8 dark:border-brand/15 mt-12 py-6">
        <div className="max-w-3xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm text-brand-black/55 dark:text-on-brand-muted font-medium">
          <Link to="/about" className="hover:text-brand-dark dark:hover:text-brand transition-colors">אודות</Link>
          <Link to="/terms" className="hover:text-brand-dark dark:hover:text-brand transition-colors">תנאי שימוש</Link>
          <Link to="/privacy" className="hover:text-brand-dark dark:hover:text-brand transition-colors">מדיניות פרטיות</Link>
        </div>
      </footer>
    </div>
  );
}
