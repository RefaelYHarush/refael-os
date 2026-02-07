import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, LayoutDashboard, TrendingUp, CheckSquare, Target } from 'lucide-react';

export function LandingView({ onSignUp, onSignIn }) {
  const features = [
    { icon: LayoutDashboard, title: 'דשבורד אישי', desc: 'סיכום יומי, XP ורמות, הכל במקום אחד' },
    { icon: TrendingUp, title: 'יומן מסחר', desc: 'מעקב PnL, סימבולים, מצב רוח וסט־אפים' },
    { icon: CheckSquare, title: 'משימות יומיות', desc: 'משימות עם נקודות XP והתקדמות' },
    { icon: Target, title: 'החזון', desc: 'אבני דרך לשנים הקרובות ומעקב השגות' },
  ];

  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark/95 text-slate-900 dark:text-slate-100" dir="rtl">
      <header className="border-b border-slate-200 dark:border-slate-700/50 bg-brand-white/95 dark:bg-brand-dark/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center">
              <Zap className="text-brand" fill="currentColor" size={18} />
            </div>
            <span className="font-black text-lg">REFAEL OS</span>
          </div>
          <nav className="flex gap-2">
            <button
              type="button"
              onClick={onSignIn}
              className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-dark dark:hover:text-brand transition-colors"
            >
              התחברות
            </button>
            <button
              type="button"
              onClick={onSignUp}
              className="px-4 py-2 text-sm font-bold rounded-lg bg-brand-dark text-white hover:opacity-90 transition-opacity"
            >
              הרשמה בחינם
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            הדשבורד האישי שלך
            <br />
            <span className="text-brand-dark dark:text-brand">מסחר, משימות וחזון</span> במקום אחד
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-10">
            צור לעצמך מערכת ניהול חיים: יומן מסחר, משימות יומיות עם XP, פרויקטים ו־SaaS, ואבני דרך לשנים הקרובות. הנתונים שלך, בענן, בכל מכשיר.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={onSignUp}
              className="px-8 py-3.5 rounded-xl bg-brand-dark text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
            >
              צור דשבורד בחינם
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="px-8 py-3.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              כבר יש לך חשבון? התחבר
            </button>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-16 border-t border-slate-200 dark:border-slate-700/50">
          <h2 className="text-2xl font-bold text-center mb-10">מה תקבל</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-5 rounded-2xl bg-brand-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-dark/10 dark:bg-brand/10 flex items-center justify-center shrink-0">
                  <Icon className="text-brand-dark dark:text-brand" size={24} />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-lg mb-1">{title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-6">הצטרף עכשיו – ללא כרטיס אשראי</p>
          <button
            type="button"
            onClick={onSignUp}
            className="px-8 py-3.5 rounded-xl bg-brand-dark text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
          >
            הרשמה בחינם
          </button>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700/50 py-6 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
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
