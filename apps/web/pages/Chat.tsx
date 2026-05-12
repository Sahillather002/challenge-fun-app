
import React, { useState, useRef, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { 
  Send, Settings, Trash2, Copy, RefreshCw, Cpu, User, StopCircle, 
  MapPin, Globe, ExternalLink, Mic, MicOff, Volume2, VolumeX, Loader2, Search
} from 'lucide-react';
import { ChatSettings, Message } from '../types';
import { MODELS } from '../constants';
import { createChatStream } from '../services/geminiService';
import { GoogleGenAI, Modality } from '@google/genai';

const motion = motionBase as any;

// Helper functions for base64 encoding/decoding as required by API rules
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live API State
  const [isLive, setIsLive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const [settings, setSettings] = useState<ChatSettings & { useSearch: boolean }>({
    model: 'gemini-3-pro-preview',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    systemPrompt: 'You are OmniGen, a world-class AI agent. Provide accurate, helpful, and concise responses.',
    stream: true,
    useMaps: false,
    useSearch: false
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, liveTranscript]);

  const toggleLiveMode = async () => {
    if (isLive) {
      if (liveSessionRef.current) {
        liveSessionRef.current.close();
      }
      setIsLive(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              audioSourcesRef.current.add(source);
              source.onended = () => audioSourcesRef.current.delete(source);
            }

            if (message.serverContent?.outputTranscription) {
              setLiveTranscript(prev => prev + message.serverContent.outputTranscription.text);
            }

            if (message.serverContent?.turnComplete) {
              setLiveTranscript('');
            }

            if (message.serverContent?.interrupted) {
              audioSourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsLive(false),
          onerror: () => setIsLive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
        }
      });
      
      liveSessionRef.current = await sessionPromise;
    } catch (e) {
      console.error("Live API Session Initialization Failed:", e);
      alert("Failed to connect to Live API. Please check your microphone and API configuration.");
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const assistantMsgId = `${Date.now() + 1}-${Math.random().toString(36).substr(2, 5)}`;
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    }]);

    try {
      await createChatStream(settings, [...messages, userMessage], (text, grounding) => {
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId ? { ...msg, content: text, groundingLinks: grounding } : msg
        ));
      });
    } catch (error) {
       setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId ? { ...msg, content: 'Communication error with inference engine. Please retry.' } : msg
        ));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full bg-[#020617]">
      {/* Settings Sidebar */}
      <div className={`
        ${showSettings ? 'w-80' : 'w-0 overflow-hidden'} 
        transition-all duration-300 glass border-r border-white/5 h-full hidden lg:block
      `}>
        <div className="p-8 space-y-10 min-w-[320px]">
          <h2 className="text-xl font-black flex items-center gap-3">
            <Settings size={22} className="text-blue-400" /> Control Hub
          </h2>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Inference Engine</label>
              <select 
                value={settings.model}
                disabled={settings.useMaps}
                onChange={(e) => setSettings({...settings, model: e.target.value})}
                className="w-full glass rounded-2xl px-5 py-4 outline-none border border-white/5 focus:border-blue-500/50 disabled:opacity-50 font-bold text-sm bg-slate-900/50"
              >
                {MODELS.filter(m => m.id.includes('gemini-3')).map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>)}
              </select>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Grounding Tools</label>
               <div className="flex items-center justify-between p-5 glass rounded-2xl border border-white/5 bg-slate-900/30">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl glass ${settings.useMaps ? 'text-blue-400' : 'text-slate-600'}`}>
                    <MapPin size={20} />
                  </div>
                  <span className="font-bold text-sm">Google Maps</span>
                </div>
                <button 
                  onClick={() => setSettings({...settings, useMaps: !settings.useMaps, useSearch: false})}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.useMaps ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${settings.useMaps ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 glass rounded-2xl border border-white/5 bg-slate-900/30">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl glass ${settings.useSearch ? 'text-blue-400' : 'text-slate-600'}`}>
                    <Search size={20} />
                  </div>
                  <span className="font-bold text-sm">Web Search</span>
                </div>
                <button 
                  onClick={() => setSettings({...settings, useSearch: !settings.useSearch, useMaps: false})}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.useSearch ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${settings.useSearch ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temperature</label>
                <span className="text-xs text-blue-400 font-black">{settings.temperature}</span>
              </div>
              <input type="range" min="0" max="1" step="0.1" value={settings.temperature} onChange={(e) => setSettings({...settings, temperature: parseFloat(e.target.value)})} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>

            <button onClick={() => setMessages([])} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all font-black text-sm uppercase tracking-widest">
              <Trash2 size={18} /> Wipe Session
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full">
        <div className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 z-10 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cpu size={20} className="text-white" />
            </div>
            <div>
              <div className="font-black text-sm tracking-tight">Intelligence Playground</div>
              <div className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] flex items-center gap-2">
                {settings.useMaps ? <><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Maps Bridge</> : settings.useSearch ? <><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Search Grounding</> : <><div className="w-1.5 h-1.5 rounded-full bg-slate-700" /> Standard Mode</>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLiveMode}
              className={`flex items-center gap-2 px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isLive ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'glass border border-white/10 text-slate-400 hover:text-white'}`}
            >
              {isLive ? <Mic size={14} /> : <MicOff size={14} />}
              {isLive ? 'Live Voice' : 'Voice Mode'}
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className={`p-2.5 rounded-xl glass border border-white/5 transition-all ${showSettings ? 'text-blue-400 border-blue-500/30' : 'text-slate-400'}`}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 pb-40 custom-scrollbar">
          {messages.length === 0 && !isLive && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20">
               <div className="w-32 h-32 rounded-[3rem] glass border-2 border-white/10 flex items-center justify-center">
                  <Globe size={64} className="text-slate-400" />
               </div>
               <div className="max-w-sm space-y-4">
                  <h3 className="text-3xl font-black tracking-tighter">OMNIGEN CORE</h3>
                  <p className="text-lg font-medium leading-relaxed italic">Multimodal reasoning deployed at the edge. Initialize input to begin synthesis.</p>
               </div>
            </div>
          )}

          {isLive && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full space-y-10">
               <div className="relative">
                  <div className="absolute inset-[-40px] bg-blue-600/20 rounded-full blur-[60px] animate-pulse" />
                  <div className="w-40 h-40 rounded-full glass border-4 border-white/10 flex items-center justify-center relative z-10 p-4">
                     <div className="w-full h-full rounded-full btn-gradient flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                        <Volume2 size={64} className="text-white animate-bounce" />
                     </div>
                  </div>
               </div>
               <div className="max-w-xl text-center px-8 space-y-6">
                  <h4 className="text-2xl font-black text-white tracking-tight">Listening to User Input</h4>
                  <div className="glass p-8 rounded-[2rem] border border-white/5 bg-slate-900/40">
                    <p className="text-blue-300 font-bold italic text-xl leading-relaxed">"{liveTranscript || "OmniGen is waiting for your voice command..."}"</p>
                  </div>
               </div>
            </motion.div>
          )}

          {!isLive && messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center flex-shrink-0 shadow-xl shadow-blue-500/20 mt-1">
                  <Cpu size={24} className="text-white" />
                </div>
              )}
              <div className="max-w-[80%] space-y-4">
                <div className={`p-8 rounded-[2.5rem] shadow-2xl relative group ${msg.role === 'user' ? 'btn-gradient text-white rounded-tr-none' : 'glass border border-white/10 text-slate-200 rounded-tl-none bg-slate-900/30'}`}>
                  <div className="text-lg leading-loose whitespace-pre-wrap font-medium">{msg.content}</div>
                </div>
                {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3 px-2">
                    {msg.groundingLinks.map((chunk: any, i: number) => {
                      const link = chunk.maps || chunk.web;
                      if (!link) return null;
                      return (
                        <a 
                          key={i} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-3 px-4 py-2 glass border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-400/10 transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                          {chunk.maps ? <MapPin size={12} className="text-blue-500" /> : <Globe size={12} className="text-emerald-500" />}
                          {link.title || (chunk.maps ? 'Location Context' : 'Web Source')}
                          <ExternalLink size={10} className="opacity-40" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center flex-shrink-0 mt-1 bg-slate-900/40">
                  <User size={24} className="text-slate-400" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center animate-pulse shadow-xl shadow-blue-500/20">
                <Cpu size={24} className="text-white" />
              </div>
              <div className="glass border border-white/10 p-8 rounded-[2.5rem] rounded-tl-none bg-slate-900/30">
                 <div className="flex gap-3">
                    {[0, 0.2, 0.4].map(delay => (
                      <motion.div 
                        key={delay} 
                        animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }} 
                        transition={{ duration: 0.8, repeat: Infinity, delay }} 
                        className="w-3 h-3 bg-blue-500/60 rounded-full" 
                      />
                    ))}
                 </div>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {!isLive && (
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
              <div className="max-w-4xl mx-auto glass rounded-[2.5rem] border border-white/10 p-3 flex items-end gap-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-slate-900/40 backdrop-blur-3xl">
                <textarea 
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                  placeholder={settings.useMaps ? "Explore local coordinates and business data..." : settings.useSearch ? "Ground response in real-time web news..." : "Synthesize new intelligence output..."}
                  className="flex-1 bg-transparent border-none outline-none p-5 text-slate-200 resize-none max-h-48 font-bold text-lg placeholder:text-slate-600 custom-scrollbar"
                />
                <button 
                  disabled={!input.trim() || isTyping} 
                  onClick={handleSend} 
                  className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${input.trim() ? 'btn-gradient text-white shadow-2xl shadow-blue-500/30' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                >
                  {isTyping ? <Loader2 size={32} className="animate-spin" /> : <Send size={32} className={input.trim() ? 'translate-x-0.5' : ''} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
