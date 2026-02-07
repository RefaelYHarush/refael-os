import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Briefcase, Target, Bell, Settings, Zap, LogOut, Download, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { ProfileModal } from '../modals/ProfileModal';
import { exportTradesToCsv, exportDailyTasksToCsv, exportFullBackup } from '../../lib/exportCsv';

const TABS = [
  { id: 'dashboard', label: 'דשבורד', icon: LayoutDashboard },
  { id: 'trading', label: 'מסחר', icon: TrendingUp },
  { id: 'saas', label: 'SaaS Builder', icon: Briefcase },
  { id: 'vision', label: 'החזון', icon: Target },
];

export function Layout({ activeTab, onTabChange, children }) {
  const { signOut, hasSupabase } = useAuth();
  const { displayName, trades, dailyTasks, visionMilestones, saasProjects, userXP, userLevel } = useApp();
  const { isDark, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const exportRef = useRef(null);
  const avatarLetter = displayName?.trim() ? displayName.trim().charAt(0).toUpperCase() : 'R';

  useEffect(() => {
    const close = (e) => { if (exportRef.current && !exportRef.current.contains(e.target)) setShowExport(false); };
    if (showExport) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [showExport]);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobile = () => setMobileMenuOpen(false);
  const navButtonClass = (tab) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl text-right text-sm font-bold min-h-[44px] touch-manipulation ${
      activeTab === tab.id ? 'bg-brand-dark text-white' : 'text-slate-600 dark:text-slate-300'
    }`;

  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark/95 text-slate-900 dark:text-slate-100 font-sans p-3 sm:p-4 md:p-6 transition-colors duration-300 safe-area-pb" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <header className="flex flex-row justify-between items-center gap-3 md:gap-6 mb-6 md:mb-8 bg-brand-white dark:bg-brand-dark p-3 md:p-4 rounded-2xl border border-slate-200 dark:border-brand-dark/80 shadow-sm sticky top-2 z-40">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="w-10 h-10 shrink-0 bg-brand-dark rounded-xl flex items-center justify-center shadow-lg shadow-brand-dark/30">
              <Zap className="text-brand" fill="currentColor" size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-black tracking-tight leading-none truncate">REFAEL OS</h1>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase hidden sm:inline">Life Management System</span>
            </div>
          </div>

          <nav className="hidden md:flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap min-h-[44px] ${
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

          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
              aria-label="תפריט"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'מצב בהיר' : 'מצב כהה'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
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
                  <button
                    type="button"
                    onClick={() => { exportFullBackup({ trades, dailyTasks, visionMilestones, saasProjects, userXP, userLevel, displayName }); setShowExport(false); }}
                    className="block w-full text-right px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 border-t border-slate-100 dark:border-slate-700"
                  >
                    גיבוי מלא (JSON)
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

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm"
            onClick={closeMobile}
            aria-hidden="true"
          />
        )}
        <div
          className={`fixed top-0 left-0 right-0 bottom-0 z-50 md:hidden bg-brand-white dark:bg-brand-dark overflow-y-auto transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          dir="rtl"
          aria-modal="true"
          aria-label="תפריט ניווט"
        >
          <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-brand-white dark:bg-brand-dark z-10">
            <span className="font-black text-lg">REFAEL OS</span>
            <button
              type="button"
              onClick={closeMobile}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 touch-manipulation"
              aria-label="סגור תפריט"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); closeMobile(); }}
                className={navButtonClass(tab)}
              >
                <tab.icon size={20} className={activeTab === tab.id ? 'text-brand' : ''} />
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="p-4 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-1">
            <button type="button" onClick={() => { toggleTheme(); closeMobile(); }} className={navButtonClass({ id: '' })}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              {isDark ? 'מצב בהיר' : 'מצב כהה'}
            </button>
            <button
              type="button"
              onClick={() => { closeMobile(); setTimeout(() => setShowExport(true), 300); }}
              className={navButtonClass({ id: '' })}
            >
              <Download size={20} />
              ייצוא / גיבוי
            </button>
            <button type="button" onClick={() => { setShowProfile(true); closeMobile(); }} className={navButtonClass({ id: '' })}>
              <Settings size={20} />
              פרופיל
            </button>
            {hasSupabase && (
              <button type="button" onClick={() => { signOut(); closeMobile(); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-right text-sm font-bold min-h-[44px] text-red-600 dark:text-red-400 touch-manipulation">
                <LogOut size={20} />
                התנתק
              </button>
            )}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 min-h-[44px]">
              <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center">
                <span className="text-xs font-bold text-brand">{avatarLetter}</span>
              </div>
              <span className="text-sm font-medium">{displayName || 'פרופיל'}</span>
            </div>
          </div>
        </div>

        {/* Mobile export popover - when opened from mobile menu we need to show export options; keep dropdown logic for when menu is closed */}
        {showExport && (
          <div className="md:hidden fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50" onClick={() => setShowExport(false)}>
            <div className="w-full max-w-sm bg-brand-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 space-y-1" onClick={(e) => e.stopPropagation()} dir="rtl">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400 pb-2">ייצוא / גיבוי</p>
              <button type="button" onClick={() => { exportTradesToCsv(trades); setShowExport(false); }} className="block w-full text-right px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 min-h-[44px] font-medium">ייצוא מסחר (CSV)</button>
              <button type="button" onClick={() => { exportDailyTasksToCsv(dailyTasks); setShowExport(false); }} className="block w-full text-right px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 min-h-[44px] font-medium">ייצוא משימות (CSV)</button>
              <button type="button" onClick={() => { exportFullBackup({ trades, dailyTasks, visionMilestones, saasProjects, userXP, userLevel, displayName }); setShowExport(false); }} className="block w-full text-right px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 min-h-[44px] font-medium">גיבוי מלא (JSON)</button>
              <button type="button" onClick={() => setShowExport(false)} className="block w-full text-right px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 min-h-[44px] text-slate-500">ביטול</button>
            </div>
          </div>
        )}

        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />

        <main className="flex-1 pb-safe">{children}</main>
      </div>
    </div>
  );
}
