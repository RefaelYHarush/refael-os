import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(hasSupabase);

  useEffect(() => {
    if (!hasSupabase) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthLoading(false);
      if (s && typeof window !== 'undefined' && window.history.replaceState) {
        const hash = window.location.hash || '';
        const search = window.location.search || '';
        if (/access_token|refresh_token|error/.test(hash) || /code=/.test(search)) {
          window.history.replaceState(null, '', window.location.origin + window.location.pathname);
        }
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // אחרי התחברות מוצלחת – מנקים את ה-URL hash/query של OAuth כדי שהכתובת תוצג נכון
      if (s && typeof window !== 'undefined' && window.history.replaceState) {
        const hash = window.location.hash || '';
        const search = window.location.search || '';
        const hasAuthInUrl = /access_token|refresh_token|error/.test(hash) || /code=/.test(search);
        if (hasAuthInUrl) {
          const cleanPath = window.location.origin + window.location.pathname;
          window.history.replaceState(null, '', cleanPath);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  /** @param {{ requestTasksScope?: boolean }} [opts] – when true, also requests Google Tasks scope to view/manage tasks in the app */
  const signInWithGoogle = async (opts = {}) => {
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : '';
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
      ...(opts.requestTasksScope ? ['https://www.googleapis.com/auth/tasks'] : []),
    ].join(' ');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        scopes,
      },
    });
    if (error) throw error;
  };

  const resetPassword = async (email) => {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : '';
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  };

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const value = {
    session,
    user: session?.user ?? null,
    authLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    hasSupabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
