'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Footprints, Flame, Users, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { user } = useAuth();

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
          value="47,382"
          change="+12.5%"
          icon={<Footprints className="h-5 w-5 text-blue-500" />}
          trend="up"
        />
        <StatsCard
          title="Calories Burned"
          value="2,450"
          change="+8.2%"
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          trend="up"
        />
        <StatsCard
          title="Active Competitions"
          value="3"
          change="0"
          icon={<Trophy className="h-5 w-5 text-yellow-500" />}
          trend="neutral"
        />
        <StatsCard
          title="Your Rank"
          value="#12"
          change="+5"
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          trend="up"
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
              {[65, 85, 45, 90, 70, 95, 80].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-md transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
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
              <ActivityItem
                title="Morning Jog"
                value="5,234 steps"
                time="2 hours ago"
              />
              <ActivityItem
                title="Gym Workout"
                value="450 calories"
                time="5 hours ago"
              />
              <ActivityItem
                title="Evening Walk"
                value="3,120 steps"
                time="1 day ago"
              />
              <ActivityItem
                title="Yoga Session"
                value="180 calories"
                time="2 days ago"
              />
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
            <CompetitionCard
              title="30-Day Step Challenge"
              participants={156}
              prize="$500"
              rank={12}
              daysLeft={18}
            />
            <CompetitionCard
              title="Weekend Warriors"
              participants={89}
              prize="$250"
              rank={5}
              daysLeft={2}
            />
            <CompetitionCard
              title="Calorie Crusher"
              participants={203}
              prize="$750"
              rank={28}
              daysLeft={12}
            />
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
  participants,
  prize,
  rank,
  daysLeft,
}: {
  title: string;
  participants: number;
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
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Participants</span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {participants}
          </span>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">{daysLeft} days remaining</p>
        </div>
      </CardContent>
    </Card>
  );
}
