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
    const search = window.location.search || '';
    if (hash.includes('type=recovery') || search.includes('type=recovery')) setIsRecovery(true);
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
    <div className="min-h-screen bg-brand-page dark:bg-brand-dark flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm bg-brand-white dark:bg-brand-surface-card rounded-card-lg border border-brand-black/8 dark:border-brand/15 shadow-card-dark p-6">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-brand-dark rounded-card flex items-center justify-center shadow-card">
            <Zap className="text-brand" fill="currentColor" size={24} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-brand-black dark:text-on-brand">הגדר סיסמה חדשה</h1>
        </div>
        {!isRecovery ? (
          <p className="text-brand-black/65 dark:text-on-brand-muted text-sm">
            הקישור לא תקף או שפג תוקפו. בקש קישור חדש מדף ההתחברות (&quot;שכחתי סיסמה&quot;).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="new-password" className="label-brand">סיסמה חדשה</label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="input-brand"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="label-brand">אימות סיסמה</label>
              <input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="input-brand"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-brand-accent-secondary">{error}</p>}
            {message && <p className="text-sm text-brand-dark dark:text-brand font-medium">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-button bg-brand-dark text-[var(--text-on-dark)] font-bold shadow-card hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              {loading ? '...' : 'שמור סיסמה'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
