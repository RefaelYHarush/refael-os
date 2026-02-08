import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, LayoutDashboard, TrendingUp, CheckSquare, Target, Sun, Moon, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function LandingView({ onSignUp, onSignIn }) {
  const { isDark, toggleTheme } = useTheme();
  const features = [
    { icon: LayoutDashboard, title: 'דשבורד אישי', desc: 'סיכום יומי, XP ורמות – הכל במקום אחד' },
    { icon: CheckSquare, title: 'משימות יומיות', desc: 'משימות עם נקודות XP והתקדמות' },
    { icon: TrendingUp, title: 'יומן מסחר', desc: 'מעקב PnL, סימבולים וסט־אפים – למי שסוחר' },
    { icon: Target, title: 'החזון', desc: 'אבני דרך לשנים הקרובות ומעקב השגות' },
  ];

  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark text-slate-900 dark:text-on-brand" dir="rtl">
      <header className="border-b border-slate-200 dark:border-brand/20 bg-brand-white/95 dark:bg-brand-surface-elevated backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center">
              <Zap className="text-brand" fill="currentColor" size={18} />
            </div>
            <span className="font-black text-lg">REFAEL OS</span>
          </div>
          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-dark/50 transition-colors touch-manipulation"
              title={isDark ? 'מצב בהיר' : 'מצב כהה'}
              aria-label={isDark ? 'מצב בהיר' : 'מצב כהה'}
            >
              {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="px-4 py-2 min-h-[44px] text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-dark dark:hover:text-brand transition-colors touch-manipulation flex items-center"
            >
              התחברות
            </button>
            <button
              type="button"
              onClick={onSignUp}
              className="px-4 py-2 min-h-[44px] text-sm font-bold rounded-xl bg-brand-dark text-on-brand hover:opacity-90 transition-opacity touch-manipulation flex items-center"
            >
              הרשמה בחינם
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center bg-gradient-to-b from-slate-50/80 to-transparent dark:from-brand-surface/30 dark:to-transparent">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
            הדשבורד האישי שלך
            <br />
            <span className="text-brand-dark dark:text-brand">משימות, יעדים ומה שבחרת</span> במקום אחד
          </h1>
          <p className="text-lg text-slate-600 dark:text-on-brand-muted max-w-xl mx-auto mb-4">
            מערכת ניהול חיים אחת: משימות יומיות עם XP, דשבורד מרכזי, ובחירה חופשית – יומן מסחר, פרויקטים ו־SaaS, אבני דרך. הנתונים שלך בענן, בכל מכשיר.
          </p>
          <p className="text-base text-slate-500 dark:text-on-brand-muted max-w-xl mx-auto mb-10">
            אחרי ההרשמה תבחר אילו אזורים להציג – כך תראה רק מה שרלוונטי עבורך.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={onSignUp}
              className="px-8 py-3.5 min-h-[44px] rounded-xl bg-brand-dark text-on-brand font-bold text-lg shadow-lg hover:opacity-90 hover:shadow-xl hover:shadow-brand-dark/25 active:scale-[0.98] transition-all touch-manipulation"
            >
              צור דשבורד בחינם
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="px-8 py-3.5 min-h-[44px] rounded-xl border-2 border-slate-300 dark:border-brand/30 font-bold text-lg hover:bg-slate-100 dark:hover:bg-brand-surface hover:text-brand-dark dark:hover:text-brand hover:border-brand-dark/50 dark:hover:border-brand/50 transition-all flex items-center justify-center gap-2 touch-manipulation"
            >
              <LogIn size={20} aria-hidden />
              כבר יש לך חשבון? התחבר
            </button>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-16 border-t border-slate-200 dark:border-brand/20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-slate-900 dark:text-on-brand pb-2 border-b-2 border-brand-dark/30 dark:border-brand/50 w-fit mx-auto">
            מה תקבל
          </h2>
          <p className="text-center text-slate-600 dark:text-on-brand-muted text-sm mb-10">בהתחלה תבחר אילו קטגוריות להציג בדשבורד שלך</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-5 rounded-2xl bg-brand-white dark:bg-brand-surface border border-slate-200 dark:border-brand/20 hover:shadow-md hover:border-brand/30 dark:hover:border-brand/40 transition-all hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-dark/10 dark:bg-brand/10 flex items-center justify-center shrink-0">
                  <Icon className="text-brand-dark dark:text-brand" size={24} />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-on-brand">{title}</h3>
                  <p className="text-slate-600 dark:text-on-brand-muted text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-slate-600 dark:text-on-brand-muted mb-6">הצטרף עכשיו – ללא כרטיס אשראי</p>
          <button
            type="button"
            onClick={onSignUp}
            className="px-8 py-3.5 min-h-[44px] rounded-xl bg-brand-dark text-on-brand font-bold text-lg shadow-lg hover:opacity-90 hover:shadow-xl hover:shadow-brand-dark/25 active:scale-[0.98] transition-all touch-manipulation"
          >
            הרשמה בחינם
          </button>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-brand/20 bg-slate-50 dark:bg-brand-dark/80 py-6 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-on-brand-muted">
          <span>© {new Date().getFullYear()} REFAEL OS</span>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-brand-dark dark:hover:text-brand transition-colors">אודות</Link>
            <Link to="/terms" className="hover:text-brand-dark dark:hover:text-brand transition-colors">תנאי שימוש</Link>
            <Link to="/privacy" className="hover:text-brand-dark dark:hover:text-brand transition-colors">פרטיות</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
