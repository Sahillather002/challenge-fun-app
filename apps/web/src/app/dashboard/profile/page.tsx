'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User, Mail, Calendar, MapPin, Award, Trophy, TrendingUp,
  Save, Camera, Loader2, Footprints, DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { api, UserProfile } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    bio: '',
    country: '',
  });
  const [imageError, setImageError] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await api.user.getProfile(user.id);
        setProfile(data);
        setEditedProfile({
          name: data.name || '',
          bio: data.bio || '',
          country: data.country || '',
        });
        setImageError(false);
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  // Reset image error when profile avatar changes
  useEffect(() => {
    if (profile?.avatar) {
      setImageError(false);
    }
  }, [profile?.avatar]);

  const handleImageError = () => setImageError(true);

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select a valid image file',
          variant: 'destructive',
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !user?.id) return;

    setUploadingImage(true);
    try {
      const updatedProfile = await api.user.uploadAvatar(user.id, imageFile);
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully!',
      });
      setProfile(updatedProfile);
      setSelectedImage(null);
      setImageFile(null);
      setImageError(false);
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const updated = await api.user.updateProfile(user.id, editedProfile);
      setProfile(updated);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter mb-4">Profile synchronization failed</h2>
        <p className="text-slate-500 font-bold mb-8">The neural link to your operative profile has been interrupted.</p>
        <Button onClick={() => window.location.reload()} className="btn-gradient">Attempt Resync</Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-black tracking-tight uppercase mb-2 text-foreground">Operative Identity</h1>
        <p className="text-muted-foreground font-bold">Encrypted biometric signature and node performance history</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-12 rounded-[3.5rem] border border-border/50 bg-muted/40 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />

            <div className="relative z-10">
              <div className="relative mb-10 mx-auto w-44 h-44">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative w-full h-full rounded-full glass border-4 border-border/50 overflow-hidden shadow-2xl group">
                  {selectedImage ? (
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : profile.avatar && !imageError ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" onError={handleImageError} crossOrigin="anonymous" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-6xl font-black text-primary-foreground">
                      {profile.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <button
                    onClick={handleImageSelect}
                    disabled={uploadingImage}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    {uploadingImage ? <Loader2 className="animate-spin" /> : <Camera size={32} />}
                  </button>
                </div>

                {selectedImage && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    <button onClick={handleImageUpload} className="p-3 rounded-xl bg-emerald-500 text-white shadow-xl hover:scale-110 transition-transform">
                      <Save size={18} />
                    </button>
                    <button onClick={() => { setSelectedImage(null); setImageFile(null); }} className="p-3 rounded-xl bg-red-500 text-white shadow-xl hover:scale-110 transition-transform">
                      <Camera size={18} />
                    </button>
                  </div>
                )}
              </div>

              <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground mb-2 leading-none">{profile.name || 'Operative'}</h2>
              <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-8">{profile.email}</p>

              <div className="space-y-4 mb-10 w-full">
                {profile.country && (
                  <div className="flex items-center justify-between px-6 py-4 rounded-2xl glass border border-border/50 bg-muted/20">
                    <span className="text-[10px] font-black uppercase text-slate-500">Region</span>
                    <span className="text-xs font-black text-foreground uppercase">{profile.country}</span>
                  </div>
                )}
                <div className="flex items-center justify-between px-6 py-4 rounded-2xl glass border border-border/50 bg-muted/20">
                  <span className="text-[10px] font-black uppercase text-slate-500">Linked Since</span>
                  <span className="text-xs font-black text-foreground uppercase">{new Date(profile.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="w-full h-14 rounded-2xl btn-gradient text-[10px] font-black uppercase tracking-[0.3em]">
                  Modify Protocol
                </Button>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-10 rounded-[3rem] border border-border/50 bg-muted/40"
          >
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 mb-8 px-2">Core Biometrics</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Movement', val: profile.total_steps.toLocaleString(), unit: 'Signals', icon: <Footprints size={16} className="text-emerald-500" /> },
                { label: 'Spatial Coverage', val: profile.total_distance.toFixed(2), unit: 'KM', icon: <TrendingUp size={16} className="text-teal-500" /> },
                { label: 'Sector Victories', val: profile.competitions_won, unit: 'Wins', icon: <Award size={16} className="text-emerald-400" /> },
                { label: 'Economic Gain', val: `$${profile.total_prizes.toFixed(2)}`, unit: 'Payload', icon: <DollarSign size={16} className="text-emerald-600" /> },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 glass rounded-xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-foreground leading-none mb-1">{stat.val}</p>
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{stat.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-12 rounded-[3.5rem] border border-border/50 bg-muted/40 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                <div className="relative z-10">
                  <header className="mb-12">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none mb-2">Modify Identity Protocol</h2>
                    <p className="text-slate-500 font-bold">Update your core neural synchronization parameters</p>
                  </header>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Designated Handle (Full Name)</label>
                      <Input
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="h-16 rounded-2xl glass bg-muted/40 border border-border text-foreground font-bold text-lg px-8 focus:ring-emerald-500/50"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3 opacity-50 cursor-not-allowed">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Primary Uplink (Email)</label>
                        <Input value={profile.email} disabled className="h-16 rounded-2xl glass bg-background/20 border border-border/50 text-muted-foreground font-bold px-8" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-red-500/50 px-2">Permanent Linkage / Locked</p>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Operational Sector (Country)</label>
                        <Input
                          value={editedProfile.country}
                          onChange={(e) => setEditedProfile({ ...editedProfile, country: e.target.value })}
                          placeholder="USA, UK, JP..."
                          className="h-16 rounded-2xl glass bg-background/40 border border-border text-foreground font-bold text-lg px-8 focus:ring-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Operative Manifest (Bio)</label>
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                        className="min-h-[160px] w-full rounded-[2rem] glass bg-background/40 border border-border text-foreground font-bold p-8 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-muted-foreground"
                        placeholder="Define your operational focus..."
                      />
                    </div>

                    <div className="flex gap-6 pt-4">
                      <Button onClick={handleSave} disabled={saving} className="h-16 flex-1 rounded-2xl btn-gradient text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                        {saving ? <Loader2 className="animate-spin mr-3" /> : <Save size={20} className="mr-3" />}
                        Commit Changes
                      </Button>
                      <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={saving} className="h-16 px-10 rounded-2xl glass border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
                        Abort
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="glass p-12 rounded-[3.5rem] border border-border/50 bg-muted/40 relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground mb-8 border-b border-border/50 pb-8 leading-none">Operative Manifest</h3>
                  <p className="text-slate-400 font-bold text-xl leading-relaxed italic">
                    "{profile.bio || 'Initial operative manifest. No biometric personality profile has been established for this node yet.'}"
                  </p>
                </div>

                <div className="glass p-12 rounded-[3.5rem] border border-border/50 bg-muted/40 relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-teal-500/5 pointer-events-none" />
                  <div className="flex items-center gap-6 mb-12 border-b border-border/50 pb-8">
                    <div className="w-16 h-16 rounded-[2rem] glass border border-border/50 flex items-center justify-center text-teal-500">
                      <Trophy size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none mb-2">Neural Efficiency History</h3>
                      <p className="text-slate-500 font-bold">Historical data across verification cycles</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="group">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 group-hover:text-emerald-600 transition-colors">Cumulative Thermal Loss</p>
                      <div className="flex items-baseline gap-4">
                        <span className="text-6xl font-black text-foreground tracking-tighter">{Math.floor(profile.total_calories).toLocaleString()}</span>
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">KCAL Dissipated</span>
                        <span className="text-3xl group-hover:scale-125 transition-transform">🔥</span>
                      </div>
                      <div className="mt-4 h-1.5 w-44 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-3/4 animate-shimmer" />
                      </div>
                    </div>
                    <div className="group">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 group-hover:text-teal-500 transition-colors">Global Spatial Vector</p>
                      <div className="flex items-baseline gap-4">
                        <span className="text-6xl font-black text-foreground tracking-tighter">{profile.total_distance.toFixed(1)}</span>
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">KM Reached</span>
                        <span className="text-3xl group-hover:scale-125 transition-transform">📏</span>
                      </div>
                      <div className="mt-4 h-1.5 w-44 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 w-2/3 animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}