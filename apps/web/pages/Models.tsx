
import React, { useState, useMemo } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Info, 
  Heart, 
  Zap, 
  X, 
  Calculator, 
  Terminal, 
  Sparkles,
  BarChart,
  ShieldCheck,
  Code,
  CheckCircle2
} from 'lucide-react';
import { MODELS } from '../constants';
import { Model } from '../types';

const motion = motionBase as any;

interface ModelsProps {
  onSelectModel: (id: string) => void;
}

const MODEL_DETAILS: Record<string, any> = {
  'gemini-3-flash-preview': {
    specs: {
      'Input Context': '1,048,576 tokens',
      'Output Limit': '8,192 tokens',
      'Training Cutoff': 'Dec 2024',
      'Architecture': 'Multimodal Sparse Mixture-of-Experts'
    },
    benchmarks: {
      'MMLU': '84.8%',
      'HumanEval': '76.2%',
      'GSM8K': '91.0%',
      'Reasoning': 'High'
    },
    capabilities: [
      'Native Audio/Video processing',
      'Function calling & Tool use',
      'JSON mode support',
      'System instructions'
    ],
    examples: [
      "Summarize this 50-page technical documentation in 3 bullet points.",
      "Extract structured JSON data from this handwritten invoice photo.",
      "Explain the logic in this Python snippet and optimize it for speed."
    ],
    pricePerMillion: 0.01,
    codeSnippet: `const response = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: "Summarize: [Your Data]",
});`
  },
  'gemini-3-pro-preview': {
    specs: {
      'Input Context': '2,097,152 tokens',
      'Output Limit': '16,384 tokens',
      'Training Cutoff': 'Jan 2025',
      'Architecture': 'Enhanced Reasoning Transformer'
    },
    benchmarks: {
      'MMLU': '89.2%',
      'HumanEval': '84.5%',
      'GSM8K': '96.3%',
      'Reasoning': 'Ultra'
    },
    capabilities: [
      'Complex multi-step reasoning',
      'Advanced coding assistant',
      'Long-context retrieval (RAG)',
      'Cross-lingual expert'
    ],
    examples: [
      "Draft a complete microservices architecture for a global fintech app.",
      "Analyze these 2,000 lines of logs for subtle security anomalies.",
      "Translate this ancient text fragment while preserving poetic meter."
    ],
    pricePerMillion: 0.05,
    codeSnippet: `const chat = ai.chats.create({
  model: 'gemini-3-pro-preview',
  config: { temperature: 0.7 }
});
const result = await chat.sendMessage("Solve: [Complex Math]");`
  },
  'gemini-2.5-flash': {
    specs: {
      'Input Context': '1,048,576 tokens',
      'Output Limit': '4,096 tokens',
      'Training Cutoff': 'Oct 2024',
      'Specialty': 'Spatial & Grounded Search'
    },
    benchmarks: {
      'Maps Grounding': '98.2%',
      'Search Precision': '94.5%',
      'Latency': 'Very Low',
      'Reliability': '99.9%'
    },
    capabilities: [
      'Google Maps grounding (Native)',
      'Google Search integration',
      'Real-time transit/traffic data',
      'Local business intelligence'
    ],
    examples: [
      "Find the best-rated Italian restaurants within 10 mins of my location.",
      "What is the current traffic status on the Golden Gate Bridge?",
      "Compare these two hotels based on recent user reviews."
    ],
    pricePerMillion: 0.01,
    codeSnippet: `const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: "Find Italian food nearby",
  config: { tools: [{ googleMaps: {} }] }
});`
  },
  'gemini-3-pro-image-preview': {
    specs: {
      'Resolution': 'Up to 4K (4096x4096px)',
      'Aspect Ratios': '1:1, 4:3, 16:9, 9:16',
      'Generation Time': '5-10 seconds',
      'Styles': 'Photorealistic, Vector, 3D, Art'
    },
    benchmarks: {
      'Prompt Adherence': '95.6%',
      'Image Quality': 'Cinematic',
      'Consistency': 'High',
      'Safety': 'Built-in'
    },
    capabilities: [
      'Hyper-realistic rendering',
      'Text rendering in images',
      'Consistent character generation',
      'Advanced lighting controls'
    ],
    examples: [
      "Cyberpunk street scene with neon lights and a robot cat, 4K, cinematic.",
      "Minimalist architectural blueprint of a treehouse in a redwood forest.",
      "Macro shot of a mechanical watch movement with internal gears visible."
    ],
    pricePerImage: 0.03,
    codeSnippet: `const response = await ai.models.generateContent({
  model: 'gemini-3-pro-image-preview',
  contents: "A cinematic space station",
  config: { imageConfig: { imageSize: '1K' } }
});`
  }
};

