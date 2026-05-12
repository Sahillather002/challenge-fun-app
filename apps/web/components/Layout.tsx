
import React, { useState, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Layers, 
  Settings, 
  BarChart3, 
  Zap,
  Menu,
  X,
  Sparkles,
  Activity,
  Bell,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  Key,
  FileText,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { NavigationTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const motion = motionBase as any;

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mainNav = [
    { id: NavigationTab.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: NavigationTab.CHAT, label: 'Chat Playground', icon: <MessageSquare size={20} /> },
    { id: NavigationTab.CREATIVE, label: 'Creative Lab', icon: <Sparkles size={20} /> },
    { id: NavigationTab.MODELS, label: 'Models Catalog', icon: <Layers size={20} /> },
    { id: NavigationTab.ANALYTICS, label: 'Analytics', icon: <BarChart3 size={20} /> },
  ];

  const adminNav = [
    { id: NavigationTab.API_KEYS, label: 'API Management', icon: <Key size={20} /> },
    { id: NavigationTab.PRICING, label: 'Usage & Billing', icon: <CreditCard size={20} /> },
    { id: NavigationTab.STATUS, label: 'Platform Status', icon: <Activity size={20} /> },
  ];

  const supportNav = [
    { id: NavigationTab.DOCS, label: 'Documentation', icon: <FileText size={20} /> },
    { id: NavigationTab.FAQ, label: 'Help & FAQ', icon: <HelpCircle size={20} /> },
    { id: NavigationTab.SETTINGS, label: 'Settings', icon: <Settings size={20} /> },
  ];

  const NavSection = ({ items, title }: { items: typeof mainNav, title?: string }) => (
    <div className="space-y-1">
      {title && !isCollapsed && (
        <h3 className="px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">{title}</h3>
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
            className={`
              relative group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-blue-600/10 text-blue-400' 
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}
            `}
          >
            <div className={`flex-shrink-0 ${isActive ? 'text-blue-400 scale-110' : 'group-hover:scale-110'} transition-transform`}>
              {item.icon}
            </div>
            <span className={`font-bold text-sm whitespace-nowrap transition-all duration-300 ${(!isMobile && isCollapsed) ? 'opacity-0 translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden relative">
      <header className="fixed top-0 left-0 right-0 h-16 glass border-b border-white/5 z-[100] flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onTabChange(NavigationTab.LANDING)}
          >
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">OmniGen</span>
          </div>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-lg mx-8 lg:mx-12">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search resources, models, docs..."
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-2 pl-11 pr-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-slate-400 hover:text-white relative rounded-xl hover:bg-white/5 transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950"></span>
          </button>
          <div className="h-8 w-[1px] bg-slate-800 hidden sm:block"></div>
          <button className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-slate-800 transition-all">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
              <User size={16} className="text-slate-400" />
            </div>
            <span className="hidden sm:block text-xs font-bold text-slate-300">Admin_94</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={false}
        animate={{ 
          width: isMobile ? (isSidebarOpen ? 280 : 0) : (isCollapsed ? 80 : 260),
          x: isMobile && !isSidebarOpen ? -280 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:relative top-16 bottom-0 left-0 z-[120] glass border-r border-white/10 flex flex-col overflow-hidden"
      >
        <div className="flex-1 flex flex-col p-4 w-[280px] lg:w-full space-y-8 overflow-y-auto custom-scrollbar">
          <NavSection items={mainNav} title="Platform" />
          <NavSection items={adminNav} title="Administration" />
          <NavSection items={supportNav} title="Account & Support" />

          <div className="mt-auto pt-4 border-t border-white/5">
            {!isMobile && (
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all"
              >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                <span className={`font-bold text-sm transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'}`}>Collapse UI</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <main className="flex-1 overflow-auto relative bg-[#020617] pt-16 transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
