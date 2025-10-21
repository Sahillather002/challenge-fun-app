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
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-6 pb-4 border-r border-gray-200 dark:border-gray-800">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Health Competition
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-6 w-6 shrink-0',
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* User section */}
            <li className="mt-auto">
              <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="sr-only">Your profile</span>
                <span className="flex-1 truncate">{user?.email}</span>
              </div>
              <Button
                onClick={signOut}
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
