
import React, { useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { User, Shield, Bell, Users, Globe, LogOut, CheckCircle2, ChevronRight, Upload } from 'lucide-react';

const motion = motionBase as any;

type SettingsTab = 'Profile' | 'Security' | 'Team' | 'Billing' | 'Advanced';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');

  const menu = [
    { id: 'Profile', icon: <User size={20}/> },
    { id: 'Security', icon: <Shield size={20}/> },
    { id: 'Team', icon: <Users size={20}/> },
    { id: 'Advanced', icon: <Globe size={20}/> },
  ];

  return (
    <div className="p-8 space-y-12 pb-32 max-w-5xl mx-auto">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Platform Settings</h1>
        <p className="text-slate-500">Configure your personal workspace and security protocols</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          {menu.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as SettingsTab)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'btn-gradient text-white shadow-xl shadow-blue-500/20' : 'glass border border-white/5 text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="font-bold text-sm">{item.id}</span>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
          <div className="h-px bg-white/5 my-6" />
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm">
            <LogOut size={20} />
            Sign Out Session
          </button>
        </div>

        {/* Form Area */}
        <div className="flex-1 glass rounded-[3rem] border border-white/10 p-10 space-y-10">
          {activeTab === 'Profile' && (
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full glass border-2 border-white/10 overflow-hidden flex items-center justify-center text-4xl font-black text-slate-500 bg-slate-900 group-hover:border-blue-500 transition-all">
                    AD
                  </div>
                  <button className="absolute bottom-1 right-1 p-2 btn-gradient rounded-xl text-white shadow-xl">
                    <Upload size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-black">Workspace Identity</h3>
                  <p className="text-slate-500 text-sm mb-4">Your avatar is displayed in collaborative threads.</p>
                  <button className="px-6 py-2 glass border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">Remove Photo</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                  <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-slate-200 outline-none focus:border-blue-500/50 transition-all" defaultValue="Alex Drago" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Workspace Email</label>
                  <input className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-slate-200 outline-none focus:border-blue-500/50 transition-all" defaultValue="alex@omnigen.ai" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Organization ID</label>
                  <div className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-slate-500 flex justify-between items-center select-none italic">
                    org_prod_8429_x2
                    <CheckCircle2 size={16} className="text-green-500" />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className="btn-gradient px-10 py-4 rounded-2xl text-white font-black shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-10">
              <section className="space-y-4">
                <h3 className="text-2xl font-black">Authentication Shield</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Protect your compute resources and API credentials with multi-factor verification.</p>
                <div className="p-6 glass border border-white/5 rounded-3xl flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="p-3 glass rounded-2xl text-blue-400"><Shield size={24}/></div>
                    <div>
                      <div className="font-bold">Two-Factor Authentication</div>
                      <div className="text-xs text-slate-500">Standard for enterprise accounts</div>
                    </div>
                  </div>
                  <button className="px-6 py-2 glass border border-green-500/20 text-green-400 font-bold rounded-xl text-xs uppercase tracking-widest">Enabled</button>
                </div>
              </section>

              <section className="space-y-4">
                 <h3 className="text-xl font-bold">Active Sessions</h3>
                 <div className="space-y-2">
                   {[
                     { os: 'macOS Sonoma', browser: 'Chrome', loc: 'San Francisco, US', active: true },
                     { os: 'iOS 17', browser: 'Safari', loc: 'Berlin, DE', active: false },
                   ].map((s, i) => (
                     <div key={i} className="p-4 glass rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="text-sm">
                           <span className="font-bold text-slate-200">{s.os} • {s.browser}</span>
                           <div className="text-xs text-slate-500">{s.loc} {s.active && '• Current session'}</div>
                        </div>
                        {s.active ? (
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        ) : (
                          <button className="text-xs font-black text-slate-500 hover:text-red-400">Revoke</button>
                        )}
                     </div>
                   ))}
                 </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
