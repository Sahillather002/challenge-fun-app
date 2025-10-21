'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Users, Calendar, DollarSign, Plus, Search, Filter, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { api, Competition, UserCompetition } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function CompetitionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [userCompetitions, setUserCompetitions] = useState<UserCompetition[]>([]);

  // Fetch competitions
  useEffect(() => {
    const fetchCompetitions = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        // Fetch all competitions
        const allComps = await api.competitions.getAll({
          status: filterStatus === 'all' ? undefined : filterStatus,
          limit: 50,
          offset: 0,
        });
        setCompetitions(allComps);

        // Fetch user's competitions to check which ones they joined
        const userComps = await api.competitions.getUserCompetitions(user.id);
        setUserCompetitions(userComps);
      } catch (error) {
        console.error('Failed to load competitions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load competitions',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [user, filterStatus, toast]);

  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getUserCompetition = (compId: string) => {
    return userCompetitions.find(uc => uc.id === compId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <div className="text-2xl font-bold">{competitions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competitions.filter((c) => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Competitions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCompetitions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prize Pool</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${competitions.reduce((sum, c) => sum + c.prize_pool, 0).toFixed(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompetitions.map((competition) => {
          const userComp = getUserCompetition(competition.id);
          return (
            <CompetitionCard 
              key={competition.id} 
              competition={competition} 
              userCompetition={userComp}
            />
          );
        })}
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

interface CompetitionCardProps {
  competition: Competition;
  userCompetition?: UserCompetition;
}

function CompetitionCard({ competition, userCompetition }: CompetitionCardProps) {
  const statusColors = {
    active: 'bg-green-500',
    upcoming: 'bg-blue-500',
    completed: 'bg-gray-500',
  };

  const typeIcons: Record<string, string> = {
    steps: '👟',
    calories: '🔥',
    distance: '📏',
    active_minutes: '⏱️',
  };

  const isJoined = !!userCompetition;

  return (
    <Link href={`/dashboard/competitions/${competition.id}`}>
      <Card className="card-hover h-full cursor-pointer transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{typeIcons[competition.type] || '🏃'}</span>
              <div className={`h-2 w-2 rounded-full ${statusColors[competition.status as keyof typeof statusColors]}`} />
            </div>
            {isJoined && (
              <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                Joined ✓
              </div>
            )}
          </div>
          <CardTitle className="text-xl">{competition.name}</CardTitle>
          <CardDescription className="line-clamp-2">{competition.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Entry Fee</p>
              <p className="font-semibold">${competition.entry_fee}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Prize Pool</p>
              <p className="font-semibold text-green-600">${competition.prize_pool}</p>
            </div>
          </div>

          {isJoined && userCompetition && (
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="text-muted-foreground mb-1">Your Progress</p>
              <div className="flex items-center justify-between">
                <span>{userCompetition.user_steps.toLocaleString()} steps</span>
                <span className="text-green-600 font-semibold">{userCompetition.user_distance.toFixed(2)} km</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm border-t pt-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(competition.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">
                {competition.status === 'active' ? '🟢 Active' : competition.status === 'upcoming' ? '🔵 Upcoming' : '⚪ Ended'}
              </span>
            </div>
          </div>

          <Button className="w-full" variant={isJoined ? 'outline' : 'default'}>
            {isJoined ? 'View Details' : 'Join Competition'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

