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
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark text-slate-900 dark:text-on-brand flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center">
            <Zap className="text-brand" fill="currentColor" size={20} />
          </div>
          <span className="font-black text-xl">REFAEL OS</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-center mb-2 text-slate-900 dark:text-on-brand">
          {isReopened ? 'עדכן קטגוריות' : 'מה רלוונטי עבורך?'}
        </h1>
        <p className="text-slate-600 dark:text-on-brand-muted text-center mb-8">
          {isReopened
            ? 'בחר אילו אזורים להציג בתפריט.'
            : 'בחר את האזורים שתרצה לראות בדשבורד. תמיד תהיה לך גישה לדשבורד הראשי ולמשימות.'}
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-white dark:bg-brand-surface border border-slate-200 dark:border-brand/20 opacity-90">
            <div className="w-12 h-12 rounded-xl bg-brand-dark/10 dark:bg-brand/10 flex items-center justify-center shrink-0">
              <LayoutDashboard className="text-brand-dark dark:text-brand" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-slate-900 dark:text-on-brand">דשבורד</h2>
              <p className="text-sm text-slate-600 dark:text-on-brand-muted">סיכום יומי, XP, משימות – תמיד זמין</p>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted">תמיד מוצג</span>
          </div>

          {OPTIONAL_CATEGORIES.map((cat) => {
            const isChecked = selected.includes(cat.id);
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                className={`flex items-center gap-3 w-full p-4 min-h-[48px] rounded-2xl border text-right transition-all touch-manipulation ${
                  isChecked
                    ? 'bg-brand-white dark:bg-brand-surface border-brand-dark/30 dark:border-brand/50 shadow-md'
                    : 'bg-slate-50 dark:bg-brand-dark/30 border-slate-200 dark:border-brand/20 hover:border-slate-300 dark:hover:border-brand/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isChecked ? 'bg-brand-dark/10 dark:bg-brand/10' : 'bg-slate-200 dark:bg-brand-dark/50'
                }`}>
                  <Icon className={isChecked ? 'text-brand-dark dark:text-brand' : 'text-slate-400 dark:text-on-brand-muted'} size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-900 dark:text-on-brand">{cat.label}</h2>
                  <p className="text-sm text-slate-600 dark:text-on-brand-muted">{cat.desc}</p>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 ${
                  isChecked ? 'bg-brand-dark border-brand-dark text-on-brand' : 'border-slate-300 dark:border-brand/30'
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
            className="px-4 py-2.5 min-h-[44px] rounded-xl border-2 border-slate-300 dark:border-brand/30 font-bold text-sm hover:bg-slate-100 dark:hover:bg-brand-surface transition-colors touch-manipulation"
          >
            הצג הכל
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 px-6 py-3.5 min-h-[44px] rounded-xl bg-brand-dark text-on-brand font-bold text-lg shadow-lg hover:opacity-90 transition-opacity touch-manipulation"
          >
            {isReopened ? 'שמור' : 'המשך לדשבורד'}
          </button>
        </div>
      </div>
    </div>
  );
}
