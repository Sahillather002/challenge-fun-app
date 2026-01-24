'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, TrendingUp, TrendingDown, Download, Filter, DollarSign, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Transaction = {
  id: string;
  type: 'entry_fee' | 'prize' | 'refund' | 'withdrawal';
  amount: number;
  description: string;
  competition?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'prize',
    amount: 250,
    description: 'Prize winnings',
    competition: '30-Day Step Challenge',
    date: '2024-10-15',
    status: 'completed',
  },
  {
    id: '2',
    type: 'entry_fee',
    amount: -25,
    description: 'Competition entry fee',
    competition: 'Weekend Warriors',
    date: '2024-10-12',
    status: 'completed',
  },
  {
    id: '3',
    type: 'entry_fee',
    amount: -30,
    description: 'Competition entry fee',
    competition: 'Calorie Crusher October',
    date: '2024-10-01',
    status: 'completed',
  },
  {
    id: '4',
    type: 'prize',
    amount: 100,
    description: 'Prize winnings - 3rd place',
    competition: 'September Sprint',
    date: '2024-09-30',
    status: 'completed',
  },
  {
    id: '5',
    type: 'withdrawal',
    amount: -150,
    description: 'Bank withdrawal',
    date: '2024-09-28',
    status: 'completed',
  },
  {
    id: '6',
    type: 'entry_fee',
    amount: -20,
    description: 'Competition entry fee',
    competition: 'Distance Dominator',
    date: '2024-09-15',
    status: 'completed',
  },
  {
    id: '7',
    type: 'prize',
    amount: 500,
    description: 'Prize winnings - 1st place 🏆',
    competition: 'Summer Challenge',
    date: '2024-08-31',
    status: 'completed',
  },
  {
    id: '8',
    type: 'refund',
    amount: 25,
    description: 'Competition cancelled - refund',
    competition: 'August Marathon',
    date: '2024-08-20',
    status: 'completed',
  },
];

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'entry_fee' | 'prize' | 'withdrawal'>('all');

  const filteredTransactions = filter === 'all'
    ? mockTransactions
    : mockTransactions.filter(t => t.type === filter);

  const totalEarnings = mockTransactions
    .filter(t => t.type === 'prize')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = mockTransactions
    .filter(t => t.type === 'entry_fee')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalEarnings - totalSpent;

  const typeIcons = {
    entry_fee: <TrendingDown size={20} className="text-red-400" />,
    prize: <TrendingUp size={20} className="text-emerald-400" />,
    refund: <TrendingUp size={20} className="text-blue-400" />,
    withdrawal: <TrendingDown size={20} className="text-orange-400" />,
  };

  const typeLabels = {
    entry_fee: 'Link Protocol Fee',
    prize: 'Reward Payload',
    refund: 'Protocol Refund',
    withdrawal: 'External Transfer',
  };

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 text-center md:text-left">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2 text-white">Neural Ledger</h1>
          <p className="text-slate-500 font-bold">Synchronized history of financial streams and reward distributions</p>
        </div>
        <Button variant="ghost" className="h-12 px-8 rounded-2xl glass border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all gap-3">
          <Download size={16} />
          Export Datastream
        </Button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            label: 'Current Liquidity',
            val: `$${balance.toFixed(2)}`,
            icon: <DollarSign size={24} className="text-blue-400" />,
            isBalance: true,
            sub: 'Net neural earnings'
          },
          { label: 'Total Inflow', val: `$${totalEarnings.toFixed(2)}`, icon: <TrendingUp size={24} className="text-emerald-400" />, sub: 'Accumulated rewards' },
          { label: 'Network Outflow', val: `$${totalSpent.toFixed(2)}`, icon: <TrendingDown size={24} className="text-red-400" />, sub: 'Protocol access fees' },
          { label: 'Total Epochs', val: mockTransactions.length, icon: <Calendar size={24} className="text-purple-400" />, sub: 'Verification sessions' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass p-8 rounded-[2.5rem] border ${stat.isBalance ? 'border-blue-500/20 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-white/5 bg-slate-900/20 shadow-xl'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 glass rounded-2xl shadow-inner">
                {stat.icon}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</div>
            <div className={`text-4xl font-black tracking-tighter mb-2 ${stat.isBalance ? (balance >= 0 ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>
              {stat.val}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters & History Group */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-6 px-4">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filter Stream:</span>
          </div>
          <div className="flex p-1.5 glass rounded-2xl border border-white/5 bg-slate-900/40 w-full md:w-auto">
            {(['all', 'prize', 'entry_fee', 'withdrawal'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                    flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${filter === f
                    ? 'bg-blue-600/10 text-blue-400 shadow-inner'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
                  `}
              >
                {f === 'all' ? 'Datastream' : f === 'entry_fee' ? 'Fees' : f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-10 rounded-[3rem] border border-white/5 bg-slate-900/20"
        >
          <div className="flex items-center gap-4 mb-10 pb-10 border-b border-white/5">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Stream History</h2>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTransactions.map((transaction, i) => (
                <motion.div
                  key={transaction.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-6 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all group h-24"
                >
                  <div className="flex items-center gap-8 flex-1">
                    <div className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      {typeIcons[transaction.type]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-black uppercase tracking-tighter text-white transition-colors group-hover:text-blue-400">{transaction.description}</p>
                        {transaction.status !== 'completed' && (
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${transaction.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {transaction.status}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-6 mt-1">
                        {transaction.competition && (
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span className="text-blue-500/50 mr-2">NODE:</span> {transaction.competition}
                          </p>
                        )}
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                          {new Date(transaction.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-2xl font-black tracking-tighter ${transaction.amount > 0 ? 'text-emerald-400' : 'text-white/80'}`}>
                      {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">
                      {typeLabels[transaction.type]}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-[2.5rem] glass mx-auto mb-6 flex items-center justify-center text-slate-700 border border-white/5">
                  <CreditCard size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2">Zero Signals Detected</h3>
                <p className="text-slate-500 font-bold mb-8">The neural ledger contains no entries for this protocol filter.</p>
                <Button onClick={() => setFilter('all')} variant="ghost" className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300">
                  Resync All Streams
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-[3.5rem] border border-white/5 bg-slate-900/40 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-blue-400">
                <CreditCard size={24} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">Wallet Protocols</h2>
            </div>
            <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-md">
              Securely manage your biometric access tokens and reward destinations. All encrypted via end-to-end neural pathways.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-8 rounded-[2.5rem] glass border border-blue-500/20 bg-blue-500/5 shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 blur-md absolute" />
                  <CreditCard size={24} className="text-white/40" />
                </div>
                <div>
                  <p className="text-xl font-black text-white tracking-widest leading-none mb-1">•••• 4242</p>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Node / EXP 12.25</p>
                </div>
              </div>
              <div className="flex gap-4 relative z-10">
                <button type="button" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors px-4 py-2 rounded-lg glass border border-white/5">Edit</button>
                <button type="button" className="text-[9px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-400 transition-colors px-4 py-2 rounded-lg glass border border-white/5">Delete</button>
              </div>
            </div>

            <button type="button" className="w-full h-20 rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all group flex items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-blue-400 group-hover:scale-110 transition-all">
                <span className="text-2xl font-light leading-none">+</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 group-hover:text-slate-400 transition-colors">LINK ADDITIONAL NODE</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
