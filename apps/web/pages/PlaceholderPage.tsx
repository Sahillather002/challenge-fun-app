
import React from 'react';
import { motion as motionBase } from 'framer-motion';

const motion = motionBase as any;

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto space-y-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 rounded-[2.5rem] btn-gradient flex items-center justify-center shadow-2xl text-white mb-4"
      >
        {icon}
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-4xl font-black mb-4">{title}</h1>
        <p className="text-slate-400 text-lg font-medium leading-relaxed">{description}</p>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-8 grid grid-cols-2 gap-4 w-full"
      >
        <div className="glass p-6 rounded-3xl border border-white/5">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</div>
          <div className="text-blue-400 font-bold">Deploying to Edge</div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Access Tier</div>
          <div className="text-emerald-400 font-bold">Enterprise Early</div>
        </div>
      </motion.div>
    </div>
  );
};
