
import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { Check, Zap, Sparkles, Building, ArrowRight, CreditCard } from 'lucide-react';

const motion = motionBase as any;

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for local development and initial testing.',
    features: ['100k Monthly Tokens', '5 Images per Day', 'Standard Latency', 'Community Support'],
    icon: <Zap className="text-slate-400"/>,
    current: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'The industry standard for small-scale production deployments.',
    features: ['5M Monthly Tokens', 'Unlimited Images', 'Priority Inference', 'Email Support', 'Advanced Analytics'],
    icon: <Sparkles className="text-blue-400"/>,
    current: true,
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Dedicated infrastructure and unlimited compute bandwidth.',
    features: ['Custom Token Allocation', 'Veo Video Generation', 'Self-hosting Options', 'SLA Guarantees', 'Dedicated Engineer'],
    icon: <Building className="text-purple-400"/>,
    current: false
  }
];

export const Pricing: React.FC = () => {
  return (
    <div className="p-8 space-y-16 pb-32 max-w-7xl mx-auto">
      <header className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">PREDICTABLE PRICING FOR <span className="text-gradient">INFINITE SCALE</span></h1>
        <p className="text-slate-400 text-xl font-medium leading-relaxed italic">Simple token-based pricing that scales with your intelligence needs.</p>
      </header>

      {/* Current Usage Card */}
      <div className="glass p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="relative flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <CreditCard className="text-blue-500" />
              <h2 className="text-2xl font-black">Current Cycle Usage</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-black uppercase tracking-widest text-slate-500">
                <span>Tokens Consumed</span>
                <span>84% of 5M</span>
              </div>
              <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-1">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '84%' }} 
                  className="h-full btn-gradient rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">You have <span className="text-white font-bold">784,021</span> tokens remaining. Billing resets on June 1st.</p>
          </div>
          <button className="px-10 py-5 glass rounded-[2rem] border border-white/10 font-black hover:bg-white/5 transition-all text-lg">
            Manage Subscription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`
              glass rounded-[3rem] p-10 flex flex-col h-full border relative transition-all duration-500
              ${tier.highlight ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.1)] scale-105 z-10' : 'border-white/5 hover:border-white/10'}
            `}
          >
            {tier.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 btn-gradient text-[10px] font-black text-white rounded-full uppercase tracking-widest">Recommended</div>
            )}
            <div className="flex items-center justify-between mb-8">
              <div className="p-4 glass rounded-[1.5rem] bg-white/5">{tier.icon}</div>
              {tier.current && (
                <div className="text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Current Plan
                </div>
              )}
            </div>
            <h3 className="text-3xl font-black mb-2">{tier.name}</h3>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{tier.description}</p>
            <div className="flex items-baseline gap-1 mb-10">
              <span className="text-5xl font-black tracking-tighter">{tier.price}</span>
              {tier.period && <span className="text-slate-500 font-bold">{tier.period}</span>}
            </div>
            <ul className="space-y-4 mb-12 flex-1">
              {tier.features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                  <div className="p-1 glass rounded-full text-blue-500"><Check size={12}/></div>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-5 rounded-2xl font-black transition-all ${tier.highlight ? 'btn-gradient text-white' : 'glass border border-white/10 hover:bg-white/5'}`}>
              {tier.current ? 'Manage Billing' : tier.price === 'Custom' ? 'Contact Sales' : 'Upgrade Now'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
