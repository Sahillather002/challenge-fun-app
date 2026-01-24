'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Footprints, Flame, TrendingUp, Calendar, Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActivityPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);

  // Mock real-time step tracking
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setSteps((prev) => prev + Math.floor(Math.random() * 10));
        setDistance((prev) => prev + Math.random() * 0.01);
        setCalories((prev) => prev + Math.random() * 0.5);
        setActiveMinutes((prev) => prev + 0.1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const handleStartStop = () => {
    setIsTracking(!isTracking);
  };

  const handleReset = () => {
    setSteps(0);
    setDistance(0);
    setCalories(0);
    setActiveMinutes(0);
    setIsTracking(false);
  };

  const weeklyData = [
    { day: 'Mon', steps: 8234, calories: 412 },
    { day: 'Tue', steps: 10521, calories: 526 },
    { day: 'Wed', steps: 9876, calories: 494 },
    { day: 'Thu', steps: 12340, calories: 617 },
    { day: 'Fri', steps: 7654, calories: 383 },
    { day: 'Sat', steps: 15230, calories: 762 },
    { day: 'Sun', steps: 11234, calories: 562 },
  ];

  const recentActivities = [
    { id: 1, type: 'walk', title: 'Morning Walk', steps: 5234, duration: '45 min', time: '2 hours ago' },
    { id: 2, type: 'run', title: 'Evening Run', steps: 8912, duration: '60 min', time: '5 hours ago' },
    { id: 3, type: 'walk', title: 'Lunch Break Walk', steps: 2134, duration: '20 min', time: '1 day ago' },
    { id: 4, type: 'cycle', title: 'Bike Ride', steps: 0, duration: '90 min', time: '2 days ago' },
  ];

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-black tracking-tight uppercase mb-2 text-white">Biometric Telemetry</h1>
        <p className="text-slate-500 font-bold">Real-time neural tracking of kinetic energy and metabolic output</p>
      </header>

      {/* Live Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-[3.5rem] border border-white/5 bg-slate-900/40 relative overflow-hidden group shadow-2xl"
      >
        <div className={`absolute inset-0 bg-gradient-to-tr ${isTracking ? 'from-blue-500/20' : 'from-slate-500/10'} via-transparent to-purple-500/10 pointer-events-none transition-colors duration-1000`} />

        <div className="relative z-10 space-y-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-white/10 mb-4 backdrop-blur-xl">
            <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
            <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${isTracking ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isTracking ? 'Data sync active' : 'Signal disconnected'}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Kinetic Link (Steps)', val: steps.toLocaleString(), icon: <Footprints size={24} className="text-blue-400" /> },
              { label: 'Spatial Vector (KM)', val: distance.toFixed(2), icon: <TrendingUp size={24} className="text-purple-400" /> },
              { label: 'Thermal Loss (Cal)', val: Math.floor(calories), icon: <Flame size={24} className="text-orange-400" /> },
              { label: 'Temporal sync (Min)', val: Math.floor(activeMinutes), icon: <Calendar size={24} className="text-emerald-400" /> },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="p-4 glass rounded-2xl mb-4 text-blue-400 shadow-inner group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <motion.p
                  key={stat.val}
                  initial={{ scale: 1.1, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-black text-white tracking-tighter"
                >
                  {stat.val}
                </motion.p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 justify-center pt-8">
            <Button
              onClick={handleStartStop}
              className={`h-16 px-12 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95 ${isTracking
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 flex gap-4'
                  : 'btn-gradient text-white flex gap-4'
                }`}
            >
              {isTracking ? <Pause size={18} /> : <Play size={18} />}
              {isTracking ? 'Stop uplink' : 'Initialize sync'}
            </Button>
            <button
              onClick={handleReset}
              type="button"
              className="w-16 h-16 rounded-[2rem] glass flex items-center justify-center text-slate-500 hover:text-white transition-colors border border-white/10 hover:border-white/20"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Today's Goals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-10 rounded-[3rem] border border-white/5 bg-slate-900/20"
        >
          <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-400 mb-10 text-center">Neural Threshold Objectives</h3>

          <div className="space-y-10">
            {[
              { label: 'Kinetic Threshold (Steps)', current: steps + 5234, target: 10000, color: 'from-blue-500 to-purple-500' },
              { label: 'Metabolic Threshold (Cal)', current: Math.floor(calories + 234), target: 500, color: 'from-orange-500 to-red-600' },
              { label: 'Temporal Threshold (Min)', current: Math.floor(activeMinutes + 28), target: 60, color: 'from-emerald-500 to-blue-600' },
            ].map((goal, i) => (
              <div key={i}>
                <div className="flex items-end justify-between mb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-bold">{goal.label}</span>
                  <span className="text-xl font-black text-white">{goal.current.toLocaleString()} <span className="text-slate-700 text-xs">/ {goal.target}</span></span>
                </div>
                <div className="h-4 bg-slate-900/60 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${goal.color} relative`}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:40px_40px] animate-[shimmer_2s_linear_infinite]" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-10 rounded-[3rem] border border-white/5 bg-slate-900/20"
        >
          <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-purple-400 mb-10 text-center">Historical Node Performance</h3>

          <div className="h-[280px] flex items-end justify-between gap-4 px-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
                <div className="flex-1 w-full flex flex-col justify-end gap-1.5 relative mb-4">
                  {/* Steps bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.steps / 16000) * 100}%` }}
                    className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-xl group-hover:brightness-125 transition-all cursor-pointer relative shadow-lg"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-lg text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-2xl pointer-events-none z-20">
                      {day.steps.toLocaleString()}
                    </div>
                  </motion.div>
                  {/* Calories bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.calories / 800) * 100}%` }}
                    className="w-full bg-gradient-to-t from-orange-500 to-red-600 rounded-t-xl group-hover:brightness-125 transition-all cursor-pointer shadow-lg"
                  />
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">
                  {day.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kinetic signal</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-md bg-gradient-to-r from-orange-500 to-red-600 shadow-lg" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thermal dissipation</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 rounded-[3rem] border border-white/5 bg-slate-900/20"
      >
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Verification History</h2>
          <div className="h-px bg-white/5 flex-1" />
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform ${activity.type === 'walk' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    activity.type === 'run' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                  {activity.type === 'walk' ? '🚶' : activity.type === 'run' ? '🏃' : '🚴'}
                </div>
                <div>
                  <p className="text-xl font-black uppercase tracking-tighter text-white transition-colors group-hover:text-blue-400">{activity.title}</p>
                  <div className="flex items-center gap-6 mt-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Footprints size={12} className="text-blue-500" />
                      <span>{activity.steps > 0 ? `${activity.steps.toLocaleString()} Signals` : 'Kinetic Stream'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Calendar size={12} className="text-purple-500" />
                      <span>{activity.duration} Duration</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{activity.time}</p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                  Verified
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
