import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Briefcase, Target, Calendar, Activity, BookOpen, Wallet, Users, Bell, Settings, Zap, LogOut, Download, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { ProfileModal } from '../modals/ProfileModal';
import { AccessibilityButton, AccessibilityFloatingButton } from '../ui/AccessibilityPanel';
import { exportTradesToCsv, exportDailyTasksToCsv, exportFullBackup } from '../../lib/exportCsv';

const ALL_TABS = [
  { id: 'dashboard', label: 'דשבורד', icon: LayoutDashboard },
  { id: 'trading', label: 'מסחר', icon: TrendingUp },
  { id: 'saas', label: 'SaaS Builder', icon: Briefcase },
  { id: 'vision', label: 'החזון', icon: Target },
  { id: 'health', label: 'בריאות', icon: Activity },
  { id: 'learning', label: 'למידה', icon: BookOpen },
  { id: 'finance', label: 'כספים', icon: Wallet },
  { id: 'relationships', label: 'יחסים', icon: Users },
  { id: 'calendar', label: 'יומן', icon: Calendar },
];

export function Layout({ activeTab, onTabChange, children, enabledCategories = ['dashboard', 'trading', 'saas', 'vision'] }) {
  const TABS = ALL_TABS.filter((tab) => enabledCategories.includes(tab.id));
  const { signOut, hasSupabase } = useAuth();
  const { displayName, trades, dailyTasks, visionMilestones, saasProjects, userXP, userLevel, healthEntries, learningItems, financeGoals, relationshipItems, syncError, setSyncError, syncBannerDismissed, setSyncBannerDismissed } = useApp();
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
      activeTab === tab.id ? 'bg-brand-dark text-on-brand' : 'text-brand-black/70 dark:text-on-brand'
    }`;

  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark text-brand-black dark:text-on-brand font-sans p-3 sm:p-4 md:p-6 transition-colors duration-300 safe-area-pb" dir="rtl">
      <a
        href="#main-content"
        className="absolute right-4 -top-[200%] z-[100] px-4 py-2 bg-brand-dark text-on-brand rounded-lg outline-none focus:top-4 focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-brand-page dark:focus:ring-offset-brand-surface transition-[top]"
      >
        דלג לתוכן הראשי
      </a>
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <header className="flex flex-row justify-between items-center gap-3 md:gap-6 mb-6 md:mb-8 bg-brand-white dark:bg-brand-surface-elevated p-3 md:p-4 pt-safe rounded-2xl border border-slate-200 dark:border-brand/20 shadow-sm sticky top-2 z-40">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="w-10 h-10 shrink-0 bg-brand-dark rounded-xl flex items-center justify-center shadow-lg shadow-brand-dark/30">
              <Zap className="text-brand" fill="currentColor" size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-black tracking-tight leading-none truncate text-brand-black dark:text-on-brand">REFAEL OS</h1>
              <span className="text-[10px] text-brand-black/50 dark:text-on-brand-muted font-medium tracking-widest uppercase hidden sm:inline">Life Management System</span>
            </div>
          </div>

          <nav className="hidden md:flex bg-slate-100 dark:bg-brand-surface p-1.5 rounded-xl overflow-x-auto no-scrollbar" aria-label="ניווט ראשי">
            <div role="tablist" className="flex gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap min-h-[44px] ${
                    activeTab === tab.id
                      ? 'bg-brand-dark text-on-brand shadow-lg shadow-brand-dark/20 scale-100'
                      : 'text-brand-black/60 hover:text-brand-black dark:text-on-brand-muted dark:hover:text-on-brand scale-95 hover:scale-100'
                  }`}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? 'text-brand' : ''} aria-hidden />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex md:hidden items-center gap-1">
            <AccessibilityButton className="w-11 h-11 flex items-center justify-center rounded-xl text-brand-black/70 dark:text-on-brand-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-brand-black/70 dark:text-on-brand-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
              aria-label="תפריט"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <AccessibilityButton className="w-9 h-9 flex items-center justify-center rounded-full text-brand-black/50 dark:text-on-brand-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" />
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full text-brand-black/50 dark:text-on-brand-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'מצב בהיר' : 'מצב כהה'}
              aria-label={isDark ? 'מצב בהיר' : 'מצב כהה'}
            >
              {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
            </button>
            <div className="relative" ref={exportRef}>
              <button
                type="button"
                onClick={() => setShowExport((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-brand-black/50 dark:text-on-brand-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="ייצוא נתונים"
                aria-label="ייצוא נתונים"
                aria-expanded={showExport}
              >
                <Download size={18} aria-hidden />
              </button>
              {showExport && (
                <div className="absolute right-0 top-full mt-1 py-1 w-48 bg-brand-white dark:bg-brand-surface rounded-lg border border-brand-black/10 dark:border-brand-dark/50 shadow-lg z-50">
                  <button
                    type="button"
                    onClick={() => { exportTradesToCsv(trades); setShowExport(false); }}
                    className="block w-full text-right px-3 py-2 text-sm text-brand-black dark:text-on-brand hover:bg-brand-dark/5 dark:hover:bg-brand-dark/50"
                  >
                    ייצוא מסחר (CSV)
                  </button>
                  <button
                    type="button"
                    onClick={() => { exportDailyTasksToCsv(dailyTasks); setShowExport(false); }}
                    className="block w-full text-right px-3 py-2 text-sm text-brand-black dark:text-on-brand hover:bg-brand-dark/5 dark:hover:bg-brand-dark/50"
                  >
                    ייצוא משימות (CSV)
                  </button>
                  <button
                    type="button"
                    onClick={() => { exportFullBackup({ trades, dailyTasks, visionMilestones, saasProjects, userXP, userLevel, displayName, healthEntries, learningItems, financeGoals, relationshipItems }); setShowExport(false); }}
                    className="block w-full text-right px-3 py-2 text-sm text-brand-black dark:text-on-brand hover:bg-brand-dark/5 dark:hover:bg-brand-dark/50 border-t border-brand-black/10 dark:border-brand-dark/50"
                  >
                    גיבוי מלא (JSON)
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full text-brand-black/50 dark:text-on-brand-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="התראות">
              <Bell size={18} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-brand-black/50 dark:text-on-brand-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="פרופיל"
              aria-label="פרופיל"
            >
              <Settings size={18} aria-hidden />
            </button>
            {hasSupabase && (
              <button
                type="button"
                onClick={() => signOut()}
                className="w-9 h-9 flex items-center justify-center rounded-full text-brand-black/50 dark:text-on-brand-muted hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="התנתק"
                aria-label="התנתק"
              >
                <LogOut size={18} aria-hidden />
              </button>
            )}
            <div className="w-9 h-9 rounded-full bg-brand-dark border-2 border-brand-white dark:border-brand shadow-sm flex items-center justify-center" title={displayName || 'פרופיל'} aria-hidden>
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
          <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-brand/20 bg-brand-white dark:bg-brand-dark z-10">
            <span className="font-black text-lg">REFAEL OS</span>
            <button
              type="button"
              onClick={closeMobile}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-brand-black/70 dark:text-on-brand-muted hover:bg-slate-100 dark:hover:bg-slate-800 touch-manipulation"
              aria-label="סגור תפריט"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="p-4 space-y-1" aria-label="ניווט ראשי">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); closeMobile(); }}
                className={navButtonClass(tab)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <tab.icon size={20} className={activeTab === tab.id ? 'text-brand' : ''} aria-hidden />
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="p-4 pt-6 border-t border-slate-200 dark:border-brand/20 space-y-1">
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-brand-surface min-h-[44px]">
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
            <div className="w-full max-w-sm bg-brand-white dark:bg-brand-surface rounded-2xl shadow-xl p-4 space-y-1" onClick={(e) => e.stopPropagation()} dir="rtl">
              <p className="text-sm font-bold text-brand-black dark:text-on-brand-muted pb-2">ייצוא / גיבוי</p>
              <button type="button" onClick={() => { exportTradesToCsv(trades); setShowExport(false); }} className="block w-full text-right px-4 py-3 rounded-xl hover:bg-brand-dark/5 dark:hover:bg-brand-dark/50 min-h-[44px] font-medium text-brand-black dark:text-on-brand">ייצוא מסחר (CSV)</button>
              <button type="button" onClick={() => { exportDailyTasksToCsv(dailyTasks); setShowExport(false); }} className="block w-full text-right px-4 py-3 rounded-xl hover:bg-brand-dark/5 dark:hover:bg-brand-dark/50 min-h-[44px] font-medium text-brand-black dark:text-on-brand">ייצוא משימות (CSV)</button>
              <button type="button" onClick={() => { exportFullBackup({ trades, dailyTasks, visionMilestones, saasProjects, userXP, userLevel, displayName, healthEntries, learningItems, financeGoals, relationshipItems }); setShowExport(false); }} className="block w-full text-right px-4 py-3 rounded-xl hover:bg-brand-dark/5 dark:hover:bg-brand-dark/50 min-h-[44px] font-medium text-brand-black dark:text-on-brand">גיבוי מלא (JSON)</button>
              <button type="button" onClick={() => setShowExport(false)} className="block w-full text-right px-4 py-3 rounded-xl hover:bg-brand-dark/5 dark:hover:bg-brand-dark/50 min-h-[44px] text-brand-black/60 dark:text-on-brand-muted">ביטול</button>
            </div>
          </div>
        )}

        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />

        {syncError && !syncBannerDismissed && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm flex items-center justify-between gap-3" role="alert">
            <span>{syncError}</span>
            <button type="button" onClick={() => setSyncBannerDismissed(true)} className="shrink-0 px-2 py-1 rounded hover:bg-amber-200 dark:hover:bg-amber-800 font-medium" aria-label="סגור">✕</button>
          </div>
        )}
        {syncError && syncBannerDismissed && (
          <div className="mb-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2" role="status">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" aria-hidden />
            <span>אין סנכרון – הנתונים נשמרים מקומית</span>
            <button type="button" onClick={() => setSyncBannerDismissed(false)} className="mr-auto text-[10px] underline hover:no-underline" aria-label="הצג פרטים">הצג</button>
          </div>
        )}

        <AccessibilityFloatingButton />

        <main id="main-content" className="flex-1 pb-safe" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
