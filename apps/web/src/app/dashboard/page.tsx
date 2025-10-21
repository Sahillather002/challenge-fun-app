'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Footprints, Flame, Users, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { api, DashboardStats, UserCompetition } from '@/lib/api';
import { useToast } from '@health-competition/ui';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [competitions, setCompetitions] = useState<UserCompetition[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Track your progress and compete with others
          </p>
        </div>
        <Link href="/dashboard/competitions/create">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Competition
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Steps"
          value={stats?.total_steps.toLocaleString() || '0'}
          change={`${stats?.steps_change >= 0 ? '+' : ''}${stats?.steps_change.toFixed(1)}%`}
          icon={<Footprints className="h-5 w-5 text-blue-500" />}
          trend={stats?.steps_change >= 0 ? 'up' : 'down'}
        />
        <StatsCard
          title="Calories Burned"
          value={stats?.total_calories.toFixed(0) || '0'}
          change={`${stats?.calories_change >= 0 ? '+' : ''}${stats?.calories_change.toFixed(1)}%`}
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          trend={stats?.calories_change >= 0 ? 'up' : 'down'}
        />
        <StatsCard
          title="Active Competitions"
          value={stats?.active_competitions.toString() || '0'}
          change="0"
          icon={<Trophy className="h-5 w-5 text-yellow-500" />}
          trend="neutral"
        />
        <StatsCard
          title="Your Best Rank"
          value={stats?.best_rank > 0 ? `#${stats.best_rank}` : 'N/A'}
          change=""
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          trend="neutral"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Activity Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-around gap-2">
              {(stats?.weekly_activity || []).slice(0, 7).reverse().map((activity, i) => {
                const maxSteps = Math.max(...(stats?.weekly_activity || []).map(a => a.steps));
                const height = maxSteps > 0 ? (activity.steps / maxSteps) * 100 : 0;
                return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-md transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              )})}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                stats.recent_activity.slice(0, 4).map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    title={activity.title}
                    value={`${activity.steps.toLocaleString()} steps`}
                    time={getTimeAgo(activity.created_at)}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Competitions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Competitions</CardTitle>
          <Link href="/dashboard/competitions">
            <Button variant="ghost">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competitions.length > 0 ? (
              competitions.slice(0, 3).map((comp) => (
                <Link key={comp.id} href={`/dashboard/competitions/${comp.id}`}>
                  <CompetitionCard
                    title={comp.name}
                    prize={`$${comp.prize_pool}`}
                    rank={comp.current_rank || 0}
                    daysLeft={getDaysRemaining(comp.end_date)}
                  />
                </Link>
              ))
            ) : (
              <p className="col-span-3 text-sm text-muted-foreground text-center py-8">
                No active competitions. Join one to get started!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  change,
  icon,
  trend,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            trend === 'up'
              ? 'text-green-600'
              : trend === 'down'
              ? 'text-red-600'
              : 'text-muted-foreground'
          }`}
        >
          {change !== '0' && (trend === 'up' ? '↑' : trend === 'down' ? '↓' : '')} {change} from last week
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ title, value, time }: { title: string; value: string; time: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function CompetitionCard({
  title,
  prize,
  rank,
  daysLeft,
}: {
  title: string;
  prize: string;
  rank: number;
  daysLeft: number;
}) {
  return (
    <Card className="card-hover cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Prize Pool</span>
          <span className="font-bold text-green-600">{prize}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Your Rank</span>
          <span className="font-semibold">#{rank}</span>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">{daysLeft} days remaining</p>
        </div>
      </CardContent>
    </Card>
  );
}

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
