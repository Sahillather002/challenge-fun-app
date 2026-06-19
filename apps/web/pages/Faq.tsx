
import React, { useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, MessageCircle, Mail, Trophy, Users, Shield } from 'lucide-react';

const motion = motionBase as any;

const faqs = [
  {
    category: 'Competitions',
    questions: [
      { q: 'How do I join a live competition?', a: 'Open the Compete page, choose a battle, and select Join Battle. Your synced health activity will start scoring once the competition begins.' },
      { q: 'Can I join free competitions?', a: 'Yes. Many battles are free, while premium prize pools may require a small entry fee.' },
      { q: 'How are winners ranked?', a: 'Rankings are calculated from the competition metric, such as steps, calories, reps, distance, or verified workout score.' }
    ]
  },
  {
    category: 'Health Data',
    questions: [
      { q: 'What health data does FitBattle use?', a: 'FitBattle can use steps, water intake, calories, activity minutes, and workout logs depending on your permissions.' },
      { q: 'Can I disconnect my device?', a: 'Yes. Open Settings, choose Connected Devices, and disconnect any wearable or phone sync source.' },
      { q: 'Is my health data private?', a: 'You control profile and activity visibility from Privacy settings. Competition scores may be shown on leaderboards when you enter a battle.' }
    ]
  },
  {
    category: 'Rewards',
    questions: [
      { q: 'How do I earn points?', a: 'Earn points by winning competitions, completing daily goals, maintaining streaks, and referring friends.' },
      { q: 'Do points expire?', a: 'Points remain in your account until redeemed unless a specific competition states otherwise.' },
      { q: 'What happens if I do not have enough points?', a: 'Locked rewards remain visible so you can track the points needed to redeem them.' }
    ]
  }
];

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter((item) =>
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="p-6 lg:p-16 space-y-16 pb-32 max-w-5xl mx-auto">
      <header className="text-center space-y-6">
        <p className="text-emerald-300 font-black uppercase tracking-[0.35em] text-xs">Help center</p>
        <h1 className="text-3xl md:text-3xl font-black tracking-tight text-white">How can we help?</h1>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search competition, health data, or rewards help..."
            className="w-full glass rounded-[2rem] border border-white/10 py-6 pl-16 pr-8 text-lg focus:outline-none focus:border-emerald-500/50 shadow-2xl"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <HelpCard icon={<Trophy size={24} />} title="Competitions" text="Join battles, understand scoring, and track leaderboards." />
        <HelpCard icon={<Users size={24} />} title="Community" text="Share updates, follow athletes, and support your squad." />
        <HelpCard icon={<Shield size={24} />} title="Privacy" text="Control health data permissions and profile visibility." />
      </div>

      <div className="space-y-10">
        {filteredFaqs.map((category, categoryIndex) => (
          <div key={category.category} className="space-y-4">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] ml-2">{category.category}</h2>
            <div className="space-y-3">
              {category.questions.map((item, questionIndex) => {
                const id = `${categoryIndex}-${questionIndex}`;
                const isOpen = openIndex === id;
                return (
                  <div key={id} className={`glass rounded-3xl border transition-all ${isOpen ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 hover:border-white/10'}`}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : id)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-bold text-lg text-slate-200">{item.q}</span>
                      <div className={`p-2 glass rounded-xl transition-transform duration-300 ${isOpen ? 'rotate-180 bg-emerald-500 text-slate-950' : 'text-slate-500'}`}>
                        {isOpen ? <Minus size={18}/> : <Plus size={18}/>}
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-slate-400 font-medium leading-relaxed">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto text-slate-950 shadow-lg"><MessageCircle size={24}/></div>
          <h4 className="font-black text-white">Live Support</h4>
          <p className="text-xs text-slate-500">Average response time: 4m</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto text-slate-950 shadow-lg"><Mail size={24}/></div>
          <h4 className="font-black text-white">Email Support</h4>
          <p className="text-xs text-slate-500">support@fitbattle.app</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto text-slate-950 shadow-lg"><Users size={24}/></div>
          <h4 className="font-black text-white">Community</h4>
          <p className="text-xs text-slate-500">Join athlete discussions</p>
        </div>
      </div>
    </div>
  );
};

function HelpCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="glass p-6 rounded-[2rem] border border-white/5">
      <div className="w-12 h-12 rounded-2xl bg-white/5 text-emerald-300 flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-black text-white mt-5">{title}</h3>
      <p className="text-sm text-slate-400 mt-2 leading-relaxed">{text}</p>
    </div>
  );
}
