'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar, DollarSign, ArrowLeft, Target, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock data - replace with actual API call
const getMockCompetition = (id: string) => ({
  id,
  title: '30-Day Step Challenge',
  description: 'Walk your way to victory! Complete 10,000 steps daily for 30 days and compete with fitness enthusiasts around the world.',
  participants: 156,
  entryFee: 25,
  prizePool: 500,
  startDate: '2024-11-01',
  endDate: '2024-11-30',
  status: 'active',
  type: 'steps',
  currentRank: 12,
  yourScore: 285420,
  dailyGoal: 10000,
  rules: [
    'Track at least 10,000 steps daily',
    'Data must be synced within 24 hours',
    'No fraudulent activity allowed',
    'Prize distribution based on final rankings',
  ],
  prizes: [
    { rank: '1st Place', amount: 250 },
    { rank: '2nd Place', amount: 150 },
    { rank: '3rd Place', amount: 100 },
  ],
});

const mockLeaderboard = [
  { rank: 1, name: 'Sarah Johnson', score: 342580, avatar: 'S' },
  { rank: 2, name: 'Mike Chen', score: 328910, avatar: 'M' },
  { rank: 3, name: 'Emma Davis', score: 312450, avatar: 'E' },
  { rank: 4, name: 'James Wilson', score: 298320, avatar: 'J' },
  { rank: 5, name: 'Lisa Anderson', score: 295180, avatar: 'L' },
  { rank: 12, name: 'You', score: 285420, avatar: 'Y', isCurrentUser: true },
];

export default function CompetitionDetailPage() {
  const params = useParams();
  const competition = getMockCompetition(params?.id as string);

  const daysLeft = Math.ceil(
    (new Date(competition.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/competitions">
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Competitions
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold mb-2">{competition.title}</h1>
              <p className="opacity-90">{competition.description}</p>
            </div>
          </div>
          {competition.currentRank && (
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <p className="text-sm opacity-80 mb-1">Your Rank</p>
              <p className="text-3xl font-bold">#{competition.currentRank}</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <DollarSign className="h-5 w-5 mb-2 opacity-80" />
            <p className="text-sm opacity-80">Prize Pool</p>
            <p className="text-2xl font-bold">${competition.prizePool}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Users className="h-5 w-5 mb-2 opacity-80" />
            <p className="text-sm opacity-80">Participants</p>
            <p className="text-2xl font-bold">{competition.participants}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Calendar className="h-5 w-5 mb-2 opacity-80" />
            <p className="text-sm opacity-80">Days Left</p>
            <p className="text-2xl font-bold">{daysLeft}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Target className="h-5 w-5 mb-2 opacity-80" />
            <p className="text-sm opacity-80">Daily Goal</p>
            <p className="text-2xl font-bold">{competition.dailyGoal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Your Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total Steps</span>
                    <span className="text-2xl font-bold">{competition.yourScore.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: '65%' }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    65% to top position
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg/Day</p>
                    <p className="text-xl font-semibold">9,514</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best Day</p>
                    <p className="text-xl font-semibold">15,230</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-xl font-semibold">12 days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Leaderboard
              </CardTitle>
              <Link href="/dashboard/leaderboard">
                <Button variant="ghost" size="sm">View Full</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLeaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.isCurrentUser
                        ? 'bg-primary/10 border border-primary'
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1
                          ? 'bg-yellow-500 text-white'
                          : entry.rank === 2
                          ? 'bg-gray-400 text-white'
                          : entry.rank === 3
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {entry.rank <= 3 ? entry.rank : entry.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.score.toLocaleString()} steps
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">#{entry.rank}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prize Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Prize Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {competition.prizes.map((prize, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">{prize.rank}</span>
                  <span className="font-bold text-green-600">${prize.amount}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Competition Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {competition.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Competition Info */}
          <Card>
            <CardHeader>
              <CardTitle>Competition Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{competition.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entry Fee</span>
                <span className="font-medium">${competition.entryFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium">
                  {new Date(competition.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Date</span>
                <span className="font-medium">
                  {new Date(competition.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {competition.status}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          {!competition.currentRank && (
            <Button className="w-full" size="lg">
              Join Competition
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
