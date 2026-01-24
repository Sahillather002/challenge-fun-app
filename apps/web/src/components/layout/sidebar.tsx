'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Trophy,
  LayoutDashboard,
  Users,
  TrendingUp,
  Settings,
  CreditCard,
  LogOut,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Competitions', href: '/dashboard/competitions', icon: Trophy },
  { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: TrendingUp },
  { name: 'Activity', href: '/dashboard/activity', icon: Activity },
  { name: 'Profile', href: '/dashboard/profile', icon: Users },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col h-full px-4 space-y-4">
      <div className="space-y-1">
        <h3 className="px-4 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Platform</h3>
        {navigation.filter(item => !['Settings', 'Profile'].includes(item.name)).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  'flex-shrink-0 transition-transform',
                  isActive ? 'text-primary scale-110' : 'text-muted-foreground group-hover:scale-110'
                )}
              />
              <span className="font-bold text-sm whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-1">
        <h3 className="px-4 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Account</h3>
        {navigation.filter(item => ['Settings', 'Profile'].includes(item.name)).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  'flex-shrink-0 transition-transform',
                  isActive ? 'text-primary scale-110' : 'text-muted-foreground group-hover:scale-110'
                )}
              />
              <span className="font-bold text-sm whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="px-2 py-3 flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10 text-xs font-bold text-muted-foreground">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate text-foreground">{user?.email}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">User</p>
          </div>
        </div>
        <Button
          onClick={signOut}
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-red-400 hover:bg-red-500/10 px-4"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-bold text-sm">Sign out</span>
        </Button>
      </div>
    </div>
  );
}
