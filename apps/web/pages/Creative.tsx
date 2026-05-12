
import React, { useState, useRef, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Sparkles, 
  Upload, 
  Download, 
  ArrowRight,
  Loader2,
  Trash2,
  Maximize2,
  Monitor,
  Smartphone,
  Eye,
  FileText,
  ShieldCheck,
  CreditCard,
  Zap
} from 'lucide-react';
import { generateImage, editImage, generateVideo, analyzeImage } from '../services/geminiService';

const motion = motionBase as any;

type Tab = 'generate' | 'edit' | 'video' | 'analyze';

const LOADING_MESSAGES = [
  "Provisioning compute nodes...",
  "Initializing transformer weights...",
  "Orchestrating temporal buffers...",
  "Optimizing pixel distribution...",
  "Applying creative guardrails...",
  "Synthesizing hifi layers...",
  "Finalizing temporal consistency...",
  "Rendering production artifact..."
];

export const Creative: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 7000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSourceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async () => {
    if (!prompt && activeTab !== 'video' && activeTab !== 'analyze') return;
    setIsGenerating(true);
    setResult(null);
    setAnalysisResult(null);

    try {
      if (activeTab === 'generate') {
        const url = await generateImage(prompt, imageSize);
        setResult(url);
      } else if (activeTab === 'edit' && sourceImage) {
        const url = await editImage(sourceImage, prompt);
        setResult(url);
      } else if (activeTab === 'video' && sourceImage) {
        const url = await generateVideo(sourceImage, prompt, aspectRatio);
        setResult(url);
      } else if (activeTab === 'analyze' && sourceImage) {
        const text = await analyzeImage(sourceImage, prompt);
        setAnalysisResult(text);
      }
    } catch (error: any) {
      console.error("Lab Synthesis Error:", error);
      if (error.message?.includes("Requested entity was not found.") && typeof (window as any).aistudio !== 'undefined') {
        await (window as any).aistudio.openSelectKey();
      } else {
        alert("Fabric synthesis failed. Ensure billing is active for Pro/Veo capabilities.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">Creative Lab</h1>
          <p className="text-slate-500 font-bold text-lg">Hifi synthesis powered by Gemini 3 and Veo 3.1 Fabrics</p>
        </div>
        <div className="flex items-center gap-4 bg-blue-600/10 border border-blue-500/20 px-6 py-3 rounded-2xl text-blue-400 font-black text-xs uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Production Compute Cluster Active
        </div>
      </header>

      {/* Mode Navigation */}
      <div className="flex flex-wrap gap-3 p-2 glass rounded-[2.5rem] w-fit border border-white/5 bg-slate-900/20">
        {[
          { id: 'generate', label: 'Synthesis', icon: <Sparkles size={18}/> },
          { id: 'edit', label: 'Transformation', icon: <ImageIcon size={18}/> },
          { id: 'analyze', label: 'Intelligence', icon: <Eye size={18}/> },
          { id: 'video', label: 'Cinematics', icon: <VideoIcon size={18}/> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as Tab); setResult(null); setAnalysisResult(null); }}
            className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black text-sm transition-all ${activeTab === tab.id ? 'btn-gradient text-white shadow-2xl shadow-blue-500/30 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
        {/* Workspace Controls */}
        <div className="space-y-8">
          <div className="glass p-10 rounded-[3.5rem] border border-white/10 space-y-10 shadow-2xl bg-slate-900/30 backdrop-blur-3xl">
            {(activeTab === 'edit' || activeTab === 'video' || activeTab === 'analyze') && (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Source Asset</label>
                {!sourceImage ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-6 hover:border-blue-500/50 hover:bg-blue-600/5 transition-all group bg-black/40 shadow-inner"
                  >
                    <div className="p-6 glass rounded-[2rem] text-slate-600 group-hover:text-blue-400 transition-all group-hover:scale-110 shadow-2xl">
                      <Upload size={48} />
                    </div>
                    <div className="text-center">
                      <div className="font-black text-slate-400 group-hover:text-blue-200 transition-colors uppercase tracking-widest text-sm">Upload Context Image</div>
                      <div className="text-xs text-slate-600 mt-2 font-bold">Max 15MB • PNG, JPEG supported</div>
                    </div>
                  </button>
                ) : (
                  <div className="relative group rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <img src={sourceImage} className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 transition-all backdrop-blur-md">
                      <button onClick={() => fileInputRef.current?.click()} className="p-5 glass rounded-2xl text-white hover:text-blue-400 transition-all shadow-2xl"><Upload size={28}/></button>
                      <button onClick={() => setSourceImage(null)} className="p-5 glass rounded-2xl text-white hover:text-red-400 transition-all shadow-2xl"><Trash2 size={28}/></button>
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">
                {activeTab === 'generate' ? 'Conceptual Framework' : activeTab === 'edit' ? 'Modification Prompt' : activeTab === 'analyze' ? 'Intelligence Query' : 'Cinematic Trajectory'}
              </label>
              <div className="relative">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    activeTab === 'generate' ? "A photorealistic mechanical watch being assembled by tiny drones in a high-tech workshop..." : 
                    activeTab === 'edit' ? "Reimagine the subject in a Victorian steampunk aesthetic with heavy brass details..." : 
                    activeTab === 'analyze' ? "Describe the lighting composition and list every identifiable object in this scene..." : 
                    "A sweeping 360-degree pan across the environment showing the horizon line moving..."
                  }
                  className="w-full h-44 bg-black/60 p-8 rounded-[2rem] border border-white/10 outline-none focus:border-blue-500/50 resize-none font-bold text-lg text-slate-200 transition-all shadow-inner custom-scrollbar placeholder:text-slate-700"
                />
                <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/5 text-[9px] font-black uppercase text-slate-500">
                  <Zap size={10} /> Fabric Connected
                </div>
              </div>
            </div>

            {activeTab === 'generate' && (
              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Production Fidelity</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['1K', '2K', '4K'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setImageSize(s)}
                      className={`py-5 rounded-3xl font-black text-sm border transition-all relative group ${imageSize === s ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'border-white/10 text-slate-500 hover:border-white/20'}`}
                    >
                      {s}
                      {s !== '1K' && <div className="absolute -top-2 -right-2 bg-amber-500 text-black px-1.5 py-0.5 rounded-md text-[8px] font-black">PRO</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Viewport Dimension</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex-1 flex items-center justify-center gap-4 py-5 rounded-3xl font-black text-sm border transition-all ${aspectRatio === '16:9' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-white/10 text-slate-500'}`}
                  >
                    <Monitor size={20}/> Landscape (16:9)
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex-1 flex items-center justify-center gap-4 py-5 rounded-3xl font-black text-sm border transition-all ${aspectRatio === '9:16' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-white/10 text-slate-500'}`}
                  >
                    <Smartphone size={20}/> Portrait (9:16)
                  </button>
                </div>
              </div>
            )}

            <button 
              disabled={isGenerating || (activeTab !== 'generate' && !sourceImage)}
              onClick={handleAction}
              className="w-full py-8 rounded-[2.5rem] btn-gradient text-white font-black flex items-center justify-center gap-4 text-2xl disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed shadow-[0_20px_60px_-15px_rgba(37,99,235,0.5)] hover:scale-[1.03] transition-all relative overflow-hidden group"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={32} /> 
                  Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles size={32}/> 
                  Initialize Lab Engine
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Visualization */}
        <div className="flex flex-col h-full sticky top-12">
          <div className="flex-1 glass rounded-[4rem] border border-white/10 relative overflow-hidden flex flex-col items-center justify-center bg-black/40 group p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] min-h-[600px]">
             <AnimatePresence mode="wait">
               {result || analysisResult ? (
                 <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col">
                    {activeTab === 'analyze' && analysisResult ? (
                      <div className="flex flex-col h-full space-y-10">
                        <div className="flex items-center gap-4 text-blue-400">
                          <div className="p-3 glass rounded-2xl"><FileText size={28} /></div>
                          <h3 className="font-black text-3xl tracking-tight uppercase">Intelligence Extraction</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 glass rounded-[3rem] border border-white/10 bg-slate-900/40 shadow-inner">
                          <p className="text-slate-200 font-bold leading-loose whitespace-pre-wrap text-xl italic tracking-tight">"{analysisResult}"</p>
                        </div>
                      </div>
                    ) : result ? (
                      <div className="w-full h-full flex items-center justify-center relative rounded-[3rem] overflow-hidden shadow-2xl">
                        {activeTab === 'video' ? (
                          <video src={result} controls autoPlay loop className="w-full h-full object-contain bg-black" />
                        ) : (
                          <img src={result} className="w-full h-full object-contain" />
                        )}
                        <div className="absolute top-8 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                          <a href={result} download={`omnigen_artifact_${Date.now()}`} className="p-5 glass rounded-2xl text-white hover:text-blue-400 transition-all shadow-2xl bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/10">
                            <Download size={28} />
                          </a>
                        </div>
                      </div>
                    ) : null}
                 </motion.div>
               ) : (
                 <div className="text-center space-y-12 max-w-md px-4">
                   <div className="relative">
                     {isGenerating && (
                       <motion.div 
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-40px] border-2 border-dashed border-blue-500/30 rounded-[3rem]"
                       />
                     )}
                     <div className={`w-32 h-32 rounded-[3rem] border-2 border-dashed border-white/10 flex items-center justify-center mx-auto transition-all duration-500 ${isGenerating ? 'bg-blue-600/10 border-blue-500/50 scale-125 rotate-45 shadow-[0_0_40px_rgba(37,99,235,0.2)]' : 'opacity-10 scale-100'}`}>
                        <div className={isGenerating ? '-rotate-45 transition-transform' : ''}>
                          {isGenerating ? <Loader2 size={56} className="animate-spin text-blue-400" /> : activeTab === 'video' ? <VideoIcon size={56} /> : activeTab === 'analyze' ? <Eye size={56} /> : <ImageIcon size={56} />}
                        </div>
                     </div>
                   </div>
                   <div className="space-y-6">
                     <p className="text-3xl font-black text-white uppercase tracking-tighter">{isGenerating ? 'Processing Fabric' : 'Lab Standby'}</p>
                     <div className="h-12 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.p 
                            key={loadingStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-slate-500 font-black tracking-widest text-xs uppercase"
                          >
                            {isGenerating ? LOADING_MESSAGES[loadingStep] : 'Awaiting initialization sequence...'}
                          </motion.p>
                        </AnimatePresence>
                     </div>
                   </div>
                 </div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
