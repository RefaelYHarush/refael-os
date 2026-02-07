import React from 'react';
import { LayoutDashboard, TrendingUp, Briefcase, Target, Bell, Settings, Zap } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'דשבורד', icon: LayoutDashboard },
  { id: 'trading', label: 'מסחר', icon: TrendingUp },
  { id: 'saas', label: 'SaaS Builder', icon: Briefcase },
  { id: 'vision', label: 'החזון', icon: Target },
];

export function Layout({ activeTab, onTabChange, children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark/95 text-slate-900 dark:text-slate-100 font-sans p-4 md:p-6 transition-colors duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white dark:bg-brand-dark p-4 rounded-2xl border border-slate-200 dark:border-brand-dark/80 shadow-sm sticky top-2 z-50">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center shadow-lg shadow-brand-dark/30">
              <Zap className="text-brand" fill="currentColor" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">REFAEL OS</h1>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Life Management System</span>
            </div>
          </div>

          <nav className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl overflow-x-auto w-full md:w-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-dark text-white shadow-lg shadow-brand-dark/20 scale-100'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 scale-95 hover:scale-100'
                }`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? 'text-brand' : ''} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell size={18} />
            </button>
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Settings size={18} />
            </button>
            <div className="w-9 h-9 rounded-full bg-brand-dark border-2 border-white dark:border-brand shadow-sm flex items-center justify-center">
              <span className="text-xs font-bold text-brand">R</span>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
