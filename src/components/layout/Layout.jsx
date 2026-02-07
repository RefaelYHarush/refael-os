import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Briefcase, Target, Bell, Settings, Zap, LogOut, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ProfileModal } from '../modals/ProfileModal';
import { exportTradesToCsv, exportDailyTasksToCsv } from '../../lib/exportCsv';

const TABS = [
  { id: 'dashboard', label: 'דשבורד', icon: LayoutDashboard },
  { id: 'trading', label: 'מסחר', icon: TrendingUp },
  { id: 'saas', label: 'SaaS Builder', icon: Briefcase },
  { id: 'vision', label: 'החזון', icon: Target },
];

export function Layout({ activeTab, onTabChange, children }) {
  const { signOut, hasSupabase } = useAuth();
  const { displayName, trades, dailyTasks } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef(null);
  const avatarLetter = displayName?.trim() ? displayName.trim().charAt(0).toUpperCase() : 'R';

  useEffect(() => {
    const close = (e) => { if (exportRef.current && !exportRef.current.contains(e.target)) setShowExport(false); };
    if (showExport) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [showExport]);

  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark/95 text-slate-900 dark:text-slate-100 font-sans p-4 md:p-6 transition-colors duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-brand-white dark:bg-brand-dark p-4 rounded-2xl border border-slate-200 dark:border-brand-dark/80 shadow-sm sticky top-2 z-50">
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
            <div className="relative" ref={exportRef}>
              <button
                type="button"
                onClick={() => setShowExport((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="ייצוא נתונים"
              >
                <Download size={18} />
              </button>
              {showExport && (
                <div className="absolute right-0 top-full mt-1 py-1 w-48 bg-brand-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg z-50">
                  <button
                    type="button"
                    onClick={() => { exportTradesToCsv(trades); setShowExport(false); }}
                    className="block w-full text-right px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    ייצוא מסחר (CSV)
                  </button>
                  <button
                    type="button"
                    onClick={() => { exportDailyTasksToCsv(dailyTasks); setShowExport(false); }}
                    className="block w-full text-right px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    ייצוא משימות (CSV)
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell size={18} />
            </button>
            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="פרופיל"
            >
              <Settings size={18} />
            </button>
            {hasSupabase && (
              <button
                type="button"
                onClick={() => signOut()}
                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="התנתק"
              >
                <LogOut size={18} />
              </button>
            )}
            <div className="w-9 h-9 rounded-full bg-brand-dark border-2 border-white dark:border-brand shadow-sm flex items-center justify-center" title={displayName || 'פרופיל'}>
              <span className="text-xs font-bold text-brand">{avatarLetter}</span>
            </div>
          </div>
        </header>

        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
