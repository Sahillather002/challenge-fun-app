
import React, { useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, MessageCircle, Mail, Phone, ExternalLink } from 'lucide-react';

const motion = motionBase as any;

const faqs = [
  {
    category: 'Billing & Tokens',
    questions: [
      { q: 'How are tokens calculated across modalities?', a: 'Tokens are standard across text, but for images and video, we use an "effective token" rate. A 1K image is approximately equivalent to 30,000 text tokens.' },
      { q: 'Do unused tokens roll over?', a: 'Starter and Pro tokens expire at the end of each billing cycle. Enterprise customers enjoy custom carry-over policies.' },
      { q: 'What happens if I exceed my limit?', a: 'By default, requests will fail with a 429 error. You can enable "Burst Billing" in your settings to allow continued usage at a slight premium.' }
    ]
  },
  {
    category: 'Technical & API',
    questions: [
      { q: 'Which models support native audio?', a: 'Only the Gemini 2.5 Flash Native Audio and Gemini 3 series support low-latency direct audio-to-audio streams.' },
      { q: 'How secure are my inference requests?', a: 'All data is encrypted in transit (TLS 1.3) and at rest. We do not use your private production data to train our base models without explicit consent.' },
      { q: 'What is the maximum file size for Veo synthesis?', a: 'Initial image frames for video synthesis are capped at 15MB. Output videos can be up to 1080p.' }
    ]
  }
];

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="p-8 lg:p-16 space-y-16 pb-32 max-w-4xl mx-auto">
      <header className="text-center space-y-6">
        <h1 className="text-5xl font-black tracking-tight">How can we help?</h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
          <input 
            placeholder="Search help articles..." 
            className="w-full glass rounded-[2rem] border border-white/10 py-6 pl-16 pr-8 text-lg focus:outline-none focus:border-blue-500/50 shadow-2xl"
          />
        </div>
      </header>

      <div className="space-y-12">
        {faqs.map((cat, i) => (
          <div key={i} className="space-y-6">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] ml-2">{cat.category}</h2>
            <div className="space-y-3">
              {cat.questions.map((item, idx) => {
                const id = `${i}-${idx}`;
                const isOpen = openIndex === id;
                return (
                  <div key={idx} className={`glass rounded-3xl border transition-all ${isOpen ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/5 hover:border-white/10'}`}>
                    <button 
                      onClick={() => setOpenIndex(isOpen ? null : id)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-bold text-lg text-slate-200">{item.q}</span>
                      <div className={`p-2 glass rounded-xl transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-500 text-white' : 'text-slate-500'}`}>
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
            <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center mx-auto text-white shadow-lg"><MessageCircle size={24}/></div>
            <h4 className="font-bold">Live Chat</h4>
            <p className="text-xs text-slate-500">Average response time: 4m</p>
         </div>
         <div className="glass p-8 rounded-[2.5rem] border border-white/5 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center mx-auto text-white shadow-lg"><Mail size={24}/></div>
            <h4 className="font-bold">Email Support</h4>
            <p className="text-xs text-slate-500">support@omnigen.ai</p>
         </div>
         <div className="glass p-8 rounded-[2.5rem] border border-white/5 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center mx-auto text-white shadow-lg"><ExternalLink size={24}/></div>
            <h4 className="font-bold">Community</h4>
            <p className="text-xs text-slate-500">Join our Discord hub</p>
         </div>
      </div>
    </div>
  );
};
