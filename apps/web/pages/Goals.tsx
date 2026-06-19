
import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { Flame, Trophy, Target, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData } from '../lib/apiHelpers';
import { fallbackBadges, getIcon } from '../lib/healthData';

const motion = motionBase as any;

export const Goals: React.FC = () => {
  const { data: achievementsResponse } = useQuery({
    queryKey: ['web-achievements'],
    queryFn: () => api.getUserAchievements().catch(() => null),
  });

  const { data: streakResponse } = useQuery({
    queryKey: ['web-streak'],
    queryFn: () => api.getStreak().catch(() => null),
  });

  const achievements = unwrapData<any[]>(achievementsResponse);
  const streak = unwrapData<any>(streakResponse);
  const currentStreak = streak?.currentStreak ?? 7;
  const badges = achievements?.length ? achievements.map((achievement, index) => ({
    id: achievement.id || index + 1,
    name: achievement.name || 'Achievement',
    description: achievement.description || 'Unlocked through competition progress.',
    unlocked: achievement.unlocked ?? achievement.completed ?? true,
    icon: achievement.icon || (index % 2 ? 'flame' : 'trophy')
  })) : fallbackBadges;

  return (
    <div className="p-6 lg:p-10 space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-amber-300 font-black uppercase tracking-[0.35em] text-xs mb-3">Goals and achievements</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">Progress That Pays Off</h1>
          <p className="text-slate-400 font-medium mt-3 max-w-2xl">Complete daily goals, protect streaks, and unlock badges that increase your competition profile.</p>
        </div>
        <div className="px-6 py-4 rounded-[2rem] bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950">
          <div className="text-2xl font-black">{currentStreak}</div>
          <div className="text-sm font-black uppercase tracking-widest">Day Streak</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2 glass rounded-[2.5rem] border border-white/5 p-6 md:p-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white mb-6">Today&apos;s Goals</h2>
          <div className="space-y-4">
            {[
              { label: 'Complete 1 Battle', reward: '+50 XP', progress: 1, done: true },
              { label: 'Reach 10,000 Steps', reward: '+75 XP', progress: 0.75, done: false },
              { label: 'Burn 600 Calories', reward: '+100 XP', progress: 0.45, done: false },
              { label: 'Log 2,500ml Water', reward: '+40 XP', progress: 0.7, done: false }
            ].map((goal) => (
              <div key={goal.label} className="p-5 rounded-[1.5rem] bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${goal.done ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400'}`}>
                      {goal.done ? <CheckCircle2 size={18} /> : <Target size={18} />}
                    </div>
                    <span className="font-black text-white">{goal.label}</span>
                  </div>
                  <span className="text-sm font-black text-emerald-300">{goal.reward}</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" style={{ width: `${goal.progress * 100}%` }} />
                </div>
                <div className="text-xs text-slate-500 font-bold mt-3">{Math.round(goal.progress * 100)}% complete</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="glass rounded-[2.5rem] border border-white/5 p-6 md:p-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-300"><Flame size={28} /></div>
            <div>
              <h2 className="text-2xl font-black text-white">Streak Shield</h2>
              <p className="text-slate-400 text-sm mt-1">Keep checking in to avoid reset.</p>
            </div>
          </div>
          <div className="text-3xl font-black text-white">{currentStreak}</div>
          <p className="text-slate-400 mt-3 font-medium">You are on a strong run. One more daily check-in unlocks the next streak milestone.</p>
          <button className="w-full mt-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all">View Streak History</button>
        </motion.div>
      </div>

      <section className="glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">Badges Collection</h2>
            <p className="text-slate-400 text-sm mt-1">Unlock achievements by winning battles and completing health goals.</p>
          </div>
          <div className="text-sm font-black text-slate-400">{badges.filter((badge) => badge.unlocked).length} / {badges.length} unlocked</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {badges.map((badge, index) => {
            const Icon = getIcon(badge.icon as any) || Trophy;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                className={`p-6 rounded-[1.5rem] border ${badge.unlocked ? 'bg-white/5 border-emerald-500/30' : 'bg-slate-900/30 border-white/5 opacity-60'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${badge.unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                  <Icon />
                </div>
                <h3 className="text-lg font-black text-white mt-5">{badge.name}</h3>
                <p className="text-sm text-slate-400 font-medium mt-2 leading-relaxed">{badge.description}</p>
                <div className={`mt-4 text-xs font-black uppercase tracking-widest ${badge.unlocked ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
