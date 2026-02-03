
import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  DollarSign, 
  Activity, 
  Layers,
  Clock,
  ArrowUpRight,
  RefreshCcw,
  Wifi
} from 'lucide-react';

const motion = motionBase as any;

// Simulated fetcher that returns mock data with random noise for visualization
const fetchAnalyticsData = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const noise = () => (Math.random() - 0.5) * 0.1; // +/- 5% noise

  const usageData = [
    { time: '00:00', requests: Math.round(400 * (1 + noise())), cost: 2.4, latency: 120 },
    { time: '04:00', requests: Math.round(300 * (1 + noise())), cost: 1.8, latency: 110 },
    { time: '08:00', requests: Math.round(900 * (1 + noise())), cost: 5.4, latency: 180 },
    { time: '12:00', requests: Math.round(1200 * (1 + noise())), cost: 7.2, latency: 210 },
    { time: '16:00', requests: Math.round(1500 * (1 + noise())), cost: 9.0, latency: 240 },
    { time: '20:00', requests: Math.round(1100 * (1 + noise())), cost: 6.6, latency: 190 },
    { time: '23:59', requests: Math.round(600 * (1 + noise())), cost: 3.6, latency: 140 },
  ];

  const modelDistribution = [
    { name: 'Gemini 3 Pro', usage: 45, color: '#a855f7' },
    { name: 'Gemini 3 Flash', usage: 35, color: '#3b82f6' },
    { name: 'Veo Video', usage: 12, color: '#f59e0b' },
    { name: 'Nano Image', usage: 8, color: '#10b981' },
  ];

  const latencyTrends = [
    { day: 'Mon', p50: 120, p95: 450, p99: 1200 },
    { day: 'Tue', p50: 115, p95: 420, p99: 1150 },
    { day: 'Wed', p50: 130, p95: 510, p99: 1400 },
    { day: 'Thu', p50: 125, p95: 480, p99: 1300 },
    { day: 'Fri', p50: Math.round(140 * (1 + noise())), p95: Math.round(600 * (1 + noise())), p99: 1800 },
    { day: 'Sat', p50: 105, p95: 380, p99: 900 },
    { day: 'Sun', p50: 110, p95: 400, p99: 1000 },
  ];

  const stats = [
    { label: 'Avg Latency', val: `${Math.round(142 * (1 + noise()))}ms`, change: '-12%', icon: <Clock />, color: 'blue' },
    { label: 'Token Efficiency', val: `${(98.4 + noise() * 2).toFixed(1)}%`, change: '+2.1%', icon: <Zap />, color: 'purple' },
    { label: 'Total Cost', val: `$${(1240.45 * (1 + noise())).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, change: '+14%', icon: <DollarSign />, color: 'emerald' },
    { label: 'Error Rate', val: `${(0.002 + Math.abs(noise() * 0.001)).toFixed(3)}%`, change: '-0.5%', icon: <Activity />, color: 'amber' },
  ];

  return { usageData, modelDistribution, latencyTrends, stats };
};

export const Analytics: React.FC = () => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
    refetchInterval: 60000, // Refresh every 60 seconds
  });

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <RefreshCcw className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Calibrating global intelligence data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-black tracking-tight">System Analytics</h1>
            <div className="flex items-center gap-2 px-3 py-1 glass border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Live Feed</span>
            </div>
            {isFetching && !isLoading && (
              <RefreshCcw size={16} className="text-blue-500 animate-spin" />
            )}
          </div>
          <p className="text-slate-500 font-medium">Global intelligence performance metrics • Auto-refresh active</p>
        </div>
        <div className="flex gap-3 bg-slate-900/50 p-1.5 rounded-2xl glass border border-slate-800">
          <button className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 shadow-lg shadow-blue-500/20 transition-all">Daily</button>
          <button className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all">Weekly</button>
          <button className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all">Monthly</button>
          <button onClick={() => refetch()} className="p-2 text-slate-400 hover:text-white transition-all">
            <RefreshCcw size={18} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5 relative group hover:border-blue-500/30 transition-all overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[40px] opacity-10 bg-${stat.color}-500 transition-all group-hover:opacity-20`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 glass rounded-2xl text-${stat.color}-400`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs font-black bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                <TrendingUp size={12} />
                {stat.change}
              </div>
            </div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-black">{stat.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Request Volume Area Chart */}
        <div className="xl:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity size={20} className="text-blue-400" />
              Request Throughput (24h)
            </h3>
            <button className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all">
              <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.usageData}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReq)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Distribution Bar Chart */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Layers size={20} className="text-purple-400" />
            Compute Allocation
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.modelDistribution} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                />
                <Bar dataKey="usage" radius={[0, 10, 10, 0]} barSize={24}>
                  {data?.modelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {data?.modelDistribution.map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }}></div>
                  <span className="text-sm font-medium text-slate-400">{m.name}</span>
                </div>
                <span className="text-sm font-bold">{m.usage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latency Percentiles Composed Chart */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Clock size={20} className="text-emerald-400" />
          Latency Percentiles (ms)
        </h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data?.latencyTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px' }}
              />
              <Legend verticalAlign="top" align="right" height={36} />
              <Bar dataKey="p50" barSize={40} fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.6} />
              <Line type="monotone" dataKey="p95" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} />
              <Line type="monotone" dataKey="p99" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