export const Models: React.FC<ModelsProps> = ({ onSelectModel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedInfoModel, setSelectedInfoModel] = useState<Model | null>(null);
  const [tokenCount, setTokenCount] = useState<string>('1000000');

  const filteredModels = MODELS.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (filter === 'All' || m.params.includes(filter))
  );

  const estimatedCost = useMemo(() => {
    if (!selectedInfoModel) return 0;
    const details = MODEL_DETAILS[selectedInfoModel.id];
    const val = parseInt(tokenCount) || 0;
    
    if (details.pricePerMillion) {
      return (val / 1000000) * details.pricePerMillion;
    }
    if (details.pricePerImage) {
      return val * details.pricePerImage;
    }
    return 0;
  }, [selectedInfoModel, tokenCount]);

  return (
    <div className="p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Models Catalog</h1>
          <p className="text-slate-500 font-medium">Industry-leading intelligence ready for deployment</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glass rounded-xl pl-12 pr-4 py-3 outline-none border border-white/5 focus:border-blue-500/50 font-medium"
              />
           </div>
           <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="glass rounded-xl pl-12 pr-10 py-3 outline-none border border-white/5 focus:border-blue-500/50 appearance-none min-w-[140px] font-bold"
              >
                <option>All</option>
                <option>Standard</option>
                <option>Max</option>
                <option>Lite</option>
                <option>Hifi</option>
              </select>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredModels.map((model, i) => (
          <motion.div 
            key={model.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass group rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all p-1 flex flex-col h-full"
          >
            <div className={`h-40 bg-gradient-to-br ${model.gradient} rounded-[1.8rem] p-6 flex items-start justify-between relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-6xl drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500">{model.icon}</div>
              <div className="flex gap-2">
                 <button className="p-2.5 glass rounded-xl text-white hover:bg-white/20 transition-all shadow-lg">
                   <Heart size={20} />
                 </button>
                 <button 
                  onClick={() => setSelectedInfoModel(model)}
                  className="p-2.5 glass rounded-xl text-white hover:bg-white/20 transition-all shadow-lg"
                 >
                   <Info size={20} />
                 </button>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-black text-white">{model.name}</h3>
                <div className="px-2 py-0.5 glass rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-400">Stable</div>
              </div>
              <p className="text-slate-400 text-sm mb-8 flex-1 leading-relaxed">{model.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Context</div>
                  <div className="text-xs font-bold text-slate-200">{model.context}</div>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Latency</div>
                  <div className="text-xs font-bold text-slate-200">{model.speed}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Compute</div>
                  <div className="text-xs font-bold text-slate-200">{model.params}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                 <div className="text-emerald-400 font-black text-lg">{model.price}</div>
                 <button 
                  onClick={() => onSelectModel(model.id)}
                  className="px-6 py-3 rounded-xl btn-gradient text-white font-bold flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
                 >
                   Deploy <ArrowRight size={18} />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedInfoModel && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInfoModel(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="glass w-full max-w-5xl max-h-[90vh] rounded-[3rem] border border-white/10 relative overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <button 
                  onClick={() => setSelectedInfoModel(null)}
                  className="absolute top-8 right-8 p-3 glass rounded-full text-slate-400 hover:text-white transition-all z-10 hover:rotate-90"
                >
                  <X size={24} />
                </button>

                <div className="flex flex-col lg:flex-row gap-10 items-start mb-16">
                  <div className={`w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br ${selectedInfoModel.gradient} rounded-[2.5rem] flex items-center justify-center text-6xl md:text-8xl shadow-2xl relative`}>
                    <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] animate-pulse" />
                    {selectedInfoModel.icon}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-5xl font-black tracking-tighter">{selectedInfoModel.name}</h2>
                      <div className="px-4 py-1 glass rounded-full text-xs font-black uppercase tracking-widest text-green-400 border border-green-500/20">Active Node</div>
                    </div>
                    <p className="text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed">{selectedInfoModel.description}</p>
                    <div className="flex flex-wrap gap-3 pt-4">
                      <span className="flex items-center gap-2 px-4 py-2 glass rounded-2xl text-xs font-bold text-blue-400 border border-blue-500/20">
                        <CheckCircle2 size={14} /> Production Grade
                      </span>
                      <span className="flex items-center gap-2 px-4 py-2 glass rounded-2xl text-xs font-bold text-purple-400 border border-purple-500/20">
                        <ShieldCheck size={14} /> Safety Guardrails Active
                      </span>
                      <span className="flex items-center gap-2 px-4 py-2 glass rounded-2xl text-xs font-bold text-orange-400 border border-orange-500/20">
                        <Zap size={14} /> {selectedInfoModel.speed} Latency
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-12">
                    {/* Technical Specs & Benchmarks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <section>
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                          <Terminal size={18} className="text-blue-500" /> Specifications
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(MODEL_DETAILS[selectedInfoModel.id]?.specs || {}).map(([key, val]: any) => (
                            <div key={key} className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5">
                              <span className="text-sm font-bold text-slate-500">{key}</span>
                              <span className="text-sm font-black text-white">{val}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                      <section>
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                          <BarChart size={18} className="text-purple-500" /> Benchmarks
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(MODEL_DETAILS[selectedInfoModel.id]?.benchmarks || {}).map(([key, val]: any) => (
                            <div key={key} className="p-4 glass rounded-2xl border border-white/5 text-center">
                              <div className="text-[10px] font-black text-slate-500 uppercase mb-1">{key}</div>
                              <div className="text-xl font-black text-emerald-400">{val}</div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>

                    {/* Capabilities Matrix */}
                    <section>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Capabilities Matrix</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {MODEL_DETAILS[selectedInfoModel.id]?.capabilities.map((cap: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-4 glass rounded-2xl border border-white/5 bg-white/5">
                            <CheckCircle2 size={16} className="text-blue-500 flex-shrink-0" />
                            <span className="text-sm font-bold text-slate-200">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Quick Start Code */}
                    <section>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <Code size={18} className="text-orange-500" /> Quick Implementation
                      </h4>
                      <div className="relative group">
                         <pre className="p-6 glass rounded-3xl border border-white/10 bg-black/40 text-sm font-mono text-blue-300 overflow-x-auto">
                           <code>{MODEL_DETAILS[selectedInfoModel.id]?.codeSnippet}</code>
                         </pre>
                         <button className="absolute top-4 right-4 p-2 glass rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:text-white">
                           <Code size={16} />
                         </button>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-10">
                    {/* Calculator Section */}
                    <section>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <Calculator size={18} className="text-emerald-500" /> Cost Projector
                      </h4>
                      <div className="glass p-8 rounded-[2.5rem] border border-white/10 space-y-8 bg-blue-500/5 shadow-2xl">
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{MODEL_DETAILS[selectedInfoModel.id].pricePerMillion ? 'Estimated Token Load' : 'Total Image Requests'}</label>
                          <div className="relative">
                            <input 
                              type="number"
                              value={tokenCount}
                              onChange={(e) => setTokenCount(e.target.value)}
                              className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-2xl font-black text-white outline-none focus:border-blue-500/50 shadow-inner"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-black text-sm uppercase tracking-tighter">
                              {MODEL_DETAILS[selectedInfoModel.id].pricePerMillion ? 'Tokens' : 'Units'}
                            </div>
                          </div>
                        </div>
                        <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 text-center">Projected Unit Cost</div>
                          <div className="text-5xl font-black text-emerald-400 text-center tracking-tighter">${estimatedCost.toFixed(4)}</div>
                        </div>
                        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">Billing rate: {selectedInfoModel.price}</p>
                      </div>
                    </section>

                    {/* Example Use Cases */}
                    <section>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-500" /> Live Use Cases
                      </h4>
                      <div className="space-y-4">
                        {(MODEL_DETAILS[selectedInfoModel.id]?.examples || []).map((example: string, idx: number) => (
                          <div 
                            key={idx} 
                            className="glass p-6 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all cursor-pointer group hover:bg-white/5"
                            onClick={() => {
                              onSelectModel(selectedInfoModel.id);
                              setSelectedInfoModel(null);
                            }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                <span className="text-xs font-black">{idx + 1}</span>
                              </div>
                              <p className="text-slate-400 text-sm font-medium leading-relaxed group-hover:text-white transition-colors italic">"{example}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="p-1 rounded-[2.8rem] btn-gradient">
                      <button 
                        onClick={() => {
                          onSelectModel(selectedInfoModel.id);
                          setSelectedInfoModel(null);
                        }}
                        className="w-full py-6 rounded-[2.5rem] bg-[#020617] text-white font-black flex items-center justify-center gap-4 hover:bg-transparent transition-all group overflow-hidden relative shadow-2xl"
                      >
                         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                         Initialize Playground <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
