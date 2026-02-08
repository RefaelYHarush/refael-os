import React, { useState } from 'react';
import { Zap, LayoutDashboard, TrendingUp, Briefcase, Target, Calendar, Activity, BookOpen, Wallet, Users, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_CATEGORY_IDS } from '../data/constants';

const OPTIONAL_CATEGORIES = [
  { id: 'trading', label: 'מסחר', desc: 'יומן מסחר, PnL, סימבולים וסט־אפים', icon: TrendingUp },
  { id: 'saas', label: 'SaaS Builder', desc: 'פרויקטים, MRR ומשימות פיתוח', icon: Briefcase },
  { id: 'vision', label: 'החזון', desc: 'אבני דרך לשנים הקרובות ומעקב השגות', icon: Target },
  { id: 'health', label: 'בריאות', desc: 'אימונים, שינה, מים ומעקב כושר', icon: Activity },
  { id: 'learning', label: 'למידה', desc: 'קורסים, ספרים ומיומנויות', icon: BookOpen },
  { id: 'finance', label: 'כספים', desc: 'יעדי חיסכון ותקציב', icon: Wallet },
  { id: 'relationships', label: 'יחסים', desc: 'מעקב מגע – עם מי לדבר', icon: Users },
  { id: 'calendar', label: 'יומן', desc: 'חיבור ליומן גוגל – צפייה והטמעה', icon: Calendar },
];

export function OnboardingView({ isReopened = false }) {
  const { completeOnboarding, enabledCategories } = useApp();
  const [selected, setSelected] = useState(() => {
    const fromContext = Array.isArray(enabledCategories) && enabledCategories.length > 0
      ? enabledCategories
      : ALL_CATEGORY_IDS;
    return fromContext.filter((id) => id !== 'dashboard');
  });

  const toggle = (id) => {
    if (id === 'dashboard') return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelected([...ALL_CATEGORY_IDS]);

  const handleContinue = () => {
    const categories = ['dashboard', ...selected.filter((id) => id !== 'dashboard')];
    if (!categories.includes('dashboard')) categories.unshift('dashboard');
    completeOnboarding(categories);
  };

  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark text-brand-black dark:text-on-brand flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-11 h-11 bg-brand-dark rounded-card flex items-center justify-center shadow-card">
            <Zap className="text-brand" fill="currentColor" size={22} />
          </div>
          <span className="font-extrabold text-xl text-brand-black dark:text-on-brand">REFAEL OS</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-2 text-brand-black dark:text-on-brand">
          {isReopened ? 'עדכן קטגוריות' : 'מה רלוונטי עבורך?'}
        </h1>
        <p className="text-brand-black/65 dark:text-on-brand-muted text-center mb-8 text-sm">
          {isReopened
            ? 'בחר אילו אזורים להציג בתפריט.'
            : 'בחר את האזורים שתרצה לראות בדשבורד. תמיד תהיה לך גישה לדשבורד הראשי ולמשימות.'}
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-card-lg bg-brand-white dark:bg-brand-surface-card border border-brand-black/8 dark:border-brand/15">
            <div className="w-12 h-12 rounded-card bg-brand-dark/10 dark:bg-brand/10 flex items-center justify-center shrink-0">
              <LayoutDashboard className="text-brand-dark dark:text-brand" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-brand-black dark:text-on-brand">דשבורד</h2>
              <p className="text-sm text-brand-black/65 dark:text-on-brand-muted">סיכום יומי, XP, משימות – תמיד זמין</p>
            </div>
            <span className="text-xs font-semibold text-brand-black/50 dark:text-on-brand-muted">תמיד מוצג</span>
          </div>

          {OPTIONAL_CATEGORIES.map((cat) => {
            const isChecked = selected.includes(cat.id);
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                className={`flex items-center gap-3 w-full p-4 min-h-[48px] rounded-card-lg border text-right transition-all touch-manipulation ${
                  isChecked
                    ? 'bg-brand-white dark:bg-brand-surface-card border-brand-dark/25 dark:border-brand/40 shadow-card'
                    : 'bg-brand-black/[0.03] dark:bg-brand/5 border-brand-black/10 dark:border-brand/15 hover:border-brand/30 dark:hover:border-brand/25'
                }`}
              >
                <div className={`w-12 h-12 rounded-card flex items-center justify-center shrink-0 ${
                  isChecked ? 'bg-brand-dark/10 dark:bg-brand/15' : 'bg-brand-black/10 dark:bg-brand-dark/40'
                }`}>
                  <Icon className={isChecked ? 'text-brand-dark dark:text-brand' : 'text-brand-black/45 dark:text-on-brand-muted'} size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-brand-black dark:text-on-brand">{cat.label}</h2>
                  <p className="text-sm text-brand-black/65 dark:text-on-brand-muted">{cat.desc}</p>
                </div>
                <div className={`w-8 h-8 rounded-button flex items-center justify-center shrink-0 border-2 ${
                  isChecked ? 'bg-brand-dark border-brand-dark text-[var(--text-on-dark)]' : 'border-brand-black/25 dark:border-brand/30'
                }`}>
                  {isChecked && <Check size={18} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={selectAll}
            className="px-4 py-2.5 min-h-[44px] rounded-button border-2 border-brand-black/15 dark:border-brand/25 font-bold text-sm text-brand-black dark:text-on-brand hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors touch-manipulation"
          >
            הצג הכל
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 px-6 py-3.5 min-h-[44px] rounded-button bg-brand-dark text-[var(--text-on-dark)] font-bold text-lg shadow-card hover:opacity-95 transition-opacity touch-manipulation"
          >
            {isReopened ? 'שמור' : 'המשך לדשבורד'}
          </button>
        </div>
      </div>
    </div>
  );
}
