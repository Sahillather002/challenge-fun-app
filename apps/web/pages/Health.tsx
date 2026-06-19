
import React, { useMemo, useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { Footprints, Droplet, Flame, TrendingUp, Calendar, Settings, Plus, RefreshCcw, Target } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData, todayISO } from '../lib/apiHelpers';

const motion = motionBase as any;

const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const Health: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'steps' | 'water'>('steps');
  const [waterGoal, setWaterGoal] = useState(2500);
  const [waterIntake, setWaterIntake] = useState(1750);
  const [steps, setSteps] = useState(7500);
  const queryClient = useQueryClient();

  const { data: healthResponse } = useQuery({
    queryKey: ['web-health-data'],
    queryFn: () => api.getHealthData({ date: todayISO() }).catch(() => null),
  });

  const { data: weeklyResponse } = useQuery({
    queryKey: ['web-weekly-activity'],
    queryFn: () => api.getWeeklyActivity().catch(() => null),
  });

  const { data: statsResponse } = useQuery({
    queryKey: ['web-dashboard-stats'],
    queryFn: () => api.getDashboardStats().catch(() => null),
  });

  const health = unwrapData<any>(healthResponse);
  const weekly = unwrapData<any[]>(weeklyResponse);
  const stats = unwrapData<any>(statsResponse);

  const stepGoal = 10000;
  const stepProgress = Math.min((health?.steps ?? steps) / stepGoal, 1);
  const waterProgress = Math.min((health?.waterIntake ?? waterIntake) / waterGoal, 1);

  const weekSteps = useMemo(() => {
    if (weekly?.length) return weekly.slice(-7).map((item) => item.steps || item.distance || 0);
    if (stats?.weekly_activity?.length) return stats.weekly_activity.slice(-7).map((item: any) => item.steps);
    return [5234, 7890, 10234, 8567, 6432, health?.steps ?? steps, 0];
  }, [weekly, stats, health, steps]);

  const weekWater = useMemo(() => {
    if (weekly?.length) return weekly.slice(-7).map((item) => item.waterIntake || Math.round((item.steps || 0) * 0.35));
    return [1800, 2100, 1650, 2300, 1950, health?.waterIntake ?? waterIntake, 0];
  }, [weekly, health, waterIntake]);

  const syncStepsMutation = useMutation({
    mutationFn: (amount: number) => api.syncSteps({ date: todayISO(), steps: amount }),
    onSuccess: () => {
      setSteps((current) => current + 250);
      queryClient.invalidateQueries({ queryKey: ['web-health-data'] });
    },
  });

  const logWaterMutation = useMutation({
    mutationFn: (amount: number) => api.logWater({ date: todayISO(), amount }),
    onSuccess: (_, amount) => {
      setWaterIntake((current) => current + amount);
      queryClient.invalidateQueries({ queryKey: ['web-health-data'] });
    },
  });

  const handleGoalPress = () => {
    const value = window.prompt('Enter your daily water intake goal in ml', String(waterGoal));
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) setWaterGoal(parsed);
  };

  const maxValue = useMemo(() => Math.max(...weekSteps, 1), [weekSteps]);
  const maxWater = useMemo(() => Math.max(...weekWater, waterGoal, 1), [weekWater, waterGoal]);

  return (
    <div className="p-6 lg:p-10 space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-cyan-300 font-black uppercase tracking-[0.35em] text-xs mb-3">Health dashboard</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">Track Your Daily Activity</h1>
          <p className="text-slate-400 font-medium mt-3 max-w-2xl">Steps, water, calories, and activity minutes feed directly into your competition score.</p>
        </div>
        <button className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all">
          <Settings size={18} className="inline mr-2" /> Preferences
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => setActiveTab('steps')} className={`p-6 rounded-[2rem] border transition-all text-left ${activeTab === 'steps' ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-emerald-500/30' : 'glass border-white/5 hover:border-white/10'}`}>
          <Footprints size={28} className={activeTab === 'steps' ? 'text-emerald-300' : 'text-slate-400'} />
          <div className="mt-4 text-xl font-black text-white">Steps</div>
          <div className="text-sm text-slate-400 mt-1">Sync movement and hit your daily target.</div>
        </button>
        <button onClick={() => setActiveTab('water')} className={`p-6 rounded-[2rem] border transition-all text-left ${activeTab === 'water' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border-cyan-500/30' : 'glass border-white/5 hover:border-white/10'}`}>
          <Droplet size={28} className={activeTab === 'water' ? 'text-cyan-300' : 'text-slate-400'} />
          <div className="mt-4 text-xl font-black text-white">Water</div>
          <div className="text-sm text-slate-400 mt-1">Log hydration and maintain recovery goals.</div>
        </button>
      </div>

      {activeTab === 'steps' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-300"><Footprints size={30} /></div>
                <div>
                  <div className="text-3xl font-black text-white">{(health?.steps ?? steps).toLocaleString()}</div>
                  <div className="text-sm text-slate-400 font-bold mt-1">Steps Today</div>
                </div>
              </div>
              <div className="w-full md:w-80">
                <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                  <span>Goal Progress</span>
                  <span>{Math.round(stepProgress * 100)}%</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" style={{ width: `${stepProgress * 100}%` }} />
                </div>
                <div className="text-xs text-slate-500 font-bold mt-2">{(health?.steps ?? steps).toLocaleString()} / {stepGoal.toLocaleString()} goal</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-black text-white">Weekly Activity</h2>
                <button onClick={() => queryClient.invalidateQueries({ queryKey: ['web-weekly-activity'] })} className="text-slate-400 hover:text-white"><RefreshCcw size={18} /></button>
              </div>
              <div className="h-64 flex items-end gap-3">
                {weekSteps.map((value, index) => {
                  const height = Math.max(8, Math.round((value / maxValue) * 100));
                  const isToday = index === weekSteps.length - 1;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className="w-full max-w-10 rounded-t-2xl overflow-hidden bg-slate-900" style={{ height: '190px' }}>
                        <div className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-500 to-cyan-300" style={{ height: `${height}%` }} />
                      </div>
                      <div className={`mt-3 text-xs font-black ${isToday ? 'text-emerald-300' : 'text-slate-500'}`}>{labels[index]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[250, 500, 1000, 2000].map((amount) => (
                <button key={amount} onClick={() => syncStepsMutation.mutate(amount)} disabled={syncStepsMutation.isPending} className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-50 transition-all">
                  +{amount.toLocaleString()} steps
                </button>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <motion.div className="glass rounded-[2rem] border border-white/5 p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 text-orange-300 mb-4"><Flame size={22} /><span className="font-black uppercase tracking-widest text-xs">Calories Burned</span></div>
              <div className="text-3xl font-black text-white">450</div>
              <div className="text-sm text-slate-400 font-bold mt-2">kcal estimated today</div>
            </motion.div>
            <motion.div className="glass rounded-[2rem] border border-white/5 p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <div className="flex items-center gap-3 text-cyan-300 mb-4"><TrendingUp size={22} /><span className="font-black uppercase tracking-widest text-xs">Activity Minutes</span></div>
              <div className="text-3xl font-black text-white">68</div>
              <div className="text-sm text-slate-400 font-bold mt-2">minutes logged today</div>
            </motion.div>
            <motion.div className="glass rounded-[2rem] border border-white/5 p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
              <div className="flex items-center gap-3 text-purple-300 mb-4"><Calendar size={22} /><span className="font-black uppercase tracking-widest text-xs">This Week</span></div>
              <div className="text-2xl font-black text-white">{weekSteps.reduce((sum, value) => sum + value, 0).toLocaleString()}</div>
              <div className="text-sm text-slate-400 font-bold mt-2">total steps across seven days</div>
            </motion.div>
          </aside>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-300"><Droplet size={30} /></div>
                <div>
                  <div className="text-3xl font-black text-white">{(health?.waterIntake ?? waterIntake).toLocaleString()}</div>
                  <div className="text-sm text-slate-400 font-bold mt-1">ml Water Today</div>
                </div>
              </div>
              <div className="w-full md:w-80">
                <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                  <span>Goal Progress</span>
                  <span>{Math.round(waterProgress * 100)}%</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" style={{ width: `${waterProgress * 100}%` }} />
                </div>
                <div className="text-xs text-slate-500 font-bold mt-2">{(health?.waterIntake ?? waterIntake).toLocaleString()} / {waterGoal.toLocaleString()}ml goal</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-black text-white">Weekly Hydration</h2>
                <button onClick={handleGoalPress} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-black">Set Goal</button>
              </div>
              <div className="h-64 flex items-end gap-3">
                {weekWater.map((value, index) => {
                  const height = Math.max(8, Math.round((value / maxWater) * 100));
                  const isToday = index === weekWater.length - 1;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className="w-full max-w-10 rounded-t-2xl overflow-hidden bg-slate-900" style={{ height: '190px' }}>
                        <div className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-500 to-blue-300" style={{ height: `${height}%` }} />
                      </div>
                      <div className={`mt-3 text-xs font-black ${isToday ? 'text-cyan-300' : 'text-slate-500'}`}>{labels[index]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[250, 500, 750, 1000].map((amount) => (
                <button key={amount} onClick={() => logWaterMutation.mutate(amount)} disabled={logWaterMutation.isPending} className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-cyan-400 hover:text-slate-950 disabled:opacity-50 transition-all">
                  <Plus size={18} className="inline mr-2" />{amount}ml
                </button>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <motion.div className="glass rounded-[2rem] border border-white/5 p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 text-emerald-300 mb-4"><Target size={22} /><span className="font-black uppercase tracking-widest text-xs">Recovery Score</span></div>
              <div className="text-3xl font-black text-white">82%</div>
              <div className="text-sm text-slate-400 font-bold mt-2">hydration and activity balance</div>
            </motion.div>
            <motion.div className="glass rounded-[2rem] border border-white/5 p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <div className="flex items-center gap-3 text-amber-300 mb-4"><Flame size={22} /><span className="font-black uppercase tracking-widest text-xs">Burn Rate</span></div>
              <div className="text-3xl font-black text-white">6.6</div>
              <div className="text-sm text-slate-400 font-bold mt-2">kcal per minute average</div>
            </motion.div>
            <motion.div className="glass rounded-[2rem] border border-white/5 p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
              <div className="flex items-center gap-3 text-purple-300 mb-4"><Calendar size={22} /><span className="font-black uppercase tracking-widest text-xs">Best Day</span></div>
              <div className="text-2xl font-black text-white">{Math.max(...weekWater).toLocaleString()}ml</div>
              <div className="text-sm text-slate-400 font-bold mt-2">highest water intake this week</div>
            </motion.div>
          </aside>
        </div>
      )}
    </div>
  );
};
