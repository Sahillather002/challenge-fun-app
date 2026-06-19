
import React, { useMemo, useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { User, Shield, Bell, Users, Share2, Award, BarChart3, Edit, LogOut, Camera, MessageSquare, ChevronRight, Zap, Target, Trophy, Upload } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData } from '../lib/apiHelpers';

const motion = motionBase as any;

export const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', email: '' });

  const { data: profileResponse } = useQuery({
    queryKey: ['web-profile'],
    queryFn: () => api.getProfile().catch(() => null),
  });

  const { data: statsResponse } = useQuery({
    queryKey: ['web-user-stats'],
    queryFn: () => api.getStats().catch(() => null),
  });

  const profile = unwrapData<any>(profileResponse);
  const stats = unwrapData<any>(statsResponse);

  const displayName = profile?.name || profile?.username || 'Fit Fighter';
  const email = profile?.email || 'athlete@fitbattle.app';
  const bio = profile?.bio || 'Competing to stay healthier, stronger, and more consistent every day.';

  React.useEffect(() => {
    setForm({ name: profile?.name || displayName, email, bio });
  }, [profileResponse]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<any>) => api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web-profile'] });
      setEditing(false);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateMutation.mutate(form);
  };

  const initials = displayName.split(' ').map((part: string) => part[0]).join('').slice(0, 2).toUpperCase();

  const statCards = [
    { label: 'Total Wins', value: profile?.wins ?? 24, icon: <Trophy size={20} /> },
    { label: 'Day Streak', value: profile?.currentStreak ?? 7, icon: <Zap size={20} /> },
    { label: 'Current Rank', value: `#${profile?.rank ?? stats?.best_rank ?? 47}`, icon: <Target size={20} /> }
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8 pb-24">
      <section className="relative rounded-[3rem] overflow-hidden border border-white/5 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-fuchsia-500/10 p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 p-[3px]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-2xl font-black text-white">
                {initials}
              </div>
            </div>
            <button className="absolute bottom-1 right-1 p-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-lg">
              <Camera size={18} />
            </button>
          </div>
          <div className="flex-1">
            <p className="text-emerald-300 font-black uppercase tracking-[0.35em] text-xs mb-3">Athlete profile</p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">{displayName}</h1>
            <p className="text-slate-300 font-medium mt-4 max-w-2xl">{bio}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => setEditing(true)} className="px-5 py-3 rounded-2xl bg-white text-slate-950 font-black flex items-center gap-2"><Edit size={18} /> Edit Profile</button>
              <button className="px-5 py-3 rounded-2xl glass border border-white/10 text-white font-black flex items-center gap-2"><Share2 size={18} /> Share Profile</button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2rem] border border-white/5 p-6">
            <div className="text-emerald-300">{stat.icon}</div>
            <div className="text-2xl font-black text-white mt-4">{stat.value}</div>
            <div className="text-sm text-slate-500 font-black uppercase tracking-widest mt-2">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">Account Management</h2>
            <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-black">Edit Details</button>
          </div>
          <div className="space-y-3">
            <ProfileRow icon={<User size={20} />} title="Display Name" value={displayName} />
            <ProfileRow icon={<MessageSquare size={20} />} title="Bio" value={bio} />
            <ProfileRow icon={<Shield size={20} />} title="Email" value={email} />
            <ProfileRow icon={<Users size={20} />} title="Friends & Squads" value="Manage your active workout circle" />
            <ProfileRow icon={<Award size={20} />} title="Achievement Gallery" value="View badges and milestones" />
            <ProfileRow icon={<Bell size={20} />} title="Notifications" value="Competition alerts enabled" />
          </div>
          <button className="mt-6 w-full md:w-auto px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 font-black flex items-center gap-2"><LogOut size={18} /> Sign Out</button>
        </section>

        <aside className="space-y-5">
          <motion.div className="glass rounded-[2.5rem] border border-white/5 p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 text-cyan-300 mb-4"><BarChart3 size={22} /><span className="font-black uppercase tracking-widest text-xs">Performance</span></div>
            <div className="text-3xl font-black text-white">{stats?.total_steps?.toLocaleString() ?? '7,500'}</div>
            <div className="text-sm text-slate-400 mt-2">total steps recorded</div>
          </motion.div>
          <motion.div className="glass rounded-[2.5rem] border border-white/5 p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <div className="flex items-center gap-3 text-amber-300 mb-4"><Award size={22} /><span className="font-black uppercase tracking-widest text-xs">Level</span></div>
            <div className="text-3xl font-black text-white">12</div>
            <div className="text-sm text-slate-400 mt-2">competition profile level</div>
            <div className="mt-5 h-3 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
            </div>
          </motion.div>
          <motion.div className="glass rounded-[2.5rem] border border-white/5 p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <div className="flex items-center gap-3 text-emerald-300 mb-4"><Target size={22} /><span className="font-black uppercase tracking-widest text-xs">Next Goal</span></div>
            <div className="text-2xl font-black text-white">Win 3 battles</div>
            <div className="text-sm text-slate-400 mt-2">Reward: 300 points</div>
          </motion.div>
        </aside>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl glass rounded-[2.5rem] border border-white/10 p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Edit Profile</h2>
              <button type="button" onClick={() => setEditing(false)} className="text-slate-400 hover:text-white"><Upload size={20} className="rotate-45" /></button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Name</label>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email</label>
              <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Bio</label>
              <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 min-h-32" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setEditing(false)} className="px-5 py-3 rounded-2xl glass border border-white/10 text-white font-black">Cancel</button>
              <button disabled={updateMutation.isPending} className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black disabled:opacity-50">Save Changes</button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
};

function ProfileRow({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-4">
        <div className="text-emerald-300">{icon}</div>
        <div>
          <div className="text-sm text-slate-500 font-black uppercase tracking-widest">{title}</div>
          <div className="text-slate-200 font-bold mt-1">{value}</div>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-500" />
    </div>
  );
}
