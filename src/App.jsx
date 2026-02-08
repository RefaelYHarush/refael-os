import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { GoogleTasksProvider } from './context/GoogleTasksContext';
import { Layout } from './components/layout/Layout';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';
import { LandingView } from './views/LandingView';
import { AuthView } from './views/AuthView';
import { AboutPage } from './views/AboutPage';
import { TermsPage } from './views/TermsPage';
import { PrivacyPage } from './views/PrivacyPage';
import { ResetPasswordPage } from './views/ResetPasswordPage';
import { OnboardingView } from './views/OnboardingView';

const DashboardView = lazy(() => import('./views/DashboardView').then((m) => ({ default: m.DashboardView })));
const TradingView = lazy(() => import('./views/TradingView').then((m) => ({ default: m.TradingView })));
const SaasView = lazy(() => import('./views/SaasView').then((m) => ({ default: m.SaasView })));
const VisionView = lazy(() => import('./views/VisionView').then((m) => ({ default: m.VisionView })));
const HealthView = lazy(() => import('./views/HealthView').then((m) => ({ default: m.HealthView })));
const LearningView = lazy(() => import('./views/LearningView').then((m) => ({ default: m.LearningView })));
const FinanceView = lazy(() => import('./views/FinanceView').then((m) => ({ default: m.FinanceView })));
const RelationshipsView = lazy(() => import('./views/RelationshipsView').then((m) => ({ default: m.RelationshipsView })));
const CalendarView = lazy(() => import('./views/CalendarView').then((m) => ({ default: m.CalendarView })));

const Fallback = () => (
  <div className="min-h-[200px] flex items-center justify-center text-brand-black/55 dark:text-on-brand-muted font-medium" role="status" aria-live="polite">טוען...</div>
);

function AppContent() {
  const { loading, onboardingLoaded, onboardingDone, enabledCategories } = useApp();
  const firstTab = enabledCategories.includes('dashboard') ? 'dashboard' : enabledCategories[0] || 'dashboard';
  const [activeTab, setActiveTab] = useState(firstTab);

  useEffect(() => {
    if (!enabledCategories.includes(activeTab)) setActiveTab(firstTab);
  }, [enabledCategories, activeTab, firstTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-page dark:bg-brand-dark flex items-center justify-center" dir="rtl" role="status" aria-live="polite">
        <p className="text-brand-black/55 dark:text-on-brand-muted font-medium">טוען...</p>
      </div>
    );
  }

  if (onboardingLoaded && !onboardingDone) {
    return <OnboardingView />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} enabledCategories={enabledCategories}>
      <Suspense fallback={<Fallback />}>
        {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
        {activeTab === 'trading' && <TradingView />}
        {activeTab === 'saas' && <SaasView />}
        {activeTab === 'vision' && <VisionView />}
        {activeTab === 'health' && <HealthView />}
        {activeTab === 'learning' && <LearningView />}
        {activeTab === 'finance' && <FinanceView />}
        {activeTab === 'relationships' && <RelationshipsView />}
        {activeTab === 'calendar' && <CalendarView />}
      </Suspense>
    </Layout>
  );
}

const isDevBypass = () =>
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
  window.location.search.includes('dev=1');

function AppWithAuth() {
  const { user, session, authLoading, hasSupabase, clearOauthError } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const useDevBypass = isDevBypass();
  const effectiveUser = useDevBypass ? { id: 'dev-bypass' } : user;

  if (authLoading && !useDevBypass) {
    return (
      <div className="min-h-screen bg-brand-page dark:bg-brand-dark flex items-center justify-center" dir="rtl" role="status" aria-live="polite">
        <p className="text-brand-black/55 dark:text-on-brand-muted font-medium">טוען...</p>
      </div>
    );
  }

  if (hasSupabase && !effectiveUser) {
    if (showAuth) {
      return <AuthView onBack={() => { clearOauthError(); setShowAuth(false); }} />;
    }
    return (
      <LandingView
        onSignUp={() => setShowAuth(true)}
        onSignIn={() => setShowAuth(true)}
      />
    );
  }

  const userId = effectiveUser?.id ?? null;
  const googleAccessToken = session?.provider_token ?? null;

  return (
    <AppProvider userId={userId}>
      <GoogleTasksProvider accessToken={googleAccessToken}>
        <AppContent />
      </GoogleTasksProvider>
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PWAUpdatePrompt />
      <Routes>
        <Route path="/" element={<AppWithAuth />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
