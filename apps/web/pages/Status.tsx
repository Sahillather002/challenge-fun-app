
import React, { useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Clock, Server, Globe, Zap, BarChart2, Send, ShieldAlert, Plus } from 'lucide-react';

const motion = motionBase as any;

const systems = [
  { name: 'Global API Gateway', status: 'Operational', latency: '24ms', uptime: '100%' },
  { name: 'Inference Engine (Gen-3)', status: 'Operational', latency: '142ms', uptime: '99.99%' },
  { name: 'Video Synthesis Cluster', status: 'Warning', latency: '4.2s', uptime: '98.5%' },
  { name: 'Object Storage (Media)', status: 'Operational', latency: '45ms', uptime: '100%' },
  { name: 'User Authentication', status: 'Operational', latency: '12ms', uptime: '99.99%' },
  { name: 'Google Maps Bridge', status: 'Operational', latency: '210ms', uptime: '100%' },
];

export const Status: React.FC = () => {
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    service: 'Global API Gateway',
    severity: 'Low'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setReportForm({ title: '', description: '', service: 'Global API Gateway', severity: 'Low' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black mb-4">System Status</h1>
          <div className="flex items-center gap-3 text-green-400 font-bold bg-green-400/10 border border-green-400/20 px-4 py-2 rounded-full w-fit">
            <CheckCircle2 size={20} />
            All Critical Systems Operational
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-1">Last Updated</div>
          <div className="text-slate-200 font-mono">2024-05-24 14:32:01 UTC</div>
        </div>
      </header>

      {/* Latency Map Visualization Mock */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden h-64 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative text-center space-y-4">
           <Globe size={48} className="mx-auto text-blue-500 animate-pulse" />
           <p className="text-slate-400 font-medium">Traffic distributed across 12 edge regions</p>
           <div className="flex gap-4 justify-center">
              {[8, 12, 10, 15, 9, 7, 11].map((h, i) => (
                <div key={i} className="w-2 bg-blue-500/20 rounded-full h-8 relative">
                   <div className="absolute bottom-0 w-full bg-blue-500 rounded-full" style={{ height: `${h * 10}%` }}></div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systems.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${s.status === 'Operational' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {s.status === 'Operational' ? <Server size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <div className="font-bold text-lg">{s.name}</div>
                <div className="text-slate-500 text-sm">{s.status}</div>
              </div>
            </div>
            <div className="text-right">
               <div className="text-slate-200 font-bold">{s.latency}</div>
               <div className="text-xs text-slate-500">{s.uptime} uptime</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Incidents Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden h-fit">
          <div className="p-8 border-b border-white/10 bg-white/5">
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Clock size={20} className="text-slate-500" />
               Recent Activity
             </h3>
          </div>
          <div className="p-8 space-y-8">
             <div className="flex gap-6">
                <div className="text-slate-500 font-mono text-sm whitespace-nowrap">10:12 AM</div>
                <div>
                  <div className="font-bold text-yellow-400 mb-1">Video Synthesis Degradation</div>
                  <p className="text-slate-400 text-sm leading-relaxed">High demand for Veo 3.1 generations causing temporary increases in processing latency. Clusters in US-CENTRAL are scaling.</p>
                </div>
             </div>
             <div className="flex gap-6">
                <div className="text-slate-500 font-mono text-sm whitespace-nowrap">08:00 AM</div>
                <div className="flex items-center gap-3">
                   <CheckCircle2 size={16} className="text-green-500" />
                   <span className="text-slate-300 font-medium">No other incidents reported.</span>
                </div>
             </div>
          </div>
        </div>

        {/* Report Incident Form */}
        <div className="glass rounded-[2.5rem] border border-white/10 overflow-hidden">
          <div className="p-8 border-b border-white/10 bg-white/5 flex items-center justify-between">
             <h3 className="text-xl font-bold flex items-center gap-2">
               <ShieldAlert size={20} className="text-red-400" />
               Report Incident
             </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Incident Title</label>
              <input 
                required
                type="text"
                placeholder="e.g., Timeout in US-EAST-1"
                value={reportForm.title}
                onChange={e => setReportForm({...reportForm, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Affected Service</label>
                <select 
                  value={reportForm.service}
                  onChange={e => setReportForm({...reportForm, service: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-all font-medium appearance-none"
                >
                  {systems.map(s => <option key={s.name} value={s.name} className="bg-slate-900">{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Severity</label>
                <select 
                  value={reportForm.severity}
                  onChange={e => setReportForm({...reportForm, severity: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-all font-medium appearance-none"
                >
                  <option value="Low" className="bg-slate-900">Low</option>
                  <option value="Medium" className="bg-slate-900">Medium</option>
                  <option value="High" className="bg-slate-900">High</option>
                  <option value="Critical" className="bg-slate-900 text-red-400 font-bold">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
              <textarea 
                required
                rows={3}
                placeholder="Provide details about the issue..."
                value={reportForm.description}
                onChange={e => setReportForm({...reportForm, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-all font-medium resize-none"
              />
            </div>

            <button 
              disabled={isSubmitting || submitted}
              type="submit"
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${submitted ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'btn-gradient text-white hover:scale-[1.02]'}`}
            >
              {isSubmitting ? <><Zap className="animate-spin" /> Submitting...</> : submitted ? <><CheckCircle2 /> Report Submitted</> : <><Send size={18} /> Submit Incident Report</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
