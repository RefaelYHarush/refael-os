import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthView({ onBack }) {
  const { signIn, signUp, signInWithGoogle, resetPassword, hasSupabase } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'שגיאה בהתחברות עם גוגל');
    } finally {
      setGoogleLoading(false);
    }
  };

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
        if (!agreedToTerms) {
          setError('יש לאשר את תנאי השימוש ומדיניות הפרטיות');
          setLoading(false);
          return;
        }
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
          {isSignUp && (
            <label className="flex items-start gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 dark:border-slate-600 text-brand-dark focus:ring-brand"
              />
              <span>
                אני מסכים/ה ל
                <Link to="/terms" className="text-brand-dark dark:text-brand font-medium underline hover:no-underline" target="_blank" rel="noopener noreferrer">תנאי השימוש</Link>
                {' '}ול
                <Link to="/privacy" className="text-brand-dark dark:text-brand font-medium underline hover:no-underline" target="_blank" rel="noopener noreferrer">מדיניות הפרטיות</Link>
              </span>
            </label>
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
          {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
          {message && <p className="text-sm text-green-600 dark:text-green-400" role="status">{message}</p>}
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

        {hasSupabase && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-brand-white dark:bg-brand-dark text-slate-500">או</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? '...' : 'התחבר עם Google'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
