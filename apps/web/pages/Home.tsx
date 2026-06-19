
import React, { useMemo } from 'react';
import { motion as motionBase } from 'framer-motion';
import { Flame, Trophy, Target, TrendingUp, Bell, Dumbbell, Footprints, Droplet, Users, Medal, BarChart3 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData, formatCurrency } from '../lib/apiHelpers';
import { fallbackCompetitions, normalizeCompetitionList, normalizeStories } from '../lib/healthData';
import { NavigationTab } from '../types';

const motion = motionBase as any;

interface HomeProps {
  onNavigate: (tab: string) => void;
  onOpenCompetition: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onOpenCompetition }) => {
  const queryClient = useQueryClient();

  const { data: statsResponse } = useQuery({
    queryKey: ['web-user-stats'],
    queryFn: () => api.getStats().catch(() => null),
  });

  const { data: streakResponse } = useQuery({
    queryKey: ['web-streak'],
    queryFn: () => api.getStreak().catch(() => null),
  });

  const { data: storiesResponse } = useQuery({
    queryKey: ['web-stories'],
    queryFn: () => api.getStories().catch(() => null),
  });

  const { data: competitionsResponse } = useQuery({
    queryKey: ['web-competitions'],
    queryFn: () => api.getCompetitions().catch(() => null),
  });

  const stats = unwrapData<any>(statsResponse);
  const streak = unwrapData<any>(streakResponse);
  const stories = useMemo(() => normalizeStories(unwrapData<any[]>(storiesResponse)), [storiesResponse]);
  const competitions = useMemo(() => normalizeCompetitionList(unwrapData<any[]>(competitionsResponse)), [competitionsResponse]);

  const steps = stats?.total_steps ?? 7500;
  const calories = stats?.total_calories ?? 450;
  const activeCompetitions = stats?.active_competitions ?? competitions.length;
  const rank = stats?.best_rank ?? 47;
  const currentStreak = streak?.currentStreak ?? 7;
  const hasCheckedInToday = Boolean(streak?.hasCheckedInToday);

  const checkInMutation = useMutation({
    mutationFn: () => api.checkIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web-streak'] });
      queryClient.invalidateQueries({ queryKey: ['web-user-stats'] });
    },
  });

  return (
    <div className="p-6 lg:p-10 space-y-8 pb-24">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <p className="text-emerald-300 font-black uppercase tracking-[0.35em] text-xs mb-3">Daily competition hub</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">Welcome back, Fighter</h1>
          <p className="text-slate-400 font-medium mt-3 max-w-2xl">Track your health metrics, keep your streak alive, and jump into live fitness battles.</p>
        </div>
        <button className="p-3 glass rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-all self-start lg:self-auto">
          <Bell size={22} />
        </button>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:hidden">
        <button onClick={() => onNavigate(NavigationTab.WORKOUTS)} className="btn-secondary justify-start"><Dumbbell size={18} /> Workouts</button>
        <button onClick={() => onNavigate(NavigationTab.FRIENDS)} className="btn-secondary justify-start"><Users size={18} /> Friends</button>
        <button onClick={() => onNavigate(NavigationTab.ANALYTICS)} className="btn-secondary justify-start"><BarChart3 size={18} /> Analytics</button>
        <button onClick={() => onNavigate(NavigationTab.LEADERBOARD)} className="btn-secondary justify-start"><Medal size={18} /> Leaderboard</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: 'Steps Today', value: steps.toLocaleString(), sub: '/ 10,000 goal', icon: <Footprints size={22} />, gradient: 'from-emerald-400 to-cyan-400' },
          { label: 'Calories Burned', value: calories.toLocaleString(), sub: 'kcal', icon: <Flame size={22} />, gradient: 'from-orange-400 to-rose-500' },
          { label: 'Active Battles', value: activeCompetitions, sub: 'open now', icon: <Trophy size={22} />, gradient: 'from-fuchsia-500 to-purple-500' },
          { label: 'Current Rank', value: `#${rank}`, sub: 'global leaderboard', icon: <Medal size={22} />, gradient: 'from-cyan-400 to-blue-500' },
        ].map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
          >
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-white/5 text-emerald-300">{card.icon}</div>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Live</span>
            </div>
            <div className="mt-6">
              <div className="text-3xl font-black text-white tracking-tight">{card.value}</div>
              <div className="text-sm text-slate-400 font-bold mt-1">{card.label}</div>
              <div className="text-xs text-slate-500 mt-1">{card.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Today&apos;s Progress</h2>
              <p className="text-slate-400 font-medium text-sm mt-1">Daily goals that feed your competition score.</p>
            </div>
            <button
              disabled={checkInMutation.isPending || hasCheckedInToday}
              onClick={() => checkInMutation.mutate()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasCheckedInToday ? 'Checked In' : 'Check In'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Steps', value: `${steps.toLocaleString()} / 10,000`, progress: Math.min(steps / 10000, 1), icon: <Footprints size={18} /> },
              { label: 'Calories', value: `${calories.toLocaleString()} / 600 kcal`, progress: Math.min(calories / 600, 1), icon: <Flame size={18} /> },
              { label: 'Water', value: '1,750 / 2,500 ml', progress: 0.7, icon: <Droplet size={18} /> },
              { label: 'Activity', value: '68 / 90 min', progress: 0.75, icon: <Target size={18} /> },
            ].map((goal) => (
              <div key={goal.label} className="p-5 rounded-[1.5rem] bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5 text-emerald-300">{goal.icon}</div>
                    <span className="font-bold text-slate-200">{goal.label}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-300">{Math.round(goal.progress * 100)}%</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" style={{ width: `${goal.progress * 100}%` }} />
                </div>
                <div className="text-xs text-slate-500 font-bold mt-3">{goal.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Wins', value: 24, icon: <Trophy size={20} /> },
              { label: 'Battles', value: 67, icon: <Target size={20} /> },
              { label: 'Rank', value: `#${rank}`, icon: <Medal size={20} /> },
            ].map((item) => (
              <div key={item.label} className="p-5 rounded-3xl bg-slate-900/40 border border-white/5">
                <div className="text-emerald-300">{item.icon}</div>
                <div className="text-2xl font-black text-white mt-3">{item.value}</div>
                <div className="text-xs text-slate-500 font-black uppercase tracking-widest mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Live Now</h2>
              <p className="text-slate-400 text-sm mt-1">Join before the timer closes.</p>
            </div>
            <button onClick={() => onNavigate(NavigationTab.COMPETE)} className="text-sm font-black text-emerald-300 hover:text-emerald-200">View All</button>
          </div>
          <div className="space-y-4">
            {competitions.slice(0, 3).map((competition) => (
              <button key={competition.id} onClick={() => onOpenCompetition(competition.id)} className="w-full text-left p-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-black text-emerald-300 uppercase tracking-widest">{competition.category}</div>
                    <h3 className="text-lg font-black text-white mt-1">{competition.title}</h3>
                  </div>
                  {competition.live && <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-black">LIVE</span>}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Prize</div>
                    <div className="text-sm font-black text-white mt-1">{competition.prize}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Players</div>
                    <div className="text-sm font-black text-white mt-1">{competition.participants}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Ends</div>
                    <div className="text-sm font-black text-white mt-1">{competition.time}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Community Feed</h2>
              <p className="text-slate-400 text-sm mt-1">Recent wins from your competition circle.</p>
            </div>
            <button onClick={() => onNavigate(NavigationTab.COMMUNITY)} className="text-sm font-black text-emerald-300 hover:text-emerald-200">Open Feed</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stories.slice(0, 3).map((story) => (
              <div key={story.id} className="rounded-[1.5rem] overflow-hidden bg-white/5 border border-white/5">
                <img src={story.mediaUrl} alt={story.caption} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={story.avatar} alt={story.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-black text-white">{story.name}</div>
                      <div className="text-xs text-slate-500">@{story.username}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-3 leading-relaxed">{story.caption}</p>
                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>{story.likes.toLocaleString()} likes</span>
                    <span>{story.comments} comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-300"><Flame size={24} /></div>
            <div>
              <h2 className="text-2xl font-black text-white">{currentStreak}</h2>
              <p className="text-slate-400 text-sm font-bold">Day Streak</p>
            </div>
          </div>
          <p className="text-slate-400 font-medium leading-relaxed">Keep checking in daily to protect your streak and earn bonus XP for every live competition.</p>
          <div className="mt-6 p-5 rounded-[1.5rem] bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3 text-emerald-300 mb-2"><TrendingUp size={18} /><span className="font-black text-sm uppercase tracking-widest">Next Reward</span></div>
            <div className="text-white font-black text-xl">{formatCurrency(25)}</div>
            <div className="text-slate-400 text-sm mt-1">Unlock a Nike voucher after your next 10 battles.</div>
          </div>
          <button onClick={() => onNavigate(NavigationTab.REWARDS)} className="w-full mt-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all">View Rewards</button>
        </section>
      </section>
    </div>
  );
};
