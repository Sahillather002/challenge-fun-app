import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion as motionBase } from 'framer-motion';
import {
  LayoutDashboard,
  Activity,
  Users,
  Trophy,
  Target,
  Gift,
  Settings,
  Menu,
  X,
  Flame,
  Bell,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Dumbbell,
  UserPlus,
  BarChart3,
  Medal,
  PlusCircle,
  BellRing
} from 'lucide-react';
import { NavigationTab, WEB_ROUTES, type NavigationRoute } from '../types';
import { ThemeToggle } from './theme/ThemeToggle';

const motion = motionBase as any;

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1100;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navIcons: Record<string, React.ReactNode> = {
    home: <LayoutDashboard size={18} />,
    health: <Activity size={18} />,
    community: <Users size={18} />,
    compete: <Trophy size={18} />,
    workouts: <Dumbbell size={18} />,
    friends: <UserPlus size={18} />,
    analytics: <BarChart3 size={18} />,
    leaderboard: <Medal size={18} />,
    'create-competition': <PlusCircle size={18} />,
    goals: <Target size={18} />,
    rewards: <Gift size={18} />,
    profile: <User size={18} />,
    notifications: <BellRing size={18} />,
    faq: <HelpCircle size={18} />,
    settings: <Settings size={18} />
  };

  const mainNav = WEB_ROUTES
    .filter((route) => route.section === 'Competition Hub')
    .map((route) => ({ ...route, icon: navIcons[route.id] }));

  const supportNav = WEB_ROUTES
    .filter((route) => route.section === 'Account')
    .map((route) => ({ ...route, icon: navIcons[route.id] }));

  const NavSection = ({ items, title }: { items: Array<Pick<NavigationRoute, 'id' | 'label'> & { icon: React.ReactNode }>; title?: string }) => (
    <div className="space-y-1">
      {title && !isCollapsed && (
        <h3 className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
      )}
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              if (isMobile) setIsSidebarOpen(false);
            }}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <span className={`shrink-0 ${isActive ? 'scale-110 text-primary' : 'group-hover:scale-110'} transition-transform`}>{item.icon}</span>
            <span className={`whitespace-nowrap transition-all duration-300 ${(!isMobile && isCollapsed) ? 'pointer-events-none translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed left-0 right-0 top-0 z-[100] flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
        <div className="flex items-center gap-4">
          <button className="btn-ghost lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="group flex cursor-pointer items-center gap-2.5" onClick={() => onTabChange(NavigationTab.HOME)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow group-hover:rotate-3 transition-transform">
              <Flame size={20} className="fill-current" />
            </div>
            <div>
              <span className="block text-base font-bold leading-none text-foreground">FitBattle</span>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Health Competition</span>
            </div>
          </div>
        </div>

        <div className="mx-4 hidden flex-1 max-w-lg items-center md:flex">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search workouts, competitions, friends..." className="input-mobile pl-11" />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="btn-ghost relative hidden sm:inline-flex">
            <Bell size={18} />
            <span className="absolute right-3 top-2 h-2 w-2 rounded-full bg-success" />
          </button>
          <ThemeToggle />
          <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
          <button className="btn-ghost hidden sm:inline-flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><User size={16} /></div>
            <span className="hidden lg:inline">Fit Fighter</span>
          </button>
          <button className="btn-ghost hidden lg:inline-flex">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm lg:hidden" />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ width: isMobile ? (isSidebarOpen ? 280 : 0) : (isCollapsed ? 84 : 272), x: isMobile && !isSidebarOpen ? -280 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed bottom-0 left-0 top-16 z-[120] flex flex-col overflow-hidden border-r border-border bg-background lg:relative"
      >
        <div className="flex w-[280px] flex-1 flex-col space-y-6 overflow-y-auto p-3 custom-scrollbar lg:w-full">
          <NavSection items={mainNav} title="Competition Hub" />
          <NavSection items={supportNav} title="Account" />

          <div className="mt-auto border-t border-border pt-3">
            {!isMobile && (
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="btn-ghost w-full justify-start">
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                <span className={`transition-all duration-300 ${isCollapsed ? 'pointer-events-none translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>Collapse UI</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <main className="relative min-h-full flex-1 overflow-auto bg-background pt-16 transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="min-h-full">
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}
