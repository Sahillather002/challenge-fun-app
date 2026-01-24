'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Trophy } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      <header className="fixed top-0 left-0 right-0 h-16 glass border-b border-white/5 z-[100] flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <Trophy size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">HealthComp</span>
          </div>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-lg mx-8 lg:mx-12">
          {/* Search bar placeholder space */}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Header Actions */}
          <Header />
        </div>
      </header>

      <div className="fixed lg:relative top-16 bottom-0 left-0 z-[120] glass border-r border-white/10 flex flex-col w-[260px] hidden lg:flex">
        <div className="flex-1 overflow-y-auto py-4">
          <Sidebar />
        </div>
      </div>

      <main className="flex-1 overflow-auto relative bg-background pt-16">
        <div className="p-6 md:p-8 lg:p-12 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
