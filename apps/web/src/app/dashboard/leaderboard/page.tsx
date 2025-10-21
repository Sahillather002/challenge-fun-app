'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, TrendingUp, TrendingDown, Minus, Users, Zap } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, name: 'Sarah Johnson', score: 342580, change: 0, avatar: 'S', streak: 28, country: 'USA' },
  { rank: 2, name: 'Mike Chen', score: 328910, change: 1, avatar: 'M', streak: 25, country: 'Canada' },
  { rank: 3, name: 'Emma Davis', score: 312450, change: -1, avatar: 'E', streak: 30, country: 'UK' },
  { rank: 4, name: 'James Wilson', score: 298320, change: 2, avatar: 'J', streak: 22, country: 'Australia' },
  { rank: 5, name: 'Lisa Anderson', score: 295180, change: -2, avatar: 'L', streak: 27, country: 'USA' },
  { rank: 6, name: 'David Brown', score: 290850, change: 1, avatar: 'D', streak: 20, country: 'UK' },
  { rank: 7, name: 'Maria Garcia', score: 287640, change: -1, avatar: 'M', streak: 24, country: 'Spain' },
  { rank: 8, name: 'John Smith', score: 285920, change: 0, avatar: 'J', streak: 26, country: 'USA' },
  { rank: 9, name: 'Anna Lee', score: 283510, change: 3, avatar: 'A', streak: 19, country: 'Korea' },
  { rank: 10, name: 'Tom Harris', score: 281200, change: -2, avatar: 'T', streak: 21, country: 'Canada' },
  { rank: 11, name: 'Sophie Martin', score: 279880, change: 1, avatar: 'S', streak: 23, country: 'France' },
  { rank: 12, name: 'You', score: 278420, change: -1, avatar: 'Y', streak: 18, country: 'USA', isCurrentUser: true },
];

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const currentUser = mockLeaderboard.find(u => u.isCurrentUser);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Global Leaderboard</h1>
        <p className="text-muted-foreground">
          Compete with fitness enthusiasts worldwide
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{currentUser?.rank}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {currentUser && currentUser.change > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+{currentUser.change} from yesterday</span>
                </>
              ) : currentUser && currentUser.change < 0 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">{currentUser.change} from yesterday</span>
                </>
              ) : (
                <>
                  <Minus className="h-3 w-3 mr-1" />
                  <span>No change</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Score</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser?.score.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total steps this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser?.streak} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep it up!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLeaderboard.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2">
        <Button
          variant={timeFilter === 'today' ? 'default' : 'outline'}
          onClick={() => setTimeFilter('today')}
        >
          Today
        </Button>
        <Button
          variant={timeFilter === 'week' ? 'default' : 'outline'}
          onClick={() => setTimeFilter('week')}
        >
          This Week
        </Button>
        <Button
          variant={timeFilter === 'month' ? 'default' : 'outline'}
          onClick={() => setTimeFilter('month')}
        >
          This Month
        </Button>
        <Button
          variant={timeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setTimeFilter('all')}
        >
          All Time
        </Button>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Performers
          </CardTitle>
          <CardDescription>
            Rankings updated in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 pb-8 border-b">
            {/* 2nd Place */}
            <div className="text-center order-2 md:order-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-white font-bold text-2xl mb-3 mx-auto">
                {mockLeaderboard[1].avatar}
              </div>
              <Medal className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="font-semibold text-lg">{mockLeaderboard[1].name}</h3>
              <p className="text-2xl font-bold text-gray-400 mb-1">2nd</p>
              <p className="text-sm text-muted-foreground">
                {mockLeaderboard[1].score.toLocaleString()} steps
              </p>
            </div>

            {/* 1st Place */}
            <div className="text-center order-1 md:order-2 transform md:scale-110">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold text-3xl mb-3 mx-auto shadow-lg">
                {mockLeaderboard[0].avatar}
              </div>
              <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-xl">{mockLeaderboard[0].name}</h3>
              <p className="text-3xl font-bold text-yellow-600 mb-1">1st</p>
              <p className="text-sm text-muted-foreground">
                {mockLeaderboard[0].score.toLocaleString()} steps
              </p>
            </div>

            {/* 3rd Place */}
            <div className="text-center order-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-2xl mb-3 mx-auto">
                {mockLeaderboard[2].avatar}
              </div>
              <Medal className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-lg">{mockLeaderboard[2].name}</h3>
              <p className="text-2xl font-bold text-orange-500 mb-1">3rd</p>
              <p className="text-sm text-muted-foreground">
                {mockLeaderboard[2].score.toLocaleString()} steps
              </p>
            </div>
          </div>

          {/* Rest of Rankings */}
          <div className="space-y-2">
            {mockLeaderboard.slice(3).map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  entry.isCurrentUser
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 text-center">
                    <span className="text-lg font-bold text-muted-foreground">
                      #{entry.rank}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {entry.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {entry.country} • {entry.streak} day streak 🔥
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {entry.score.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">steps</p>
                  </div>
                  <div className="w-16 text-center">
                    {entry.change > 0 ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">+{entry.change}</span>
                      </div>
                    ) : entry.change < 0 ? (
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm font-medium">{entry.change}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Minus className="h-4 w-4" />
                        <span className="text-sm">-</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
