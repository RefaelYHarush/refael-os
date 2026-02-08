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
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark text-brand-black dark:text-on-brand" dir="rtl">
      <header className="sticky top-0 z-50 border-b border-brand-black/8 dark:border-brand/15 bg-brand-page/95 dark:bg-brand-dark/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-card bg-brand-dark flex items-center justify-center shadow-card dark:shadow-card-dark">
              <Zap className="text-brand" fill="currentColor" size={20} />
            </div>
            <span className="font-extrabold text-lg text-brand-black dark:text-on-brand">REFAEL OS</span>
          </div>
          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-button text-brand-black/60 dark:text-on-brand-muted hover:bg-brand-black/5 dark:hover:bg-brand/10 transition-colors touch-manipulation"
              title={isDark ? 'מצב בהיר' : 'מצב כהה'}
              aria-label={isDark ? 'מצב בהיר' : 'מצב כהה'}
            >
              {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="px-4 py-2.5 min-h-[44px] text-sm font-semibold text-brand-black/80 dark:text-on-brand-muted hover:text-brand-dark dark:hover:text-brand transition-colors touch-manipulation"
            >
              התחברות
            </button>
            <button
              type="button"
              onClick={onSignUp}
              className="px-5 py-2.5 min-h-[44px] text-sm font-bold rounded-button bg-brand-dark text-brand-white hover:opacity-95 active:scale-[0.98] transition-all touch-manipulation shadow-card"
            >
              הרשמה בחינם
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          <h1 className="text-display md:text-display-md lg:text-display-lg font-extrabold tracking-tight text-brand-black dark:text-on-brand mb-6 max-w-3xl mx-auto">
            הדשבורד האישי שלך
            <br />
            <span className="text-brand-dark dark:text-brand">משימות, יעדים ומה שבחרת</span>
            <br />
            במקום אחד
          </h1>
          <p className="text-lg md:text-xl text-brand-black/70 dark:text-on-brand-muted max-w-2xl mx-auto mb-4 leading-relaxed">
            מערכת ניהול חיים אחת: משימות יומיות עם XP, דשבורד מרכזי, ובחירה חופשית – יומן מסחר, פרויקטים ו־SaaS, אבני דרך. הנתונים שלך בענן, בכל מכשיר.
          </p>
          <p className="text-base text-brand-black/55 dark:text-on-brand-muted max-w-xl mx-auto mb-12">
            אחרי ההרשמה תבחר אילו אזורים להציג – כך תראה רק מה שרלוונטי עבורך.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={onSignUp}
              className="px-8 py-4 min-h-[48px] rounded-button bg-brand-dark text-brand-white font-bold text-lg shadow-card hover:opacity-95 active:scale-[0.98] transition-all touch-manipulation"
            >
              צור דשבורד בחינם
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="px-8 py-4 min-h-[48px] rounded-button border-2 border-brand-dark/25 dark:border-brand/30 font-bold text-lg text-brand-black dark:text-on-brand hover:bg-brand-dark/5 dark:hover:bg-brand/10 hover:border-brand-dark/40 dark:hover:border-brand/50 transition-all flex items-center justify-center gap-2 touch-manipulation"
            >
              <LogIn size={20} aria-hidden />
              כבר יש לך חשבון? התחבר
            </button>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-brand-black/8 dark:border-brand/15">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-black dark:text-on-brand mb-2">
            מה תקבל
          </h2>
          <p className="text-center text-brand-black/60 dark:text-on-brand-muted text-sm mb-12">בהתחלה תבחר אילו קטגוריות להציג בדשבורד שלך</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-5 p-6 rounded-card-lg bg-brand-white dark:bg-brand-surface-card border border-brand-black/8 dark:border-brand/15 hover:shadow-card-hover dark:hover:shadow-card-dark hover:border-brand/25 dark:hover:border-brand/30 transition-all"
              >
                <div className="w-14 h-14 rounded-card bg-brand-dark/10 dark:bg-brand/15 flex items-center justify-center shrink-0">
                  <Icon className="text-brand-dark dark:text-brand" size={26} />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg mb-1.5 text-brand-black dark:text-on-brand">{title}</h3>
                  <p className="text-brand-black/65 dark:text-on-brand-muted text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-brand-black/60 dark:text-on-brand-muted mb-6">הצטרף עכשיו – ללא כרטיס אשראי</p>
          <button
            type="button"
            onClick={onSignUp}
            className="px-8 py-4 min-h-[48px] rounded-button bg-brand-dark text-brand-white font-bold text-lg shadow-card hover:opacity-95 active:scale-[0.98] transition-all touch-manipulation"
          >
            הרשמה בחינם
          </button>
        </section>
      </main>

      <footer className="border-t border-brand-black/8 dark:border-brand/15 bg-brand-black/5 dark:bg-brand-surface py-8 mt-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-brand-black/55 dark:text-on-brand-muted">
          <span>© {new Date().getFullYear()} REFAEL OS</span>
          <div className="flex gap-8">
            <Link to="/about" className="hover:text-brand-dark dark:hover:text-brand transition-colors font-medium">אודות</Link>
            <Link to="/terms" className="hover:text-brand-dark dark:hover:text-brand transition-colors font-medium">תנאי שימוש</Link>
            <Link to="/privacy" className="hover:text-brand-dark dark:hover:text-brand transition-colors font-medium">פרטיות</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
