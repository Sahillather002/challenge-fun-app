
import React, { useState } from 'react';
import { motion as motionBase } from 'framer-motion';
import { Search, ChevronRight, BookOpen, Terminal, Code, Cpu, ShieldCheck, Globe, HelpCircle } from 'lucide-react';

const motion = motionBase as any;

const sections = [
  { 
    title: 'Getting Started', 
    icon: <BookOpen size={18}/>,
    items: ['Quickstart Guide', 'Architecture Overview', 'Environment Setup', 'Hello World Tutorial']
  },
  { 
    title: 'Core Concepts', 
    icon: <Cpu size={18}/>,
    items: ['Token Economy', 'Model Routing', 'Multimodal Buffering', 'Inference Optimization']
  },
  { 
    title: 'API Reference', 
    icon: <Terminal size={18}/>,
    items: ['Authentication', 'Chat Completions', 'Image Synthesis', 'Video Generation (Veo)']
  },
  { 
    title: 'SDKs & Tools', 
    icon: <Code size={18}/>,
    items: ['JavaScript / Node.js', 'Python SDK', 'REST Interface', 'CLI Documentation']
  }
];

export const Docs: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Quickstart Guide');

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar Docs Navigation */}
      <div className="w-80 glass border-r border-white/5 hidden xl:flex flex-col p-8 space-y-10 custom-scrollbar overflow-y-auto h-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            placeholder="Search docs..." 
            className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <nav className="space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest px-2">
                {section.icon}
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveItem(item)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeItem === item ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest">
              <span>Platform</span> <ChevronRight size={12}/> <span>Documentation</span> <ChevronRight size={12}/> <span className="text-white">{activeItem}</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">{activeItem}</h1>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">Learn how to build, deploy, and scale your agentic workflows with the OmniGen fabric. This guide covers the fundamental implementation details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[2rem] border border-white/5 bg-blue-500/5 space-y-4">
              <ShieldCheck className="text-blue-500" size={32} />
              <h3 className="text-xl font-bold">Secure Deployment</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Ensure your API keys are managed via environment variables and never exposed in the client-side code.</p>
            </div>
            <div className="glass p-8 rounded-[2rem] border border-white/5 bg-purple-500/5 space-y-4">
              <Globe className="text-purple-500" size={32} />
              <h3 className="text-xl font-bold">Edge Availability</h3>
              <p className="text-sm text-slate-400 leading-relaxed">OmniGen routes your inference requests to the closest edge node for &lt;150ms global latency.</p>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-black">Initialization</h2>
            <p className="text-slate-400 leading-relaxed font-medium">To begin interacting with the OmniGen API, install the official Node.js client library and initialize your connection.</p>
            <div className="relative group">
              <pre className="p-8 glass rounded-3xl border border-white/10 bg-black/40 text-sm font-mono overflow-x-auto text-blue-300">
                <code>{`// Install SDK
npm install @omnigen/core

// Initialize Fabric
import { OmniFabric } from '@omnigen/core';

const engine = new OmniFabric({
  apiKey: process.env.OMNIGEN_KEY,
  region: 'us-east-1'
});

const response = await engine.infer({
  prompt: 'Analyze system telemetry...',
  model: 'gemini-3-pro'
});`}</code>
              </pre>
            </div>
          </section>

          <div className="p-8 glass border border-amber-500/20 rounded-[2rem] bg-amber-500/5 flex gap-6 items-start">
            <div className="p-3 glass rounded-2xl text-amber-500"><HelpCircle size={24}/></div>
            <div className="space-y-2">
              <h4 className="font-bold text-amber-500">Need Enterprise Support?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Priority documentation access and direct engineering consultation are available for enterprise customers.</p>
              <button className="text-amber-500 text-sm font-black hover:underline">Contact Support Team →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
