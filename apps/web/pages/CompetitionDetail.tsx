
import React, { useMemo } from 'react';
import { motion as motionBase } from 'framer-motion';
import { ArrowLeft, Users, Clock, Trophy, Info, Medal, Target } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData, formatCurrency } from '../lib/apiHelpers';
import { normalizeCompetition } from '../lib/healthData';

const motion = motionBase as any;

interface CompetitionDetailProps {
  id: string;
  onBack: () => void;
}

export const CompetitionDetail: React.FC<CompetitionDetailProps> = ({ id, onBack }) => {
  const queryClient = useQueryClient();

  const { data: competitionResponse } = useQuery({
    queryKey: ['web-competition', id],
    queryFn: () => api.getCompetition(id).catch(() => null),
  });

  const { data: leaderboardResponse } = useQuery({
    queryKey: ['web-leaderboard', id],
    queryFn: () => api.getCompetitionLeaderboard(id).catch(() => null),
  });

  const competition = useMemo(() => normalizeCompetition(unwrapData<any>(competitionResponse)), [competitionResponse]);
  const leaderboard = useMemo(() => normalizeLeaderboard(unwrapData<any>(leaderboardResponse)), [leaderboardResponse]);

  const joinMutation = useMutation({
    mutationFn: () => api.joinCompetition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web-competition', id] });
      queryClient.invalidateQueries({ queryKey: ['web-leaderboard', id] });
      window.alert('You joined the battle. Sync your activity to start scoring.');
    },
  });

  return (
    <div className="p-6 lg:p-10 pb-24">
      <button onClick={onBack} className="mb-6 px-4 py-3 rounded-2xl glass border border-white/5 text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 font-bold">
        <ArrowLeft size={18} /> Back to competitions
      </button>

      <section className="rounded-[3rem] overflow-hidden border border-white/5 bg-gradient-to-br from-rose-500 via-fuchsia-600 to-purple-700 p-6 md:p-10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_35%)] pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-100 font-black text-xs uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              {competition.live ? 'Live Now' : 'Upcoming'}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">{competition.title}</h1>
            <p className="text-white/80 font-medium mt-4 max-w-2xl">{competition.description || 'Compete with the community and turn your daily health activity into ranked results.'}</p>
          </div>
          <button
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending}
            className="px-8 py-5 rounded-2xl bg-slate-950 text-white font-black disabled:opacity-50 hover:bg-slate-900 transition-all"
          >
            Join Battle ({competition.entryFee ? formatCurrency(competition.entryFee) : 'Free'})
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <StatCard icon={<Trophy size={20} />} label="Prize Pool" value={competition.prize} />
        <StatCard icon={<Users size={20} />} label="Participants" value={competition.participants.toLocaleString()} />
        <StatCard icon={<Clock size={20} />} label={competition.live ? 'Ends In' : 'Starts In'} value={competition.time} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <section className="xl:col-span-2 glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
          <div className="flex items-center gap-3 text-emerald-300 mb-6">
            <Info size={22} />
            <h2 className="text-2xl font-black text-white">Competition Rules</h2>
          </div>
          <ul className="space-y-4">
            {(competition.rules || fallbackRules(competition.category)).map((rule, index) => (
              <li key={index} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-300 flex items-center justify-center font-black text-sm">{index + 1}</span>
                <span className="text-slate-300 font-medium leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
          <div className="flex items-center gap-3 text-cyan-300 mb-6">
            <Target size={22} />
            <h2 className="text-2xl font-black text-white">Your Target</h2>
          </div>
          <div className="space-y-5">
            <TargetRow label="Daily activity" value="Sync steps" progress={0.72} />
            <TargetRow label="Hydration" value="2,500 ml" progress={0.7} />
            <TargetRow label="Competition score" value="Top 25%" progress={0.58} />
          </div>
        </section>
      </div>

      <section className="glass rounded-[2.5rem] border border-white/5 p-6 md:p-8 mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">Current Leaderboard</h2>
            <p className="text-slate-400 text-sm mt-1">Live rankings update as participants sync activity.</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-black text-sm">Refresh</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 border-b border-white/5 text-[10px] font-black uppercase tracking-widest">
                <th className="px-4 py-4">Rank</th>
                <th className="px-4 py-4">Athlete</th>
                <th className="px-4 py-4">Score</th>
                <th className="px-4 py-4">Steps</th>
                <th className="px-4 py-4">Calories</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <motion.tr key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="px-4 py-5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm ${rankClass(entry.rank)}`}>
                      {entry.rank <= 3 ? <Medal size={18} /> : entry.rank}
                    </div>
                  </td>
                  <td className="px-4 py-5 font-black text-white">{entry.name}</td>
                  <td className="px-4 py-5 font-black text-emerald-300">{entry.score}</td>
                  <td className="px-4 py-5 text-slate-300">{entry.steps.toLocaleString()}</td>
                  <td className="px-4 py-5 text-slate-300">{entry.calories.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="glass rounded-[2rem] border border-white/5 p-6 flex items-center gap-5">
      <div className="p-4 rounded-2xl bg-white/5 text-emerald-300">{icon}</div>
      <div>
        <div className="text-xs text-slate-500 font-black uppercase tracking-widest">{label}</div>
        <div className="text-3xl font-black text-white mt-1">{value}</div>
      </div>
    </div>
  );
}

function TargetRow({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-slate-200">{label}</span>
        <span className="text-sm font-black text-emerald-300">{Math.round(progress * 100)}%</span>
      </div>
      <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="text-xs text-slate-500 font-bold mt-3">{value}</div>
    </div>
  );
}

function normalizeLeaderboard(data: any) {
  const entries = Array.isArray(data) ? data : Array.isArray(data?.entries) ? data.entries : null;

  if (entries) {
    return entries.map(normalizeLeaderboardEntry);
  }

  return fallbackLeaderboard;
}

function normalizeLeaderboardEntry(entry: any, index: number) {
  return {
    id: entry.id || entry.user_id || `entry-${index}`,
    name: entry.user_name || entry.name || entry.user?.name || `Athlete ${index + 1}`,
    score: entry.score || 0,
    rank: entry.rank || index + 1,
    steps: entry.steps || 0,
    calories: entry.calories || 0
  };
}

const fallbackLeaderboard = [
  { id: '1', name: 'Sarah Johnson', score: 156, rank: 1, steps: 12400, calories: 610 },
  { id: '2', name: 'Mike Chen', score: 148, rank: 2, steps: 11800, calories: 580 },
  { id: '3', name: 'Emma Davis', score: 142, rank: 3, steps: 11200, calories: 540 },
  { id: '4', name: 'John Doe', score: 135, rank: 4, steps: 10600, calories: 500 },
  { id: '5', name: 'Alex Kim', score: 129, rank: 5, steps: 10100, calories: 470 }
];

function rankClass(rank: number) {
  if (rank === 1) return 'bg-yellow-400 text-slate-950';
  if (rank === 2) return 'bg-slate-300 text-slate-950';
  if (rank === 3) return 'bg-amber-700 text-white';
  return 'bg-white/5 text-slate-300 border border-white/10';
}

function fallbackRules(category: string) {
  if (category === 'Cardio') return ['Run the required distance and sync your route.', 'Manual entries require photo proof.', 'Fastest verified time wins.'];
  if (category === 'Steps') return ['Reach the highest step count before the timer ends.', 'Step data syncs from your connected device.', 'Tie-breaker is fastest time to target.'];
  return ['Complete as many verified reps as possible.', 'Each rep must be recorded through the app.', 'Top ranked participants win prizes.'];
}
