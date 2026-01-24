'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

import { motion } from 'framer-motion';

export default function CreateCompetitionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'steps',
    entryFee: '',
    prizePool: '',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    rules: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: 'Success!',
        description: 'Competition created successfully',
      });

      router.push('/dashboard/competitions');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create competition',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link href="/dashboard/competitions">
          <Button variant="ghost" className="mb-8 p-0 h-auto text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Neural Grid
          </Button>
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Trophy size={28} className="text-white fill-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-white">Initialize Competition</h1>
        </div>
        <p className="text-slate-500 font-bold max-w-2xl">
          Configure a fresh fitness epoch and invite operatives to sync their biometric streams for competitive rewards.
        </p>
      </motion.div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="glass-card p-10 border border-white/5 bg-slate-900/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="relative z-10 space-y-10">
              <div>
                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-400 mb-6">Neural Protocol Configuration</h3>

                <div className="space-y-8">
                  {/* Basic Info */}
                  <div className="grid gap-8">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        Competition Identifier (Title) <span className="text-red-500/50">*</span>
                      </label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., Alpha-Omega Step Epoch"
                        value={formData.title}
                        onChange={handleChange}
                        className="bg-slate-900/60 border-slate-800 rounded-2xl h-14 text-white focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        Mission Objective (Description) <span className="text-red-500/50">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Define the parameters and rewards for this synchronization session..."
                        value={formData.description}
                        onChange={handleChange}
                        className="flex min-h-[120px] w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-blue-500/50 ring-0 focus:outline-none transition-all placeholder:text-slate-700"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        Biometric Modality <span className="text-red-500/50">*</span>
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="flex h-14 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-all appearance-none"
                        required
                      >
                        <option value="steps">Steps Integration</option>
                        <option value="distance">Vector Distance</option>
                        <option value="calories">Thermal Dissipation (Calories)</option>
                        <option value="active_minutes">Temporal Engagement (Active Min)</option>
                      </select>
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="entryFee" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        Link Protocol Entry (Fee $) <span className="text-red-500/50">*</span>
                      </label>
                      <Input
                        id="entryFee"
                        name="entryFee"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="25.00"
                        value={formData.entryFee}
                        onChange={handleChange}
                        className="bg-slate-900/60 border-slate-800 rounded-2xl h-14 text-white focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="prizePool" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        Total Reward Payload ($) <span className="text-red-500/50">*</span>
                      </label>
                      <Input
                        id="prizePool"
                        name="prizePool"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="500.00"
                        value={formData.prizePool}
                        onChange={handleChange}
                        className="bg-slate-900/60 border-slate-800 rounded-2xl h-14 text-white focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                        required
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="startDate" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        Epoch Genesis (Start Date) <span className="text-red-500/50">*</span>
                      </label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="bg-slate-900/60 border-slate-800 rounded-2xl h-14 text-white focus:border-blue-500/50 transition-all invert brightness-200 contrast-0 grayscale-0"
                        style={{ colorScheme: 'dark' }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="endDate" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        Epoch Termination (End Date) <span className="text-red-500/50">*</span>
                      </label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="bg-slate-900/60 border-slate-800 rounded-2xl h-14 text-white focus:border-blue-500/50 transition-all"
                        style={{ colorScheme: 'dark' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Additional Settings */}
                  <div className="space-y-2">
                    <label htmlFor="maxParticipants" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Max Operative Capacity (Optional)
                    </label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      min="2"
                      placeholder="Unlimited Bandwidth"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      className="bg-slate-900/60 border-slate-800 rounded-2xl h-14 text-white focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="rules" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Engagement Constraints (Protocol Rules)
                    </label>
                    <textarea
                      id="rules"
                      name="rules"
                      placeholder="Specify additional constraints for verification..."
                      value={formData.rules}
                      onChange={handleChange}
                      className="flex min-h-[100px] w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-blue-500/50 ring-0 focus:outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-6 pt-4">
            <Link href="/dashboard/competitions">
              <button
                type="button"
                className="px-8 py-3 rounded-2xl glass text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors border border-white/5"
                disabled={loading}
              >
                Abort Sequence
              </button>
            </Link>
            <Button
              type="submit"
              className="px-10 py-5 h-auto btn-gradient rounded-2xl text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Initializing...
                </>
              ) : (
                'Deploy Competition Epoch'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
