import React, { useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthView({ onBack }) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (isForgot) {
        await resetPassword(email);
        setMessage('אם יש חשבון עם האימייל הזה, נשלח אליך קישור לאיפוס סיסמה. בדוק גם בתיקיית דואר זבל.');
      } else if (isSignUp) {
        await signUp(email, password);
        setMessage('נשלח אליך אימייל לאימות. בדוק את תיבת הדואר לפני ההתחברות.');
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err.message || 'אירעה שגיאה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark/95 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm bg-brand-white dark:bg-brand-dark rounded-2xl border border-slate-200 dark:border-brand-dark/80 shadow-xl p-6 relative">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute top-4 right-4 flex items-center gap-1 text-sm text-slate-500 hover:text-brand-dark dark:hover:text-brand transition-colors"
          >
            <ArrowRight size={16} />
            חזרה
          </button>
        )}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="text-brand" fill="currentColor" size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight">REFAEL OS</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Life Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              אימייל
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          {!isForgot && (
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                סיסמה
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isForgot}
                minLength={6}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          )}
          {!isForgot && !isSignUp && (
            <button
              type="button"
              onClick={() => { setIsForgot(true); setError(''); setMessage(''); }}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand text-left"
            >
              שכחתי סיסמה
            </button>
          )}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-dark text-white font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? '...' : isForgot ? 'שלח קישור לאיפוס' : isSignUp ? 'הרשמה' : 'התחברות'}
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp((v) => !v); setIsForgot(false); setError(''); setMessage(''); }}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand"
          >
            {isSignUp ? 'כבר יש לך חשבון? התחבר' : isForgot ? 'חזרה להתחברות' : 'אין לך חשבון? הרשם'}
          </button>
        </form>
      </div>
    </div>
  );
}
