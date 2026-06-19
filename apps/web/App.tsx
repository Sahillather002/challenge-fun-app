
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Health } from './pages/Health';
import { Community } from './pages/Community';
import { Compete } from './pages/Compete';
import { CompetitionDetail } from './pages/CompetitionDetail';
import { Goals } from './pages/Goals';
import { Rewards } from './pages/Rewards';
import { Workouts } from './pages/Workouts';
import { Friends } from './pages/Friends';
import { Notifications } from './pages/Notifications';
import { Analytics } from './pages/Analytics';
import { Leaderboard } from './pages/Leaderboard';
import { CreateCompetition } from './pages/CreateCompetition';
import { Profile } from './pages/Profile';
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
  const [activeTab, setActiveTab] = useState<string>(NavigationTab.HOME);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);

  const openCompetition = (id: string) => {
    setSelectedCompetitionId(id);
    setActiveTab(NavigationTab.COMPETITION_DETAIL);
  };

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.HOME:
        return <Home onNavigate={setActiveTab} onOpenCompetition={openCompetition} />;
      case NavigationTab.HEALTH:
        return <Health />;
      case NavigationTab.COMMUNITY:
        return <Community />;
      case NavigationTab.COMPETE:
        return <Compete onOpenCompetition={openCompetition} />;
      case NavigationTab.COMPETITION_DETAIL:
        return <CompetitionDetail id={selectedCompetitionId || '1'} onBack={() => setActiveTab(NavigationTab.COMPETE)} />;
      case NavigationTab.WORKOUTS:
        return <Workouts />;
      case NavigationTab.FRIENDS:
        return <Friends />;
      case NavigationTab.ANALYTICS:
        return <Analytics />;
      case NavigationTab.LEADERBOARD:
        return <Leaderboard />;
      case NavigationTab.CREATE_COMPETITION:
        return <CreateCompetition />;
      case NavigationTab.GOALS:
        return <Goals />;
      case NavigationTab.REWARDS:
        return <Rewards />;
      case NavigationTab.PROFILE:
        return <Profile />;
      case NavigationTab.NOTIFICATIONS:
        return <Notifications />;
      case NavigationTab.FAQ:
        return <Faq />;
      case NavigationTab.SETTINGS:
        return <Settings />;
      default:
        return <Home onNavigate={setActiveTab} onOpenCompetition={openCompetition} />;
    }
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
          <div className="h-full w-full">
            {renderContent()}
          </div>
        </Layout>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
