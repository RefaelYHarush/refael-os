import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthView({ onBack }) {
  const { signIn, signUp, signInWithGoogle, resetPassword, hasSupabase, oauthError, clearOauthError } = useAuth();
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
    clearOauthError();
    setGoogleLoading(true);
    try {
      await signInWithGoogle({ requestTasksScope: true });
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

  const inputClass = 'w-full px-4 py-3 rounded-button border border-brand-black/15 dark:border-brand/25 bg-brand-white dark:bg-brand-surface text-brand-black dark:text-on-brand placeholder-brand-black/40 dark:placeholder-brand/50 focus:ring-2 focus:ring-brand focus:border-transparent dark:focus:border-brand transition-colors';

  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark flex items-center justify-center p-4 py-12 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/5 via-transparent to-brand/5 dark:from-brand/10 dark:to-brand-dark pointer-events-none" aria-hidden />
      <div className="w-full max-w-[400px] bg-brand-white dark:bg-brand-surface-card rounded-card-lg border border-brand-black/8 dark:border-brand/15 shadow-card dark:shadow-card-dark p-8 relative z-10">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute top-5 right-5 flex items-center gap-1.5 text-sm text-brand-black/60 dark:text-on-brand-muted hover:text-brand-dark dark:hover:text-brand transition-colors font-medium"
          >
            <ArrowRight size={16} />
            חזרה
          </button>
        )}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-card bg-brand-dark flex items-center justify-center shadow-card dark:shadow-card-dark">
            <Zap className="text-brand" fill="currentColor" size={28} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-brand-black dark:text-on-brand">REFAEL OS</h1>
          <p className="text-xs text-brand-black/55 dark:text-on-brand-muted font-medium">Life Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="auth-email" className="block text-sm font-semibold text-brand-black dark:text-on-brand mb-1.5">
              אימייל
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          {!isForgot && (
            <div>
              <label htmlFor="auth-password" className="block text-sm font-semibold text-brand-black dark:text-on-brand mb-1.5">
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
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
          )}
          {isSignUp && (
            <label className="flex items-start gap-2.5 cursor-pointer text-sm text-brand-black/75 dark:text-on-brand-muted">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-brand-black/20 dark:border-brand/30 text-brand-dark focus:ring-brand"
              />
              <span>
                אני מסכים/ה ל
                <Link to="/terms" className="text-brand-dark dark:text-brand font-semibold underline hover:no-underline" target="_blank" rel="noopener noreferrer">תנאי השימוש</Link>
                {' '}ול
                <Link to="/privacy" className="text-brand-dark dark:text-brand font-semibold underline hover:no-underline" target="_blank" rel="noopener noreferrer">מדיניות הפרטיות</Link>
              </span>
            </label>
          )}
          {!isForgot && !isSignUp && (
            <button
              type="button"
              onClick={() => { setIsForgot(true); setError(''); setMessage(''); }}
              className="text-sm text-brand-black/60 dark:text-brand hover:text-brand-dark dark:hover:opacity-90 text-right font-semibold"
            >
              שכחתי סיסמה
            </button>
          )}
          {(error || oauthError) && (
            <p className="text-sm text-brand-accent-secondary font-medium" role="alert">
              {error || oauthError}
            </p>
          )}
          {message && <p className="text-sm text-brand-dark dark:text-brand font-medium" role="status">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 min-h-[48px] rounded-button bg-brand-dark text-brand-white font-bold shadow-card hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 touch-manipulation"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-brand-white/40 border-t-brand-white rounded-full animate-spin" aria-hidden />
                <span>מתחבר...</span>
              </>
            ) : isForgot ? 'שלח קישור לאיפוס' : isSignUp ? 'הרשמה' : 'התחברות'}
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp((v) => !v); setIsForgot(false); setError(''); setMessage(''); clearOauthError(); }}
            className="text-sm text-brand-black/60 dark:text-on-brand-muted hover:text-brand-dark dark:hover:text-brand font-semibold"
          >
            {isSignUp ? 'כבר יש לך חשבון? התחבר' : isForgot ? 'חזרה להתחברות' : 'אין לך חשבון? הרשם'}
          </button>
        </form>

        {hasSupabase && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-black/10 dark:border-brand/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-brand-white dark:bg-brand-surface-card text-brand-black/50 dark:text-on-brand-muted font-medium">או</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-3.5 min-h-[48px] rounded-button border-2 border-brand-black/15 dark:border-brand/25 bg-brand-white dark:bg-brand-surface text-brand-black dark:text-on-brand font-semibold flex items-center justify-center gap-2 hover:bg-brand-black/5 dark:hover:bg-brand/10 hover:border-brand/40 disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-brand-page dark:focus-visible:ring-offset-brand-dark touch-manipulation"
              aria-label="התחבר עם Google"
            >
              {googleLoading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-brand-black/20 border-t-brand-dark dark:border-brand/30 dark:border-t-brand rounded-full animate-spin" aria-hidden />
                  <span>מתחבר...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  התחבר עם Google
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
