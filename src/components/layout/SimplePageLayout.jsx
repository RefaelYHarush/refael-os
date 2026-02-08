import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';

export function SimplePageLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark/95 text-slate-900 dark:text-slate-100" dir="rtl">
      <header className="border-b border-slate-200 dark:border-slate-700/50 bg-brand-white/95 dark:bg-brand-dark/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90">
            <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center">
              <Zap className="text-brand" fill="currentColor" size={18} />
            </div>
            <span className="font-black text-lg">REFAEL OS</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-dark dark:hover:text-brand transition-colors"
          >
            <ArrowRight size={16} />
            חזרה לדף הבית
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">{children}</div>
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-700/50 mt-12 py-4">
        <div className="max-w-3xl mx-auto px-4 flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/about" className="hover:text-brand-dark dark:hover:text-brand transition-colors">אודות</Link>
          <Link to="/terms" className="hover:text-brand-dark dark:hover:text-brand transition-colors">תנאי שימוש</Link>
          <Link to="/privacy" className="hover:text-brand-dark dark:hover:text-brand transition-colors">מדיניות פרטיות</Link>
        </div>
      </footer>
    </div>
  );
}
