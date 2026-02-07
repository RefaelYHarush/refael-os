import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { DashboardView } from './views/DashboardView';
import { TradingView } from './views/TradingView';
import { SaasView } from './views/SaasView';
import { VisionView } from './views/VisionView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
      {activeTab === 'trading' && <TradingView />}
      {activeTab === 'saas' && <SaasView />}
      {activeTab === 'vision' && <VisionView />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
