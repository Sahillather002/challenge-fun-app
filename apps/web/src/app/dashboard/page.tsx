'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Footprints, Flame, Users, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { api, DashboardStats, UserCompetition } from '@/lib/api';
import { useToast } from '@health-competition/ui';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [competitions, setCompetitions] = useState<UserCompetition[]>([]);
  const [loading, setLoading] = useState(true);

  // ... (useEffect and loadDashboardData remain same)

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, userComps] = await Promise.all([
        api.user.getDashboard(user!.id),
        api.competitions.getUserCompetitions(user!.id, 'active'),
      ]);
      setStats(dashboardStats);
      setCompetitions(userComps);
    } catch (error: any) {
      console.error('Failed to load dashboard:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Welcome Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2 text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground font-bold">{user?.email} • Track your progress and compete</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/competitions/create">
            <Button className="btn-gradient px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-primary-foreground shadow-2xl shadow-blue-500/20">
              <Plus className="mr-2 h-4 w-4" /> Create Competition
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Steps', val: stats?.total_steps.toLocaleString() || '0', change: `${stats?.steps_change?.toFixed(1)}%`, up: (stats?.steps_change || 0) >= 0, icon: <Footprints className="text-emerald-500" /> },
          { label: 'Calories Burned', val: stats?.total_calories.toFixed(0) || '0', change: `${stats?.calories_change?.toFixed(1)}%`, up: (stats?.calories_change || 0) >= 0, icon: <Flame className="text-orange-500" /> },
          { label: 'Active Comp.', val: stats?.active_competitions.toString() || '0', change: 'Live', up: true, icon: <Trophy className="text-yellow-500" /> },
          { label: 'Best Rank', val: stats?.best_rank && stats.best_rank > 0 ? `#${stats.best_rank}` : 'N/A', change: 'Top', up: true, icon: <TrendingUp className="text-teal-500" /> },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] border border-border/50 bg-muted/20 group hover:border-border/80 transition-all shadow-xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 glass rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${card.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {card.change !== '0%' ? (card.up ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />) : null}
                {card.change}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{card.label}</div>
            <div className="text-4xl font-black tracking-tighter text-foreground">{card.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
        {/* Activity Chart */}
        <div className="lg:col-span-4 glass p-10 rounded-[3rem] border border-border/50 bg-muted/20">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Weekly Activity</h3>
          </div>
          <div className="h-64 flex items-end justify-around gap-2 px-4">
            {(stats?.weekly_activity || []).slice(0, 7).reverse().map((activity, i) => {
              const maxSteps = Math.max(...(stats?.weekly_activity || []).map(a => a.steps)) || 1;
              const height = maxSteps > 0 ? (activity.steps / maxSteps) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full relative h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-2xl transition-all duration-500 group-hover:opacity-100 opacity-80 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                    {new Date(activity.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 glass p-10 rounded-[3rem] border border-border/50 bg-muted/20">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-10 text-foreground">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              stats.recent_activity.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 glass rounded-2xl border border-border/50 hover:bg-muted/50 transition-all">
                  <div>
                    <p className="text-sm font-bold text-foreground">{activity.title}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{getTimeAgo(activity.created_at)}</p>
                  </div>
                  <span className="text-sm font-black text-primary">{activity.steps.toLocaleString()} steps</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Active Competitions */}
      <div className="glass rounded-[3rem] border border-border/50 overflow-hidden bg-muted/20">
        <div className="p-10 border-b border-border/50 flex justify-between items-center">
          <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Active Competitions</h3>
          <Link href="/dashboard/competitions">
            <Button variant="ghost" className="text-xs text-emerald-600 font-black uppercase tracking-widest hover:underline hover:bg-transparent">View All</Button>
          </Link>
        </div>
        <div className="p-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {competitions?.length > 0 ? (
            competitions.slice(0, 3).map((comp) => (
              <Link key={comp.id} href={`/dashboard/competitions/${comp.id}`}>
                <div className="glass p-6 rounded-3xl border border-border/50 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                      <Trophy size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      Rank #{comp.current_rank || 0}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{comp.name}</h4>
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prize Pool</span>
                      <span className="font-bold text-emerald-400">${comp.prize_pool}</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ends In</span>
                      <span className="font-bold text-foreground">{getDaysRemaining(comp.end_date)} days</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-3 text-sm text-muted-foreground text-center py-8">
              No active competitions. Join one to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions remain same
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return '1 day ago';
  return `${diffInDays} days ago`;
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diffInMs = end.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffInDays);
}
