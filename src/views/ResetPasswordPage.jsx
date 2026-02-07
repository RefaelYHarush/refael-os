import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SimplePageLayout } from '../components/layout/SimplePageLayout';

export function ResetPasswordPage() {
  const { updatePassword, hasSupabase } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (!hasSupabase) return;
    const hash = window.location.hash || '';
    if (hash.includes('type=recovery')) setIsRecovery(true);
  }, [hasSupabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirm) {
      setError('הסיסמאות לא תואמות');
      return;
    }
    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      setMessage('הסיסמה עודכנה. מעביר אותך לדשבורד...');
      setTimeout(() => navigate('/', { replace: true }), 1500);
    } catch (err) {
      setError(err.message || 'אירעה שגיאה');
    } finally {
      setLoading(false);
    }
  };

  if (!hasSupabase) {
    return (
      <SimplePageLayout title="איפוס סיסמה">
        <p>שירות איפוס סיסמה לא זמין בהגדרה זו.</p>
      </SimplePageLayout>
    );
  }

  return (
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark/95 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm bg-brand-white dark:bg-brand-dark rounded-2xl border border-slate-200 dark:border-brand-dark/80 shadow-xl p-6">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="text-brand" fill="currentColor" size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight">הגדר סיסמה חדשה</h1>
        </div>
        {!isRecovery ? (
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            הקישור לא תקף או שפג תוקפו. בקש קישור חדש מדף ההתחברות (&quot;שכחתי סיסמה&quot;).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                סיסמה חדשה
              </label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                אימות סיסמה
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-dark text-white font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? '...' : 'שמור סיסמה'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
