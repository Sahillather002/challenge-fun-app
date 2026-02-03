
import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, DollarSign, CheckCircle } from 'lucide-react';

const motion = motionBase as any;

const data = [
  { name: 'Mon', req: 4200, lat: 140 },
  { name: 'Tue', req: 3800, lat: 125 },
  { name: 'Wed', req: 5600, lat: 160 },
  { name: 'Thu', req: 4900, lat: 145 },
  { name: 'Fri', req: 6200, lat: 170 },
  { name: 'Sat', req: 5100, lat: 130 },
  { name: 'Sun', req: 4500, lat: 120 },
];

const pieData = [
  { name: 'Gemini 3 Flash', value: 55, color: '#3b82f6' },
  { name: 'Gemini 3 Pro', value: 35, color: '#8b5cf6' },
  { name: 'Veo Engine', value: 10, color: '#f59e0b' },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="p-8 lg:p-12 space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2">OmniGen Hub</h1>
          <p className="text-slate-500 font-bold">Real-time distributed fabric telemetry</p>
        </div>
        <div className="flex gap-4">
          <select className="glass rounded-2xl px-6 py-3 text-sm font-black uppercase tracking-widest outline-none border-white/10 focus:border-blue-500/50 bg-slate-900/50">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Peak Cycle</option>
          </select>
          <button className="btn-gradient px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-500/20">
            Refresh Fabric
          </button>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Inference Load', val: '24.1K', change: '+18%', up: true, icon: <Activity className="text-blue-400" /> },
          { label: 'Edge Latency', val: '142ms', change: '-12%', up: true, icon: <Clock className="text-purple-400" /> },
          { label: 'Token Efficiency', val: '99.4%', change: '+0.4%', up: true, icon: <DollarSign className="text-emerald-400" /> },
          { label: 'Fabric Uptime', val: '100%', change: 'Stable', up: true, icon: <CheckCircle className="text-amber-400" /> },
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/20 group hover:border-white/10 transition-all shadow-xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 glass rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${card.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {card.up && card.change !== 'Stable' ? <TrendingUp size={14} /> : null}
                {card.change}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{card.label}</div>
            <div className="text-4xl font-black tracking-tighter text-white">{card.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] border border-white/5 bg-slate-900/20">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black uppercase tracking-tight">Throughput Analysis</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global Req</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="req" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReq)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border border-white/5 bg-slate-900/20 flex flex-col">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-10 text-center">Compute Load</h3>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-white">90%</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</span>
            </div>
          </div>
          <div className="space-y-4 mt-8">
             {pieData.map((p, i) => (
               <div key={i} className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }}></div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{p.name}</span>
                  </div>
                  <span className="font-black text-white">{p.value}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass rounded-[3rem] border border-white/5 overflow-hidden bg-slate-900/20">
        <div className="p-10 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-2xl font-black uppercase tracking-tight">Real-Time Synthesis Stream</h3>
          <button className="text-xs text-blue-400 font-black uppercase tracking-widest hover:underline flex items-center gap-2">
            View Live Logs <TrendingUp size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 border-b border-white/5 text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">Epoch</th>
                <th className="px-10 py-6">Intelligence Engine</th>
                <th className="px-10 py-6">Inference Time</th>
                <th className="px-10 py-6">Token Payload</th>
                <th className="px-10 py-6 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {[
                { time: '14s ago', model: 'Gemini 3 Flash', latency: '142ms', tokens: 2840, status: 'Verified' },
                { time: '42s ago', model: 'Gemini 3 Pro', latency: '385ms', tokens: 120, status: 'Verified' },
                { time: '2m ago', model: 'Veo Cine-3', latency: '8.4s', tokens: 30000, status: 'Verified' },
                { time: '5m ago', model: 'Gemini 3 Flash', latency: '156ms', tokens: 940, status: 'Warning' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                  <td className="px-10 py-6 font-mono text-xs text-slate-500">{row.time}</td>
                  <td className="px-10 py-6 font-black text-white text-sm">{row.model}</td>
                  <td className="px-10 py-6 text-slate-400 font-bold">{row.latency}</td>
                  <td className="px-10 py-6 font-bold">{row.tokens.toLocaleString()} <span className="text-[10px] text-slate-600 ml-1">tks</span></td>
                  <td className="px-10 py-6 text-right">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl ${row.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
