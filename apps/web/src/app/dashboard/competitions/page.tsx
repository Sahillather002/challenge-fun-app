'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Users, Calendar, DollarSign, Plus, Search, Filter, Clock } from 'lucide-react';
import Link from 'next/link';

import { motion } from 'framer-motion';

// Mock data - replace with actual API calls
const mockCompetitions = [
  // ... (same as before)
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
    <div className="space-y-12 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2 text-foreground">Competitions</h1>
          <p className="text-slate-500 font-bold">Discover and join global fitness challenges</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/competitions/create">
            <Button className="btn-gradient px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-500/20">
              <Plus className="mr-2 h-4 w-4" /> Create competition
            </Button>
          </Link>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1 relative w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <Input
            type="search"
            placeholder="Search by intelligence engine, challenge type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 bg-slate-900/40 border-slate-800 rounded-2xl h-14 text-white focus:border-blue-500/50 transition-all placeholder:text-slate-700"
          />
        </div>
        <div className="flex p-1.5 glass rounded-2xl border border-white/5 bg-slate-900/40 shrink-0">
          {(['all', 'active', 'upcoming'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${filterStatus === status
                  ? 'bg-blue-600/10 text-blue-400 shadow-inner'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Volume', val: mockCompetitions.length.toString(), icon: <Trophy className="text-blue-400" /> },
          { label: 'Active Epochs', val: mockCompetitions.filter((c) => c.status === 'active').length.toString(), icon: <Clock className="text-purple-400" /> },
          { label: 'My Deployments', val: '3', icon: <Users className="text-emerald-400" /> },
          { label: 'Distributed Pool', val: `$${mockCompetitions.reduce((sum, c) => sum + c.prizePool, 0)}`, icon: <DollarSign className="text-amber-400" /> },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/20 group hover:border-white/10 transition-all shadow-xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 glass rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-4xl font-black tracking-tighter text-foreground">{stat.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Competitions Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompetitions.map((competition, i) => (
          <CompetitionCard key={competition.id} competition={competition} index={i} />
        ))}
      </div>

      {filteredCompetitions.length === 0 && (
        <div className="glass p-20 rounded-[3rem] border border-white/5 bg-slate-900/20 text-center">
          <Trophy className="h-16 w-16 mx-auto text-slate-700 mb-6 opacity-50" />
          <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">No neural matches found</h3>
          <p className="text-slate-500 font-bold mb-8">
            Adjust your search parameters or query filters to expand discovery.
          </p>
          <Button
            onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
            className="px-8 py-3 rounded-2xl glass text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white"
          >
            Reset Protocol Filters
          </Button>
        </div>
      )}
    </div>
  );
}

function CompetitionCard({ competition, index }: { competition: any, index: number }) {
  const statusColors = {
    active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    upcoming: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    completed: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
  };

  const typeIcons = {
    steps: '👟',
    calories: '🔥',
    distance: '📏',
    active_minutes: '⏱️',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/dashboard/competitions/${competition.id}`}>
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/20 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group h-full flex flex-col">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform">
                {typeIcons[competition.type as keyof typeof typeIcons]}
              </div>
              <div>
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[competition.status as keyof typeof statusColors]}`}>
                  {competition.status}
                </span>
              </div>
            </div>
            {competition.currentRank && (
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 shadow-lg">
                Rank #{competition.currentRank}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-black tracking-tight uppercase text-white mb-4 group-hover:text-blue-400 transition-colors">
              {competition.title}
            </h3>
            <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-8 leading-relaxed">
              {competition.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-2xl border border-white/5 bg-slate-900/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Entry Protocol</p>
                <p className="text-lg font-black text-white">${competition.entryFee}</p>
              </div>
              <div className="glass p-4 rounded-2xl border border-white/5 bg-slate-900/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Total Payload</p>
                <p className="text-lg font-black text-emerald-400">${competition.prizePool}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 border-t border-white/5 pt-6">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-blue-500" />
                <span>{competition.participants} Nodes</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-purple-500" />
                <span>
                  {new Date(competition.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            <Button className="w-full h-14 btn-gradient rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-blue-500/20 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Access Neural Data
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
