import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Briefcase, Target, Calendar, Activity, BookOpen, Wallet, Users, Bell, Settings, Zap, LogOut, Download, Sun, Moon, Menu, X, CloudOff } from 'lucide-react';
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

  const navBtn = (tab) =>
    `flex items-center gap-2.5 w-full px-4 py-3 rounded-button text-right text-sm font-semibold min-h-[44px] touch-manipulation transition-colors ${
      activeTab === tab.id
        ? 'bg-brand-dark text-[var(--text-on-dark)]'
        : 'text-brand-black/75 dark:text-on-brand-muted hover:text-brand-black dark:hover:text-on-brand hover:bg-brand-black/5 dark:hover:bg-brand/10'
    }`;

  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark transition-colors duration-300 safe-area-pb" dir="rtl">
      <a
        href="#main-content"
        className="absolute right-4 -top-[200%] z-[100] px-4 py-2 bg-brand-dark text-[var(--text-on-dark)] rounded-button outline-none focus:top-4 focus:ring-2 focus:ring-[var(--brand-light)] focus:ring-offset-2 focus:ring-offset-[var(--brand-page)] dark:focus:ring-offset-brand-surface transition-[top]"
      >
        דלג לתוכן הראשי
      </a>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-full">
        <header className="flex flex-wrap items-center justify-between gap-4 py-5 border-b border-brand-black/8 dark:border-brand/15">
          <div className="flex items-center gap-3 min-w-0">
            {syncError && (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-button bg-brand-accent-secondary/10 border border-brand-accent-secondary/25 text-brand-accent-secondary text-xs font-medium" title="אין סנכרון – הנתונים נשמרים מקומית">
                <CloudOff size={14} aria-hidden />
                <span className="hidden sm:inline">ללא סנכרון</span>
              </span>
            )}
            <div className="w-11 h-11 rounded-card flex items-center justify-center bg-brand-dark shadow-card dark:shadow-card-dark">
              <Zap className="text-brand" fill="currentColor" size={22} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight text-brand-black dark:text-on-brand truncate">REFAEL OS</h1>
              <span className="text-[10px] text-brand-black/50 dark:text-on-brand-muted font-medium tracking-widest uppercase hidden sm:inline">Life Management</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 p-1 rounded-card bg-brand-black/5 dark:bg-brand-surface" aria-label="ניווט ראשי">
            <div role="tablist" className="flex gap-0.5">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-button text-sm font-semibold transition-all whitespace-nowrap min-h-[44px] ${
                    activeTab === tab.id
                      ? 'bg-brand-dark text-[var(--text-on-dark)] shadow-card'
                      : 'text-brand-black/65 dark:text-on-brand-muted hover:text-brand-black dark:hover:text-on-brand'
                  }`}
                >
                  <tab.icon size={17} className={activeTab === tab.id ? 'text-brand' : ''} aria-hidden />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-1">
            <AccessibilityButton className="w-10 h-10 flex items-center justify-center rounded-button text-brand-black/60 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors touch-manipulation hidden md:flex" />
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-button text-brand-black/60 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors touch-manipulation hidden md:flex"
              title={isDark ? 'מצב בהיר' : 'מצב כהה'}
              aria-label={isDark ? 'מצב בהיר' : 'מצב כהה'}
            >
              {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
            </button>
            <div className="relative hidden md:block" ref={exportRef}>
              <button
                type="button"
                onClick={() => setShowExport((v) => !v)}
                className="w-10 h-10 flex items-center justify-center rounded-button text-brand-black/60 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors"
                title="ייצוא נתונים"
                aria-label="ייצוא נתונים"
                aria-expanded={showExport}
              >
                <Download size={18} aria-hidden />
              </button>
              {showExport && (
                <div className="absolute right-0 top-full mt-2 py-1.5 w-52 bg-brand-white dark:bg-brand-surface-card rounded-card border border-brand-black/10 dark:border-brand/20 shadow-card-dark z-50">
                  <button type="button" onClick={() => { exportTradesToCsv(trades); setShowExport(false); }} className="block w-full text-right px-4 py-2.5 text-sm text-brand-black dark:text-on-brand hover:bg-brand-dark/5 dark:hover:bg-brand/10 font-medium">
                    ייצוא מסחר (CSV)
                  </button>
                  <button type="button" onClick={() => { exportDailyTasksToCsv(dailyTasks); setShowExport(false); }} className="block w-full text-right px-4 py-2.5 text-sm text-brand-black dark:text-on-brand hover:bg-brand-dark/5 dark:hover:bg-brand/10 font-medium">
                    ייצוא משימות (CSV)
                  </button>
                  <button type="button" onClick={() => { exportFullBackup({ trades, dailyTasks, visionMilestones, saasProjects, userXP, userLevel, displayName, healthEntries, learningItems, financeGoals, relationshipItems }); setShowExport(false); }} className="block w-full text-right px-4 py-2.5 text-sm text-brand-black dark:text-on-brand hover:bg-brand-dark/5 dark:hover:bg-brand/10 font-medium border-t border-brand-black/8 dark:border-brand/15">
                    גיבוי מלא (JSON)
                  </button>
                </div>
              )}
            </div>
            <button type="button" disabled className="w-10 h-10 flex items-center justify-center rounded-button text-brand-black/40 dark:text-on-brand-muted cursor-not-allowed opacity-70 hidden md:flex" title="התראות – בקרוב" aria-label="התראות – בקרוב">
              <Bell size={18} aria-hidden />
            </button>
            <button type="button" onClick={() => setShowProfile(true)} className="w-10 h-10 flex items-center justify-center rounded-button text-brand-black/60 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors" title="פרופיל" aria-label="פרופיל">
              <Settings size={18} aria-hidden />
            </button>
            {hasSupabase && (
              <button type="button" onClick={() => signOut()} className="w-10 h-10 flex items-center justify-center rounded-button text-brand-black/60 dark:text-on-brand-muted hover:bg-brand-accent-secondary/10 hover:text-brand-accent-secondary transition-colors" title="התנתק" aria-label="התנתק">
                <LogOut size={18} aria-hidden />
              </button>
            )}
            <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center border-2 border-brand-white dark:border-brand/30 shadow-card" title={displayName || 'פרופיל'} aria-hidden>
              <span className="text-sm font-bold text-brand">{avatarLetter}</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-button text-brand-black/70 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors touch-manipulation"
              aria-label="תפריט"
            >
              <Menu size={22} />
            </button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-brand-black/40 backdrop-blur-sm" onClick={closeMobile} aria-hidden="true" />
        )}
        <div
          className={`fixed top-0 left-0 right-0 bottom-0 z-50 md:hidden bg-brand-page dark:bg-brand-dark overflow-y-auto transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          dir="rtl"
          aria-modal="true"
          aria-label="תפריט ניווט"
        >
          <div className="sticky top-0 flex items-center justify-between p-5 border-b border-brand-black/8 dark:border-brand/15 bg-brand-page dark:bg-brand-dark z-10">
            <span className="font-extrabold text-lg text-brand-black dark:text-on-brand">REFAEL OS</span>
            <button type="button" onClick={closeMobile} className="w-11 h-11 flex items-center justify-center rounded-button text-brand-black/70 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 touch-manipulation" aria-label="סגור תפריט">
              <X size={22} />
            </button>
          </div>
          <nav className="p-4 space-y-0.5" aria-label="ניווט ראשי">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); closeMobile(); }}
                className={navBtn(tab)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <tab.icon size={20} className={activeTab === tab.id ? 'text-brand' : ''} aria-hidden />
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="p-4 pt-6 border-t border-brand-black/8 dark:border-brand/15 space-y-0.5">
            <button type="button" onClick={() => { toggleTheme(); closeMobile(); }} className={navBtn({ id: '' })}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              {isDark ? 'מצב בהיר' : 'מצב כהה'}
            </button>
            <button type="button" onClick={() => { closeMobile(); setTimeout(() => setShowExport(true), 300); }} className={navBtn({ id: '' })}>
              <Download size={20} />
              ייצוא / גיבוי
            </button>
            <button type="button" onClick={() => { setShowProfile(true); closeMobile(); }} className={navBtn({ id: '' })}>
              <Settings size={20} />
              פרופיל
            </button>
            {hasSupabase && (
              <button type="button" onClick={() => { signOut(); closeMobile(); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-button text-right text-sm font-semibold min-h-[44px] text-brand-accent-secondary hover:bg-brand-accent-secondary/10 transition-colors touch-manipulation">
                <LogOut size={20} />
                התנתק
              </button>
            )}
            <div className="flex items-center gap-3 px-4 py-3 rounded-card bg-brand-black/5 dark:bg-brand-surface min-h-[44px] mt-2">
              <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center">
                <span className="text-xs font-bold text-brand">{avatarLetter}</span>
              </div>
              <span className="text-sm font-medium text-brand-black dark:text-on-brand">{displayName || 'פרופיל'}</span>
            </div>
          </div>
        </div>

        {showExport && (
          <div className="md:hidden fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-brand-black/40" onClick={() => setShowExport(false)}>
            <div className="w-full max-w-sm bg-brand-white dark:bg-brand-surface-card rounded-card-lg shadow-card-dark p-5 space-y-1" onClick={(e) => e.stopPropagation()} dir="rtl">
              <p className="text-sm font-bold text-brand-black dark:text-on-brand-muted pb-3">ייצוא / גיבוי</p>
              <button type="button" onClick={() => { exportTradesToCsv(trades); setShowExport(false); }} className="block w-full text-right px-4 py-3 rounded-button hover:bg-brand-dark/5 dark:hover:bg-brand/10 min-h-[44px] font-medium text-brand-black dark:text-on-brand">ייצוא מסחר (CSV)</button>
              <button type="button" onClick={() => { exportDailyTasksToCsv(dailyTasks); setShowExport(false); }} className="block w-full text-right px-4 py-3 rounded-button hover:bg-brand-dark/5 dark:hover:bg-brand/10 min-h-[44px] font-medium text-brand-black dark:text-on-brand">ייצוא משימות (CSV)</button>
              <button type="button" onClick={() => { exportFullBackup({ trades, dailyTasks, visionMilestones, saasProjects, userXP, userLevel, displayName, healthEntries, learningItems, financeGoals, relationshipItems }); setShowExport(false); }} className="block w-full text-right px-4 py-3 rounded-button hover:bg-brand-dark/5 dark:hover:bg-brand/10 min-h-[44px] font-medium text-brand-black dark:text-on-brand">גיבוי מלא (JSON)</button>
              <button type="button" onClick={() => setShowExport(false)} className="block w-full text-right px-4 py-3 rounded-button hover:bg-brand-black/5 dark:hover:bg-brand/10 min-h-[44px] text-brand-black/60 dark:text-on-brand-muted font-medium">ביטול</button>
            </div>
          </div>
        )}

        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />

        {syncError && !syncBannerDismissed && (
          <div className="my-4 px-4 py-3 rounded-card bg-brand-accent-secondary/10 border border-brand-accent-secondary/30 text-brand-accent-secondary dark:text-brand-accent-secondary text-sm flex items-center justify-between gap-3" role="alert">
            <span>{syncError}</span>
            <button type="button" onClick={() => setSyncBannerDismissed(true)} className="shrink-0 px-2 py-1 rounded-button hover:bg-brand-accent-secondary/20 font-medium" aria-label="סגור">✕</button>
          </div>
        )}
        {syncError && syncBannerDismissed && (
          <div className="mb-2 px-3 py-2 rounded-button bg-brand-accent-secondary/5 border border-brand-accent-secondary/20 text-brand-accent-secondary/90 text-xs flex items-center gap-2" role="status">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-accent-secondary" aria-hidden />
            <span>אין סנכרון – הנתונים נשמרים מקומית</span>
            <button type="button" onClick={() => setSyncBannerDismissed(false)} className="mr-auto text-[10px] underline hover:no-underline font-medium" aria-label="הצג פרטים">הצג</button>
          </div>
        )}

        <AccessibilityFloatingButton />

        <main id="main-content" className="flex-1 py-6 pb-safe" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
