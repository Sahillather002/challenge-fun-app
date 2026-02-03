
import React, { useRef, useMemo } from 'react';
import { motion as motionBase, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  ChevronDown, 
  Activity, 
  Database, 
  Network,
  Cpu,
  Globe,
  Shield,
  BarChart3
} from 'lucide-react';

const motion = motionBase as any;

interface LandingProps {
  onStart: () => void;
}

const QuantumSphere = () => {
  return (
    <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center overflow-visible select-none pointer-events-none">
      {/* Deep Background Glow */}
      <div className="absolute w-[120%] h-[120%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute w-full h-full bg-purple-600/5 rounded-full blur-[100px]" />

      <div className="relative w-full h-full flex items-center justify-center perspective-1000">
        
        {/* Rotating Outer Ring A */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[95%] h-[95%] border border-blue-500/10 rounded-full"
        />

        {/* Rotating Outer Ring B */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[85%] h-[85%] border border-white/5 rounded-full border-dashed"
        />

        {/* Animated Data Nodes Orbiting */}
        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={`orbit-${i}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: i * 2 }}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 20px rgba(59,130,246,0.2)",
                  "0 0 40px rgba(59,130,246,0.4)",
                  "0 0 20px rgba(59,130,246,0.2)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 glass border border-blue-400/40 rounded-2xl flex items-center justify-center text-blue-400 shadow-2xl backdrop-blur-xl"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: i * 2 }}
              >
                {i === 0 ? <Database size={22} /> : i === 1 ? <Network size={22} /> : i === 2 ? <Cpu size={22} /> : <Activity size={22} />}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}

        {/* Core Visualization */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Pulsing Core Rings */}
          {[1, 2, 3].map((r) => (
            <motion.div
              key={r}
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.1, 0.3],
                rotate: r % 2 === 0 ? 360 : -360
              }}
              transition={{ duration: 5 + r, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 border border-blue-500/30 rounded-full"
              style={{ padding: r * 12 }}
            />
          ))}

          {/* Core Singularity */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 rounded-full glass border-2 border-white/20 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.3)] relative overflow-hidden group"
          >
            {/* Internal Light Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20" />
            
            {/* Central Lightning Icon */}
            <Zap size={64} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10" fill="white" />

            {/* Scanning Ring */}
            <motion.div
              animate={{ 
                top: ["-100%", "200%"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent blur-md"
            />
          </motion.div>
        </div>

        {/* Orbiting Satellite Dots */}
        <svg className="absolute w-full h-full overflow-visible opacity-40">
           <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 8" />
           <motion.circle 
              cx="50%" cy="50%" r="48%" 
              fill="none" stroke="white" strokeWidth="2" 
              strokeDasharray="1 1000"
              animate={{ strokeDashoffset: [0, 1000] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
           />
        </svg>

      </div>
    </div>
  );
};

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 40);
    mouseY.set((clientY / innerHeight - 0.5) * 40);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden pt-12"
    >
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .text-glow { text-shadow: 0 0 30px rgba(255,255,255,0.1); }
        .grid-bg {
          background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-40" />

      <section className="relative min-h-[calc(100vh-64px)] flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 lg:px-20 py-12 lg:py-0 max-w-8xl mx-auto gap-12 lg:gap-20">
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-20 flex-1 text-center lg:text-left order-2 lg:order-1"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-white/10 mb-8 shadow-xl backdrop-blur-xl"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-400">OmniFabric v3.1 Engine</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl lg:text-[72px] font-black mb-6 tracking-tighter leading-[1] text-white text-glow"
          >
            UNIVERSAL <br />
            <span className="text-gradient">AUTONOMY</span> <br />
            ARCHITECTURE
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-lg lg:text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
          >
            The production environment for multimodal agents. <br className="hidden md:block" /> 
            Orchestrate agentic workflows with native video, voice, and vision.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button 
              onClick={onStart}
              className="px-10 py-5 rounded-2xl btn-gradient text-white font-black flex items-center justify-center gap-3 text-lg group relative overflow-hidden shadow-xl hover:scale-105 transition-all"
            >
              Initialize Engine <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button className="px-10 py-5 rounded-2xl glass text-white font-black hover:bg-white/10 transition-all text-lg border border-white/10">
              Architecture
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, y: yParallax }}
          className="relative z-10 flex-1 flex items-center justify-center order-1 lg:order-2 overflow-visible"
        >
          <QuantumSphere />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-20"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      <section className="py-24 relative px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tighter uppercase">ENGINEERED FOR <br/><span className="text-blue-500">PEAK INFERENCE</span></h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-8">Deploy globally with single-digit latency. Our distributed fabric ensures your agents respond instantly, anywhere in the world.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-5 rounded-2xl border border-white/10">
                <div className="text-2xl font-black text-white">142ms</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Avg Global Latency</div>
              </div>
              <div className="glass p-5 rounded-2xl border border-white/10">
                <div className="text-2xl font-black text-white">99.99%</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Uptime SLA</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
             <div className="absolute inset-0 bg-blue-500/5 blur-[80px] rounded-full" />
             <div className="glass p-3 rounded-[2rem] border border-white/10 shadow-2xl relative z-10">
                <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1200" className="rounded-[1.5rem] w-full aspect-video object-cover grayscale opacity-40 hover:opacity-60 transition-opacity" />
             </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-16 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex items-center justify-center gap-2 mb-6">
             <Zap className="text-blue-500" fill="currentColor" size={24} />
             <span className="text-2xl font-black tracking-tighter text-white">OMNIGEN</span>
           </div>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">© 2024 OmniGen AI. Distributed Intelligence Fabric.</p>
        </div>
      </footer>
    </div>
  );
};
