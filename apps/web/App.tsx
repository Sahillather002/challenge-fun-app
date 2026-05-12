
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Models } from './pages/Models';
import { Creative } from './pages/Creative';
import { Status } from './pages/Status';
import { Analytics } from './pages/Analytics';
import { ApiKeys } from './pages/ApiKeys';
import { Pricing } from './pages/Pricing';
import { Docs } from './pages/Docs';
import { Settings } from './pages/Settings';
import { Faq } from './pages/Faq';
import { NavigationTab } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(NavigationTab.LANDING);

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.LANDING:
        return <Landing onStart={() => setActiveTab(NavigationTab.DASHBOARD)} />;
      case NavigationTab.DASHBOARD:
        return <Dashboard />;
      case NavigationTab.CHAT:
        return <Chat />;
      case NavigationTab.CREATIVE:
        return <Creative />;
      case NavigationTab.MODELS:
        return <Models onSelectModel={() => setActiveTab(NavigationTab.CHAT)} />;
      case NavigationTab.STATUS:
        return <Status />;
      case NavigationTab.ANALYTICS:
        return <Analytics />;
      case NavigationTab.API_KEYS:
        return <ApiKeys />;
      case NavigationTab.DOCS:
        return <Docs />;
      case NavigationTab.PRICING:
        return <Pricing />;
      case NavigationTab.FAQ:
        return <Faq />;
      case NavigationTab.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="w-full h-full">
          {renderContent()}
        </div>
      </Layout>
    </QueryClientProvider>
  );
};

export default App;
