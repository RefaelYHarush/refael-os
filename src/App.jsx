import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { DashboardView } from './views/DashboardView';
import { TradingView } from './views/TradingView';
import { SaasView } from './views/SaasView';
import { VisionView } from './views/VisionView';
import { HealthView } from './views/HealthView';
import { LearningView } from './views/LearningView';
import { FinanceView } from './views/FinanceView';
import { RelationshipsView } from './views/RelationshipsView';
import { CalendarView } from './views/CalendarView';
import { OnboardingView } from './views/OnboardingView';

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
        <p className="text-slate-500 dark:text-on-brand-muted font-medium">טוען...</p>
      </div>
    );
  }

  if (onboardingLoaded && !onboardingDone) {
    return <OnboardingView />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} enabledCategories={enabledCategories}>
      {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
      {activeTab === 'trading' && <TradingView />}
      {activeTab === 'saas' && <SaasView />}
      {activeTab === 'vision' && <VisionView />}
      {activeTab === 'health' && <HealthView />}
      {activeTab === 'learning' && <LearningView />}
      {activeTab === 'finance' && <FinanceView />}
      {activeTab === 'relationships' && <RelationshipsView />}
      {activeTab === 'calendar' && <CalendarView />}
    </Layout>
  );
}

function AppWithAuth() {
  const { user, session, authLoading, hasSupabase } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-page dark:bg-brand-dark flex items-center justify-center" dir="rtl" role="status" aria-live="polite">
        <p className="text-slate-500 dark:text-on-brand-muted font-medium">טוען...</p>
      </div>
    );
  }

  if (hasSupabase && !user) {
    if (showAuth) {
      return <AuthView onBack={() => setShowAuth(false)} />;
    }
    return (
      <LandingView
        onSignUp={() => setShowAuth(true)}
        onSignIn={() => setShowAuth(true)}
      />
    );
  }

  const userId = user?.id ?? null;
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
      </Routes>
    </AuthProvider>
  );
}
