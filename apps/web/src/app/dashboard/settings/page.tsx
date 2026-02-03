'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Bell, Lock, User, Moon, Sun, Globe, Save, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    competitionUpdates: true,
    leaderboardChanges: false,
    weeklyReport: true,

    // Privacy
    profileVisibility: 'public',
    showStats: true,
    showLocation: true,

    // Account
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock API latency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Network Sync Successful',
        description: 'Global preferences have been committed to the neural link.',
      });
    } catch (error) {
      toast({
        title: 'Sync Error',
        description: 'Failed to synchronize settings with the network.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Neural keys do not match. Verification failed.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Security Uplink Active',
        description: 'New security protocols have been established.',
      });

      setSettings({
        ...settings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        title: 'Uplink Failure',
        description: 'Failed to establish new security protocols.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 glass border ${active ? 'bg-emerald-600/20 border-emerald-500/40' : 'bg-muted/40 border-border/50'}`}
    >
      <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-300 shadow-xl ${active ? 'translate-x-6 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground/30'}`} />
    </button>
  );

  return (
    <div className="space-y-12 pb-24 max-w-5xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-black tracking-tight uppercase mb-2 text-foreground">System Protocols</h1>
        <p className="text-slate-500 font-bold">Configure neural interface preferences and security clearance</p>
      </header>

      <div className="space-y-12">
        {/* Appearance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-10 rounded-[3rem] border border-border/50 bg-muted/40"
        >
          <div className="flex items-center gap-6 mb-12 border-b border-border/50 pb-8">
            <div className="w-16 h-16 rounded-[2rem] glass border border-border/50 flex items-center justify-center text-emerald-500">
              <Moon size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none mb-2">Visual Spectrum</h3>
              <p className="text-slate-500 font-bold">Adjust the neural interface wavelength</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'light', label: 'Photonic (Light)', icon: <Sun size={24} /> },
              { id: 'dark', label: 'Substratum (Dark)', icon: <Moon size={24} /> },
              { id: 'system', label: 'Adaptive (System)', icon: <Settings size={24} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`
                   p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 relative overflow-hidden group
                   ${theme === t.id
                    ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.1)]'
                    : 'border-border/50 bg-muted/40 hover:border-border'}
                `}
              >
                <div className={`p-4 glass rounded-[1.5rem] transition-all group-hover:scale-110 ${theme === t.id ? 'text-emerald-500' : 'text-slate-600'}`}>
                  {t.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === t.id ? 'text-white' : 'text-slate-500'}`}>{t.label}</span>
                {theme === t.id && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-10 rounded-[3rem] border border-border/50 bg-muted/40"
        >
          <div className="flex items-center gap-6 mb-12 border-b border-border/50 pb-8">
            <div className="w-16 h-16 rounded-[2rem] glass border border-border/50 flex items-center justify-center text-teal-500">
              <Bell size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none mb-2">Signal Relays</h3>
              <p className="text-slate-500 font-bold">Configure neural broadcast parameters</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              { id: 'emailNotifications', label: 'Neural Uplink (Email)', sub: 'Synchronize report logs via SMTP' },
              { id: 'pushNotifications', label: 'Active Direct (Push)', sub: 'Real-time sensory notifications' },
              { id: 'competitionUpdates', label: 'Sector Events', sub: 'Protocol modifications and events' },
              { id: 'leaderboardChanges', label: 'Rank Shift', sub: 'Alerts on hierarchy status change' },
              { id: 'weeklyReport', label: 'Epoch Summary', sub: 'Weekly biometric synthesis' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-8 rounded-[2rem] glass border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
                <div>
                  <p className="text-lg font-black uppercase text-foreground tracking-widest leading-none mb-2">{item.label}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.sub}</p>
                </div>
                <Toggle
                  active={(settings as any)[item.id]}
                  onClick={() => setSettings({ ...settings, [item.id]: !(settings as any)[item.id] })}
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Privacy & Security */}
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-10 rounded-[3rem] border border-border/50 bg-muted/40"
          >
            <div className="flex items-center gap-6 mb-12 border-b border-border/50 pb-8">
              <div className="w-16 h-16 rounded-[2rem] glass border border-border/50 flex items-center justify-center text-emerald-400">
                <Globe size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none mb-2">Stealth Ops</h3>
                <p className="text-slate-500 font-bold">Node visibility protocols</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Encryption Level (Visibility)</label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                  className="w-full h-16 rounded-2xl glass bg-background/40 border border-border text-foreground font-bold p-4 focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none cursor-pointer"
                >
                  <option value="public" className="bg-background">Broadcast (Public)</option>
                  <option value="friends" className="bg-background">Local Net (Friends)</option>
                  <option value="private" className="bg-background">Blackout (Private)</option>
                </select>
              </div>

              {[
                { id: 'showStats', label: 'Metric Display', sub: 'Reveal performance benchmarks' },
                { id: 'showLocation', label: 'Geospatial Sync', sub: 'Reveal operational sector' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 rounded-2xl glass border border-border/50 bg-muted/20">
                  <div>
                    <p className="text-sm font-black uppercase text-foreground tracking-widest leading-none mb-1">{item.label}</p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{item.sub}</p>
                  </div>
                  <Toggle
                    active={(settings as any)[item.id]}
                    onClick={() => setSettings({ ...settings, [item.id]: !(settings as any)[item.id] })}
                  />
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-10 rounded-[3rem] border border-border/50 bg-muted/40"
          >
            <div className="flex items-center gap-6 mb-12 border-b border-border/50 pb-8">
              <div className="w-16 h-16 rounded-[2rem] glass border border-border/50 flex items-center justify-center text-red-400">
                <Lock size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none mb-2">Cryptographic</h3>
                <p className="text-slate-500 font-bold">Neural access key rotation</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Current Key</label>
                <Input
                  type="password"
                  value={settings.currentPassword}
                  onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                  className="h-14 rounded-xl glass bg-background/40 border-border text-foreground font-bold px-6"
                  placeholder="Verification Required"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">New Neural Key</label>
                <Input
                  type="password"
                  value={settings.newPassword}
                  onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                  className="h-14 rounded-xl glass bg-background/40 border-border text-foreground font-bold px-6"
                  placeholder="Establish Protocol"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Confirm Key</label>
                <Input
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                  className="h-14 rounded-xl glass bg-muted/40 border border-border text-foreground font-bold px-6"
                  placeholder="Verify Signature"
                />
              </div>

              <Button onClick={handlePasswordChange} disabled={loading} className="w-full h-14 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl mt-4">
                Initialize Rotation
              </Button>
            </div>
          </motion.section>
        </div>

        {/* Global Control Button */}
        <div className="sticky bottom-12 z-40 flex justify-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3 rounded-[2.5rem] glass border border-border/50 bg-muted/80 backdrop-blur-3xl shadow-2xl flex items-center gap-6 pr-4"
          >
            <Button onClick={handleSave} disabled={loading} className="h-16 px-12 rounded-[2rem] btn-gradient text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              {loading ? 'Committing...' : 'Commit to Network'}
            </Button>
            <button
              onClick={() => window.location.reload()}
              className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              Reset Buffers
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
