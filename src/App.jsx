import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
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

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-page dark:bg-brand-dark flex items-center justify-center" dir="rtl" role="status" aria-live="polite">
        <p className="text-slate-500 dark:text-on-brand-muted font-medium">טוען...</p>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
      {activeTab === 'trading' && <TradingView />}
      {activeTab === 'saas' && <SaasView />}
      {activeTab === 'vision' && <VisionView />}
    </Layout>
  );
}

function AppWithAuth() {
  const { user, authLoading, hasSupabase } = useAuth();
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
  return (
    <AppProvider userId={userId}>
      <AppContent />
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
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
