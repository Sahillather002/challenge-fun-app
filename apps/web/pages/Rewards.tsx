
import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { Coins, Gift, ShoppingBag, Crown, Dumbbell, Watch, CheckCircle2, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { unwrapData, formatCurrency } from '../lib/apiHelpers';
import { fallbackRewards, type RewardItem } from '../lib/healthData';

const motion = motionBase as any;

const iconMap: Record<string, React.ElementType> = {
  Gift,
  ShoppingBag,
  Crown,
  Dumbbell,
  Watch,
  Coins
};

export const Rewards: React.FC = () => {
  const { data: profileResponse } = useQuery({
    queryKey: ['web-profile'],
    queryFn: () => api.getProfile().catch(() => null),
  });

  const profile = unwrapData<any>(profileResponse);
  const points = profile?.coins ?? profile?.points ?? 2450;
  const rewards: RewardItem[] = fallbackRewards;

  return (
    <div className="p-6 lg:p-10 space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-amber-300 font-black uppercase tracking-[0.35em] text-xs mb-3">Rewards store</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">Redeem Your Wins</h1>
          <p className="text-slate-400 font-medium mt-3 max-w-2xl">Turn competition points into fitness rewards, vouchers, memberships, and cash prizes.</p>
        </div>
        <div className="px-6 py-4 rounded-[2rem] bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950">
          <div className="flex items-center gap-3">
            <Coins size={28} />
            <div>
              <div className="text-2xl font-black">{points.toLocaleString()}</div>
              <div className="text-sm font-black uppercase tracking-widest">Points</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="glass rounded-[2.5rem] border border-white/5 p-6 md:p-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white mb-5">How To Earn</h2>
          <div className="space-y-4">
            {[
              { label: 'Win competitions', value: '100-500 pts' },
              { label: 'Complete daily goals', value: '50-100 pts' },
              { label: 'Maintain streaks', value: '25 pts/day' },
              { label: 'Refer friends', value: '200 pts/referral' }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="font-bold text-slate-300">{item.label}</span>
                <span className="text-sm font-black text-emerald-300">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="lg:col-span-2 glass rounded-[2.5rem] border border-white/5 p-6 md:p-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white">Available Rewards</h2>
            <div className="text-sm font-bold text-slate-400">{rewards.filter((reward) => reward.available).length} available</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rewards.map((reward, index) => {
              const Icon = iconMap[reward.icon] || Gift;
              const canRedeem = reward.available && points >= reward.points;
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`p-6 rounded-[1.5rem] border ${reward.available ? 'bg-white/5 border-white/5' : 'bg-slate-900/30 border-white/5 opacity-60'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center">
                      <Icon size={26} />
                    </div>
                    {canRedeem ? <CheckCircle2 className="text-emerald-300" /> : <Lock className="text-slate-500" />}
                  </div>
                  <h3 className="text-xl font-black text-white mt-5">{reward.name}</h3>
                  <div className="flex items-center gap-2 text-amber-300 mt-3 font-black">
                    <Coins size={18} />
                    {reward.points.toLocaleString()} points
                  </div>
                  <button
                    disabled={!canRedeem}
                    className="mt-5 w-full py-4 rounded-2xl font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={canRedeem ? { background: 'linear-gradient(to right,#34d399,#22d3ee)', color: '#052e2b' } : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}
                  >
                    {reward.available ? (points < reward.points ? 'Not Enough Points' : 'Redeem Now') : 'Locked'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <section className="glass rounded-[2.5rem] border border-white/5 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'Next Voucher', value: formatCurrency(25), sub: 'Reach 2,500 points' },
            { label: 'Premium Trial', value: '1 Month', sub: '1,500 points required' },
            { label: 'Cash Prize Pool', value: formatCurrency(100), sub: '15,000 points required' }
          ].map((item) => (
            <div key={item.label} className="p-6 rounded-[1.5rem] bg-slate-900/40 border border-white/5">
              <div className="text-sm text-slate-500 font-black uppercase tracking-widest">{item.label}</div>
              <div className="text-3xl font-black text-white mt-3">{item.value}</div>
              <div className="text-sm text-slate-400 mt-2">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
