'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Mail, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Logged in successfully!',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-hidden relative p-4 font-sans">
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-40" />

      {/* Ambient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
            <Trophy size={28} className="text-white fill-white" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-white">HealthComp</span>
        </Link>

        {/* Login Card */}
        <div className="glass-card p-10 border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Welcome Back</h1>
              <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Distributed Fitness Verification</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Biometric Identifier (Email)
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@omni.health"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 bg-slate-900/40 border-slate-800 rounded-2xl h-14 text-white focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Access Key (Password)
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 bg-slate-900/40 border-slate-800 rounded-2xl h-14 text-white focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 btn-gradient rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-blue-500/20" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Authorize Access'
                )}
              </Button>
            </form>

            <div className="flex flex-col space-y-4 pt-4">
              <div className="text-center">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">New operative? </span>
                <Link href="/auth/register" className="text-blue-400 hover:underline font-black uppercase tracking-widest text-xs">
                  Create Account
                </Link>
              </div>
              <div className="text-center pt-2">
                <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">
                  ← Terminal Exit (Home)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
