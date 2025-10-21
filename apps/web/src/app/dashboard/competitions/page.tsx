'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Users, Calendar, DollarSign, Plus, Search, Filter, Clock } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with actual API calls
const mockCompetitions = [
  {
    id: '1',
    title: '30-Day Step Challenge',
    description: 'Walk your way to victory! Complete 10,000 steps daily for 30 days.',
    participants: 156,
    entryFee: 25,
    prizePool: 500,
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    status: 'active',
    type: 'steps',
    currentRank: 12,
  },
  {
    id: '2',
    title: 'Weekend Warriors',
    description: 'Intense weekend fitness competition. Most active minutes wins!',
    participants: 89,
    entryFee: 15,
    prizePool: 250,
    startDate: '2024-10-26',
    endDate: '2024-10-27',
    status: 'active',
    type: 'active_minutes',
    currentRank: 5,
  },
  {
    id: '3',
    title: 'Calorie Crusher October',
    description: 'Burn the most calories this month and win big!',
    participants: 203,
    entryFee: 30,
    prizePool: 750,
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    status: 'active',
    type: 'calories',
    currentRank: 28,
  },
  {
    id: '4',
    title: 'November Sprint',
    description: 'Short but intense! 7-day all-out fitness challenge.',
    participants: 67,
    entryFee: 20,
    prizePool: 300,
    startDate: '2024-11-15',
    endDate: '2024-11-21',
    status: 'upcoming',
    type: 'steps',
  },
  {
    id: '5',
    title: 'Distance Dominator',
    description: 'Cover the most distance in 14 days. Run, walk, cycle!',
    participants: 142,
    entryFee: 25,
    prizePool: 600,
    startDate: '2024-11-05',
    endDate: '2024-11-18',
    status: 'upcoming',
    type: 'distance',
  },
];

export default function CompetitionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  const filteredCompetitions = mockCompetitions.filter((comp) => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || comp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Competitions</h1>
          <p className="text-muted-foreground">
            Browse and join fitness competitions to compete and win prizes
          </p>
        </div>
        <Link href="/dashboard/competitions/create">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create Competition
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('upcoming')}
          >
            Upcoming
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Competitions</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompetitions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCompetitions.filter((c) => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Competitions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prize Pool</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockCompetitions.reduce((sum, c) => sum + c.prizePool, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompetitions.map((competition) => (
          <CompetitionCard key={competition.id} competition={competition} />
        ))}
      </div>

      {filteredCompetitions.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No competitions found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}>
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function CompetitionCard({ competition }: { competition: any }) {
  const statusColors = {
    active: 'bg-green-500',
    upcoming: 'bg-blue-500',
    completed: 'bg-gray-500',
  };

  const typeIcons = {
    steps: '👟',
    calories: '🔥',
    distance: '📏',
    active_minutes: '⏱️',
  };

  return (
    <Link href={`/dashboard/competitions/${competition.id}`}>
      <Card className="card-hover h-full cursor-pointer transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{typeIcons[competition.type as keyof typeof typeIcons]}</span>
              <div className={`h-2 w-2 rounded-full ${statusColors[competition.status as keyof typeof statusColors]}`} />
            </div>
            {competition.currentRank && (
              <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                Rank #{competition.currentRank}
              </div>
            )}
          </div>
          <CardTitle className="text-xl">{competition.title}</CardTitle>
          <CardDescription className="line-clamp-2">{competition.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Entry Fee</p>
              <p className="font-semibold">${competition.entryFee}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Prize Pool</p>
              <p className="font-semibold text-green-600">${competition.prizePool}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm border-t pt-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{competition.participants} participants</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(competition.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          <Button className="w-full" variant={competition.currentRank ? 'outline' : 'default'}>
            {competition.currentRank ? 'View Details' : 'Join Competition'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
