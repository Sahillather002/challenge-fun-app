'use client';

import { motion } from 'framer-motion';
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
    <div className="space-y-12 pb-24 max-w-7xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link href="/dashboard/competitions">
          <Button variant="ghost" className="p-0 h-auto text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Neural Grid
          </Button>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-[3.5rem] border border-white/5 bg-slate-900/40 relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="flex items-start gap-8 flex-1">
            <div className="w-20 h-20 rounded-3xl btn-gradient flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <Trophy size={48} className="text-white fill-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border border-white/10 mb-6 backdrop-blur-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-400">{competition.status} session</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white mb-4 leading-none">{competition.title}</h1>
              <p className="text-slate-500 font-bold max-w-xl text-lg leading-relaxed">{competition.description}</p>
            </div>
          </div>

          {competition.currentRank && (
            <div className="glass p-8 rounded-[2.5rem] bg-slate-900/60 border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)] text-center min-w-[200px]">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Neural Position</p>
              <p className="text-6xl font-black text-blue-400 tracking-tighter">#{competition.currentRank}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/5">
          {[
            { label: 'Distributed Pool', val: `$${competition.prizePool}`, icon: <DollarSign size={20} className="text-amber-400" /> },
            { label: 'Active Nodes', val: competition.participants, icon: <Users size={20} className="text-blue-400" /> },
            { label: 'Time Remaining', val: `${daysLeft}d`, icon: <Calendar size={20} className="text-purple-400" /> },
            { label: 'Sync Threshold', val: competition.dailyGoal.toLocaleString(), icon: <Target size={20} className="text-emerald-400" /> },
          ].map((item, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
              </div>
              <p className="text-3xl font-black text-white">{item.val}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Your Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-10 border border-white/5 bg-slate-900/20"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-blue-400">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">Biometric Telemetry</h2>
            </div>

            <div className="space-y-10">
              <div>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 font-bold">Accumulated Signal (Steps)</p>
                    <p className="text-4xl font-black text-white tracking-tighter">{competition.yourScore.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 font-bold">Optimization Rate</p>
                    <p className="text-4xl font-black text-blue-400 tracking-tighter">65%</p>
                  </div>
                </div>
                <div className="h-4 bg-slate-900/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full btn-gradient relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:40px_40px] animate-[shimmer_2s_linear_infinite]" />
                  </motion.div>
                </div>
                <p className="text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-widest text-center">
                  Calibration Required: Synchronize additional logs to suppress top performers
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5">
                {[
                  { label: 'Avg Frequency', val: '9,514' },
                  { label: 'Peak signal', val: '15,230' },
                  { label: 'Continuity', val: '12 Epochs' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-10 border border-white/5 bg-slate-900/20"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-amber-400">
                  <Trophy size={20} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Grid Rankings</h2>
              </div>
              <Link href="/dashboard/leaderboard">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">View All Nodes</Button>
              </Link>
            </div>

            <div className="space-y-4">
              {mockLeaderboard.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                  className={`flex items-center justify-between p-6 rounded-[2rem] transition-all relative group h-20 ${entry.isCurrentUser
                    ? 'bg-blue-500/10 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                    : 'bg-slate-930/40 border border-white/5 hover:border-white/10'
                    }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl ${entry.rank === 1
                      ? 'btn-gradient-amber text-white ring-2 ring-amber-500/50'
                      : entry.rank === 2
                        ? 'bg-slate-400 text-white'
                        : entry.rank === 3
                          ? 'bg-orange-600 text-white'
                          : 'glass border border-white/10 text-slate-500'
                      }`}>
                      {entry.rank <= 3 ? entry.rank : entry.avatar}
                    </div>
                    <div>
                      <p className={`font-black uppercase tracking-tighter text-lg ${entry.isCurrentUser ? 'text-blue-400' : 'text-white'}`}>{entry.name}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {entry.score.toLocaleString()} Signals Synced
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black tracking-tighter text-slate-700 group-hover:text-white transition-colors">#{entry.rank}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-12">
          {/* Prize Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-10 border border-white/5 bg-slate-900/20"
          >
            <div className="flex items-center gap-4 mb-8">
              <Award className="h-6 w-6 text-amber-500" />
              <h3 className="text-lg font-black uppercase tracking-widest text-white">Payout Schema</h3>
            </div>
            <div className="space-y-4">
              {competition.prizes.map((prize, index) => (
                <div key={index} className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5 bg-slate-900/30">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{prize.rank}</span>
                  <span className="text-lg font-black text-emerald-400">${prize.amount}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Competition Rules */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-10 border border-white/5 bg-slate-900/20"
          >
            <h3 className="text-lg font-black uppercase tracking-widest text-white mb-8">Neural Constraints</h3>
            <ul className="space-y-6">
              {competition.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span className="text-sm font-medium text-slate-400 leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Competition Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-10 border border-white/5 bg-slate-900/20"
          >
            <h3 className="text-lg font-black uppercase tracking-widest text-white mb-8">Epoch Metadata</h3>
            <div className="space-y-6 text-[10px] font-black uppercase tracking-widest">
              {[
                { label: 'Process Type', val: competition.type },
                { label: 'Access Fee', val: `$${competition.entryFee}` },
                { label: 'Genesis', val: new Date(competition.startDate).toLocaleDateString() },
                { label: 'Termination', val: new Date(competition.endDate).toLocaleDateString() },
              ].map((item, i) => (
                <div key={i} className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="text-white">{item.val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-600">Sync Status</span>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {competition.status}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          {!competition.currentRank && (
            <Button className="w-full h-16 btn-gradient rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all">
              Join Competition
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
