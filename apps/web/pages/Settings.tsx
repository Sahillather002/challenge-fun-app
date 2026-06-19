
import React, { useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { User, Shield, Bell, Users, Globe, LogOut, Upload, CheckCircle2, ChevronRight, Smartphone } from 'lucide-react';

const motion = motionBase as any;

type SettingsTab = 'Profile' | 'Health' | 'Notifications' | 'Privacy' | 'Devices';

const settingsMenu = [
  { id: 'Profile', label: 'Profile', icon: <User size={20}/> },
  { id: 'Health', label: 'Health Data', icon: <Shield size={20}/> },
  { id: 'Notifications', label: 'Notifications', icon: <Bell size={20}/> },
  { id: 'Devices', label: 'Connected Devices', icon: <Smartphone size={20}/> },
  { id: 'Privacy', label: 'Privacy', icon: <Globe size={20}/> },
];

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');
  const menu = settingsMenu;

  return (
    <div className="p-6 lg:p-10 space-y-8 pb-32 max-w-6xl mx-auto">
      <header>
        <p className="text-slate-400 font-black uppercase tracking-[0.35em] text-xs mb-3">Account settings</p>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Configure Your Competition Experience</h1>
        <p className="text-slate-400 mt-3 font-medium">Manage profile details, health data permissions, notifications, and connected devices.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <div className="space-y-2">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SettingsTab)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black' : 'glass border border-white/5 text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-3">{item.icon}<span>{item.label}</span></span>
              <ChevronRight size={16} />
            </button>
          ))}
          <div className="h-px bg-white/5 my-6" />
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black text-sm">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        <div className="glass rounded-[3rem] border border-white/10 p-6 md:p-10 space-y-8">
          {activeTab === 'Profile' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 p-[3px]">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-2xl font-black text-white">FF</div>
                  </div>
                  <button className="absolute bottom-1 right-1 p-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl text-slate-950 shadow-xl">
                    <Upload size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Athlete Identity</h3>
                  <p className="text-slate-400 text-sm mt-2">Your avatar and display name appear on leaderboards and community posts.</p>
                  <button className="mt-4 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-black">Remove Photo</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Display Name" defaultValue="Fit Fighter" />
                <FormField label="Email" defaultValue="athlete@fitbattle.app" />
                <FormField label="Username" defaultValue="fit_fighter" />
                <FormField label="Location" defaultValue="Global Arena" />
              </div>
              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black">Save Profile</button>
            </div>
          )}

          {activeTab === 'Health' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">Health Data Permissions</h2>
              <ToggleRow title="Step Counter" desc="Allow FitBattle to read daily step data for competitions." enabled />
              <ToggleRow title="Hydration Logging" desc="Store water intake entries against your daily goals." enabled />
              <ToggleRow title="Calorie Estimates" desc="Use activity data to estimate calories burned." enabled />
              <ToggleRow title="Route Tracking" desc="Allow GPS-backed cardio competitions when available." enabled={false} />
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">Competition Notifications</h2>
              <ToggleRow title="Live Battle Alerts" desc="Get notified when a new competition opens." enabled />
              <ToggleRow title="Leaderboard Moves" desc="Receive updates when your rank changes." enabled />
              <ToggleRow title="Friend Activity" desc="See when friends complete goals or join battles." enabled />
              <ToggleRow title="Reward Reminders" desc="Get reminders when you are close to redeeming a reward." enabled />
            </div>
          )}

          {activeTab === 'Devices' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">Connected Devices</h2>
              <DeviceRow name="iPhone Fitness Sync" status="Connected" lastSync="2 minutes ago" />
              <DeviceRow name="Web PWA Session" status="Current" lastSync="Just now" />
              <DeviceRow name="Wearable Band" status="Disconnected" lastSync="Yesterday" />
              <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black">Connect New Device</button>
            </div>
          )}

          {activeTab === 'Privacy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">Privacy Controls</h2>
              <ToggleRow title="Public Profile" desc="Show your profile on community leaderboards." enabled />
              <ToggleRow title="Activity Visibility" desc="Let friends see your workouts and goals." enabled />
              <ToggleRow title="Competition History" desc="Display past battles on your profile." enabled />
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 leading-relaxed font-medium">
                Health data is used only for competitions, goals, and rewards. You can disconnect devices or delete your account from this panel.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function FormField({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      <input defaultValue={defaultValue} className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-5 py-4 text-slate-200 outline-none focus:border-emerald-500/50 transition-all" />
    </div>
  );
}

function ToggleRow({ title, desc, enabled }: { title: string; desc: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
      <div>
        <div className="text-white font-black">{title}</div>
        <div className="text-sm text-slate-400 mt-1 leading-relaxed">{desc}</div>
      </div>
      <div className={`w-14 h-8 rounded-full p-1 transition-all ${enabled ? 'bg-emerald-400' : 'bg-slate-700'}`}>
        <div className={`w-6 h-6 rounded-full bg-white transition-all ${enabled ? 'translate-x-6' : ''}`} />
      </div>
    </div>
  );
}

function DeviceRow({ name, status, lastSync }: { name: string; status: string; lastSync: string }) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-300"><Smartphone size={22} /></div>
        <div>
          <div className="text-white font-black">{name}</div>
          <div className="text-sm text-slate-400 mt-1">Last synced {lastSync}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm font-black text-emerald-300"><CheckCircle2 size={18} />{status}</div>
    </div>
  );
}
