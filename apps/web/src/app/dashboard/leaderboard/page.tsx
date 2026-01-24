'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, TrendingUp, TrendingDown, Minus, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const fullLeaderboard = [
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
  const currentUser = fullLeaderboard.find(u => u.isCurrentUser);

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2 text-white">Neural Hub Ranking</h1>
          <p className="text-slate-500 font-bold">Real-time global biometric synchronization across all nodes</p>
        </div>
        <div className="flex p-1.5 glass rounded-2xl border border-white/5 bg-slate-900/40">
          {(['today', 'week', 'month', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`
                px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${timeFilter === filter
                  ? 'bg-blue-600/10 text-blue-400 shadow-inner'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            label: 'Current Node rank',
            val: `#${currentUser?.rank}`,
            icon: <Trophy className="text-blue-400" />,
            sub: currentUser && currentUser.change !== 0 ? (
              <div className={`flex items-center gap-1 ${currentUser.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {currentUser.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{Math.abs(currentUser.change)} positions {currentUser.change > 0 ? 'gained' : 'lost'}</span>
              </div>
            ) : <span className="text-slate-600">Stable frequency</span>
          },
          { label: 'Signal Payload', val: currentUser?.score.toLocaleString(), icon: <Zap className="text-amber-400" />, sub: 'Total steps synced' },
          { label: 'Active Continuity', val: `${currentUser?.streak} Epochs`, icon: <TrendingUp className="text-purple-400" />, sub: 'Verification streak' },
          { label: 'Network Nodes', val: fullLeaderboard.length.toLocaleString(), icon: <Users className="text-slate-400" />, sub: 'Active global operatives' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/20 shadow-xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 glass rounded-2xl shadow-inner text-blue-400">
                {stat.icon}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-4xl font-black tracking-tighter text-white mb-2">{stat.val}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Podium Section */}
      <div className="grid md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto py-12">
        {/* 2nd Place */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center group"
        >
          <div className="relative mb-6 mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-slate-400 opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity" />
            <div className="relative w-full h-full rounded-full glass border-2 border-slate-400 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
              {fullLeaderboard[1].avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-slate-400 flex items-center justify-center shadow-xl">
              <Medal size={24} className="text-white" />
            </div>
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">{fullLeaderboard[1].name}</h3>
          <p className="text-slate-500 font-bold text-sm tracking-widest mb-4 uppercase">Neural Sub-Director</p>
          <div className="glass p-6 rounded-3xl border border-white/5 bg-slate-900/60">
            <p className="text-2xl font-black text-slate-400 tracking-tighter">#2</p>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{fullLeaderboard[1].score.toLocaleString()} Signals</p>
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center group"
        >
          <div className="relative mb-8 mx-auto w-44 h-44">
            <div className="absolute inset-0 bg-amber-500 opacity-20 rounded-full blur-3xl group-hover:opacity-40 transition-opacity animate-pulse" />
            <div className="relative w-full h-full rounded-full glass border-4 border-amber-500 flex items-center justify-center text-6xl font-black text-white shadow-[0_0_60px_rgba(245,158,11,0.2)]">
              {fullLeaderboard[0].avatar}
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-[#f59e0b] flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <Trophy size={32} className="text-white fill-white" />
            </div>
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">{fullLeaderboard[0].name}</h3>
          <p className="text-amber-500 font-black text-sm tracking-[0.3em] mb-6 uppercase">Prime Operative</p>
          <div className="glass p-8 rounded-[2.5rem] border border-amber-500/20 bg-slate-900/60 shadow-2xl">
            <p className="text-4xl font-black text-amber-500 tracking-tighter">#1</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{fullLeaderboard[0].score.toLocaleString()} Signals</p>
          </div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center group"
        >
          <div className="relative mb-6 mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-orange-600 opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity" />
            <div className="relative w-full h-full rounded-full glass border-2 border-orange-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
              {fullLeaderboard[2].avatar}
            </div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-xl">
              <Medal size={24} className="text-white" />
            </div>
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">{fullLeaderboard[2].name}</h3>
          <p className="text-slate-500 font-bold text-sm tracking-widest mb-4 uppercase">Sector Lead</p>
          <div className="glass p-6 rounded-3xl border border-white/5 bg-slate-900/60">
            <p className="text-2xl font-black text-orange-600 tracking-tighter">#3</p>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{fullLeaderboard[2].score.toLocaleString()} Signals</p>
          </div>
        </motion.div>
      </div>

      {/* Full Grid Rankings */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 px-8 mb-4">
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-600">The Neural Grid</h2>
          <div className="h-px bg-white/5 flex-1" />
        </div>

        {fullLeaderboard.slice(3).map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-between p-6 rounded-[2rem] transition-all relative group h-24 ${entry.isCurrentUser
                ? 'bg-blue-500/10 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                : 'bg-slate-900/40 border border-white/5 hover:border-white/10'
              }`}
          >
            <div className="flex items-center gap-8 flex-1">
              <div className="w-12 text-center">
                <span className="text-2xl font-black text-slate-700 tracking-tighter group-hover:text-white transition-colors">#{entry.rank}</span>
              </div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl font-black text-white shadow-xl group-hover:scale-110 transition-transform">
                  {entry.avatar}
                </div>
                {entry.streak > 20 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] shadow-lg animate-bounce">
                    🔥
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-xl font-black uppercase tracking-tighter ${entry.isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="ml-4 text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full">
                      LINKED NODE
                    </span>
                  )}
                </p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                  {entry.country} / Verification streak: {entry.streak} Epochs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="text-right">
                <p className="text-3xl font-black tracking-tighter text-white">{entry.score.toLocaleString()}</p>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Signals</p>
              </div>
              <div className="w-20 flex justify-center">
                {entry.change > 0 ? (
                  <div className="glass px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center gap-1">
                    <TrendingUp size={14} />
                    <span className="text-xs font-black">+{entry.change}</span>
                  </div>
                ) : entry.change < 0 ? (
                  <div className="glass px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-100 flex items-center gap-1">
                    <TrendingDown size={14} />
                    <span className="text-xs font-black">{entry.change}</span>
                  </div>
                ) : (
                  <div className="glass px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-slate-500">
                    <Minus size={14} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
