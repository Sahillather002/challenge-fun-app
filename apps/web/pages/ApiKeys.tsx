
import React, { useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, CheckCircle, Shield, Activity, Search, RefreshCw } from 'lucide-react';

const motion = motionBase as any;

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  usage: number;
}

export const ApiKeys: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: '1', name: 'Production_Main', key: 'og_live_492...8a2', created: '2024-05-10', lastUsed: '2 mins ago', usage: 1245000 },
    { id: '2', name: 'Staging_Dev', key: 'og_test_102...f42', created: '2024-05-15', lastUsed: '3 days ago', usage: 45000 }
  ]);
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 space-y-8 pb-24 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">API Management</h1>
          <p className="text-slate-500 font-medium">Secure access tokens for your autonomous agent deployments</p>
        </div>
        <button className="btn-gradient px-8 py-4 rounded-2xl text-white font-black flex items-center gap-3 shadow-xl shadow-blue-500/20">
          <Plus size={20} /> Generate New Key
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Keys', val: '2', icon: <Key className="text-blue-400"/> },
          { label: 'Global Quota', val: '12.4%', icon: <Shield className="text-purple-400"/> },
          { label: 'Total Calls (MTD)', val: '1.29M', icon: <Activity className="text-emerald-400"/> },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-6">
            <div className="p-4 glass rounded-2xl">{stat.icon}</div>
            <div>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black text-white">{stat.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold">Your API Keys</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              placeholder="Search keys..." 
              className="bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 border-b border-white/5 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-6">Key Name</th>
                <th className="px-8 py-6">API Key</th>
                <th className="px-8 py-6">Created</th>
                <th className="px-8 py-6">Usage (Tokens)</th>
                <th className="px-8 py-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200">{key.name}</span>
                      <span className="text-[10px] text-slate-500">Last used: {key.lastUsed}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs">
                    <div className="flex items-center gap-2 px-3 py-2 glass rounded-lg border border-white/5 w-fit">
                      {showKeyId === key.id ? key.key : '••••••••••••••••••••••••'}
                      <button onClick={() => setShowKeyId(showKeyId === key.id ? null : key.id)} className="ml-2 text-slate-500 hover:text-white">
                        {showKeyId === key.id ? <EyeOff size={14}/> : <Eye size={14}/>}
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-400 text-sm">{key.created}</td>
                  <td className="px-8 py-6 font-bold text-slate-200">
                    {(key.usage / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => copyToClipboard(key.id, key.key)} 
                        className={`p-2 glass rounded-lg transition-all ${copiedId === key.id ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-slate-500 hover:text-white'}`}
                      >
                        {copiedId === key.id ? <CheckCircle size={18}/> : <Copy size={18}/>}
                      </button>
                      <button className="p-2 glass rounded-lg text-slate-500 hover:text-red-400 transition-all">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-8 glass rounded-[2.5rem] border border-blue-500/10 bg-blue-500/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="p-4 glass rounded-3xl text-blue-400">
            {/* Fix: Changed RefreshCcw to RefreshCw as per the import at the top of the file */}
            <RefreshCw size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold">Automatic Rotation</h4>
            <p className="text-slate-400 text-sm">Enable automatic key rotation every 90 days for enhanced platform security.</p>
          </div>
        </div>
        <button className="px-6 py-3 glass border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all">
          Enable Security Guard
        </button>
      </div>
    </div>
  );
};
