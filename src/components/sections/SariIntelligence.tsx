/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Terminal, 
  Search, 
  Brain, 
  Cpu, 
  Network, 
  ShieldCheck, 
  Activity, 
  Play, 
  Maximize2,
  Settings2,
  Wand2,
  Command,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Mic,
  Volume2,
  Send,
  FileText,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { sariService } from '@/services/sariService';

const AI_MODELS = [
  { id: 'gpt4o', name: 'GPT-4o (Omni)', region: 'Global', latency: '400ms', status: 'Optimal' },
  { id: 'claude35', name: 'Claude 3.5 Sonnet', region: 'Global', latency: '650ms', status: 'Optimal' },
  { id: 'gemini_pro', name: 'Gemini Pro 1.5', region: 'Asia-South', latency: '350ms', status: 'Peak' },
  { id: 'mallik_v3', name: 'Mallik Core V3', region: 'Local Node', latency: '20ms', status: 'Operational' },
];

const COMMANDS = [
  { trigger: '/audit', desc: 'Scan all P-workspaces for TAT breaches.', group: 'V3 Core' },
  { trigger: '/provision', desc: 'Auto-create new tenant node.', group: 'V3 Core' },
  { trigger: '/heal', desc: 'Trigger LAILA auto-fix on broken webhooks.', group: 'V2 System' },
  { trigger: '/report', desc: 'Generate 24h MIS PDF and send to MD.', group: 'V3 Core' },
  { trigger: '/broadcast', desc: 'Launch WhatsApp template to filtered segment.', group: 'P1 Apps' },
  { trigger: '/research', desc: 'Deep research client CIBIL via neural scrapper.', group: 'V3 Core' }
];

const MASTER_PROMPTS = [
  { id: 'p1', name: 'Strategic Expansion', trigger: 'Sovereign_Growth_V3', category: 'Growth' },
  { id: 'p2', name: 'Risk Mitigation', trigger: 'Bhishm_Sanctity_Check', category: 'Security' },
  { id: 'p3', name: 'Revenue Maximizer', trigger: 'Project_Mallik_Yield', category: 'Finance' },
];

interface Message {
  id: string;
  text: string;
  type: 'maalik' | 'sari';
  timestamp: Date;
}

export function SariIntelligence() {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'SARI V5.8 [ACTIVE]. Sovereign Handshake complete. Maalik, command dijiye.', type: 'sari', timestamp: new Date() }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initializing Sovereign Auto-Connect
    const initConfig = async () => {
      try {
        await sariService.refreshSovereignConfig();
      } catch (e) {
        console.error("SARI: Handshake failure", e);
      }
    };
    initConfig();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isActive]);

  const runBackgroundConsensus = async (cmd: string) => {
    setIsActive(true);
    
    // Add Maalik's message if not already there
    const maalikMsg: Message = {
      id: `maalik-${Date.now()}-${Math.random()}`,
      text: cmd,
      type: 'maalik',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, maalikMsg]);

    try {
      const reply = await sariService.processCommand(cmd);
      const sariMsg: Message = {
        id: `sari-${Date.now()}-${Math.random()}`,
        text: reply,
        type: 'sari',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, sariMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: `err-${Date.now()}-${Math.random()}`,
        text: "SARI_ERROR: Neural bridge disconnected.",
        type: 'sari',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsActive(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    runBackgroundConsensus(query);
    setQuery('');
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">SARI <span className="text-[#00ffd5]">Sovereign V5.8</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Sovereign Artificial Research Intelligence — Mallik Auto-Connect Layer</p>
        </div>
        <div className="flex gap-4">
           <Badge className="bg-[#00ffd5]/10 text-[#00ffd5] border-none px-4 py-2 flex items-center gap-2">
             <Activity className="w-4 h-4 animate-pulse" />
             Strategic Layer Active
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Interface - Teal/Dark Style */}
        <Card className="lg:col-span-2 bg-black border-white/10 shadow-2xl overflow-hidden relative border-b-[#00ffd5]/30">
           {/* Background Gradient similar to provided HTML */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0b2a2e_0%,#02070c_55%,#000_100%)] pointer-events-none" />
           
           <CardHeader className="p-4 bg-[rgba(7,94,84,0.8)] backdrop-blur-md border-b border-[#00ffd5]/20 relative z-10 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-[#00ffd5] border border-[#00ffd5]/20">
                    <Brain className="w-6 h-6" />
                 </div>
                 <div>
                    <CardTitle className="text-base font-black italic uppercase text-white tracking-tight">SARI SOVEREIGN STUDIO</CardTitle>
                    <CardDescription className="text-emerald-400/70 font-bold uppercase text-[8px]">MD Strategic Command Node</CardDescription>
                 </div>
              </div>
              <div className="flex gap-2">
                 <Badge className="bg-white/5 text-emerald-400 border-white/10 text-[8px] font-black uppercase px-2 py-1">MAALIK AUTHENTICATED</Badge>
              </div>
           </CardHeader>

           <CardContent className="p-0 flex flex-col h-[650px] relative z-10">
              {/* Chat Viewport */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                 {messages.map((msg) => (
                   <div 
                    key={msg.id} 
                    className={cn(
                      "flex flex-col max-w-[85%] sm:max-w-[70%]",
                      msg.type === 'maalik' ? "ml-auto" : "mr-auto"
                    )}
                   >
                     <div className={cn(
                       "p-4 rounded-2xl backdrop-blur-md transition-all text-sm font-medium leading-relaxed",
                       msg.type === 'maalik' 
                        ? "bg-[rgba(5,97,98,0.7)] border border-[#00ffd5]/25 text-white shadow-lg" 
                        : "bg-[rgba(32,44,51,0.7)] border border-slate-500/50 text-white"
                     )}>
                        {msg.text}
                     </div>
                     <span className={cn(
                       "text-[8px] font-bold uppercase mt-1 px-2 text-slate-500",
                       msg.type === 'maalik' ? "text-right" : "text-left"
                     )}>
                       {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                   </div>
                 ))}
                 
                 {isActive && (
                    <div className="flex flex-col mr-auto max-w-[70%]">
                       <div className="p-4 rounded-2xl bg-[rgba(32,44,51,0.7)] border border-slate-500/50 flex items-center gap-3">
                          <div className="flex gap-1">
                             <span className="w-1.5 h-1.5 bg-[#00ffd5] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                             <span className="w-1.5 h-1.5 bg-[#00ffd5] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                             <span className="w-1.5 h-1.5 bg-[#00ffd5] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </div>
                          <span className="text-[10px] font-black uppercase text-[#00ffd5]/70 italic tracking-widest">SARI IS SYNTHESIZING...</span>
                       </div>
                    </div>
                 )}
                 <div ref={chatEndRef} />
              </div>

              {/* Master AI URL Hub (SARI FOLDER) */}
              <div className="p-4 mx-6 mb-4 rounded-2xl bg-black/60 border border-[#00ffd5]/10 shadow-xl">
                 <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                       <Play className="w-3 h-3 text-[#00ffd5] fill-[#00ffd5]" />
                       <span className="text-[9px] font-black uppercase text-[#00ffd5] tracking-widest italic">SOVEREIGN REGISTRY LINKS</span>
                    </div>
                    <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">EXTERNAL DATA INTAKE</span>
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                    <a 
                      href="https://docs.google.com/forms/d/1cVEp6bUp4JR_yivEwh-HGHvtaCKCl3DTYpRW9PSiRXI/viewform" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col items-center gap-1 group/link"
                    >
                       <FileText className="w-4 h-4 text-emerald-500 group-hover/link:scale-110 transition-transform" />
                       <span className="text-[8px] font-black text-white uppercase italic">Client Form</span>
                    </a>
                    <a 
                      href="https://docs.google.com/forms/d/1SaFxHlCu3GN6Udhxb4hW81RagBpAP-91En-tlNYiKl4/viewform" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all flex flex-col items-center gap-1 group/link"
                    >
                       <Zap className="w-4 h-4 text-blue-500 group-hover/link:scale-110 transition-transform" />
                       <span className="text-[8px] font-black text-white uppercase italic">Sales Form</span>
                    </a>
                    <a 
                      href="https://docs.google.com/forms/d/1xR-UyH8LXvAEacGXL8ZQA7nS7hJds2zlMtzxr6iiuGs/viewform" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all flex flex-col items-center gap-1 group/link"
                    >
                       <User className="w-4 h-4 text-purple-500 group-hover/link:scale-110 transition-transform" />
                       <span className="text-[8px] font-black text-white uppercase italic">HR Matrix</span>
                    </a>
                 </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[rgba(17,27,33,0.9)] backdrop-blur-md border-t border-[#00ffd5]/10">
                 <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto items-center">
                    <div className="relative flex-1">
                       <Input 
                         placeholder="Type command, Maalik..." 
                         value={query}
                         onChange={(e) => setQuery(e.target.value)}
                         className="bg-[rgba(42,57,66,0.8)] border border-[#00ffd5]/20 h-12 pl-6 pr-12 text-white font-medium rounded-3xl focus:border-[#00ffd5] focus:ring-1 focus:ring-[#00ffd5]/50 transition-all placeholder:text-slate-500"
                       />
                       <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <Mic className="w-4 h-4 text-slate-500 hover:text-[#00ffd5] cursor-pointer" />
                       </div>
                    </div>
                    <button 
                      type="submit" 
                      className="w-12 h-12 rounded-full bg-[#00ffd5] flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,255,213,0.3)] hover:scale-105 active:scale-95 transition-all"
                    >
                       <Send className="w-5 h-5 translate-x-0.5 -translate-y-0.5" />
                    </button>
                 </form>
              </div>
           </CardContent>
        </Card>

        {/* Intelligence Sidebars */}
        <div className="space-y-8">
           {/* Master Prompts */}
           <Card className="bg-[#0a0a0f] border-white/5 shadow-2xl overflow-hidden relative border-r-purple-500/20 border-r-2">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Sparkles size={80} className="text-purple-500" />
              </div>
              <CardHeader className="pb-4">
                 <CardTitle className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-purple-500" />
                    Sovereign Master Prompts
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 relative z-10">
                 {MASTER_PROMPTS.map((p) => (
                   <button 
                    key={p.id}
                    onClick={() => { setQuery(p.trigger); setActivePrompt(p.id); runBackgroundConsensus(p.trigger); }}
                    className={cn(
                      "w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group",
                      activePrompt === p.id ? "bg-purple-500/10 border-purple-500" : "bg-white/5 border-white/5 hover:border-purple-500/30"
                    )}
                   >
                      <div>
                        <p className="text-[10px] font-black text-white uppercase">{p.name}</p>
                        <p className="text-[8px] text-slate-500 uppercase">{p.category} Layer</p>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center text-slate-500 group-hover:text-purple-400">
                         <Play className="w-3 h-3 translate-x-0.5" />
                      </div>
                   </button>
                 ))}
              </CardContent>
           </Card>

           {/* Strategic Commands */}
           <Card className="bg-[#0a0a0f] border-white/5 shadow-2xl border-r-orange-500/20 border-r-2">
               <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    Strategic Commands
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  {COMMANDS.map((cmd) => (
                    <button 
                      key={cmd.trigger}
                      onClick={() => { setQuery(cmd.trigger); runBackgroundConsensus(cmd.trigger); }}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/5 hover:border-orange-500/30 text-left transition-all group"
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono text-orange-400 group-hover:text-orange-300">
                         <span>{cmd.trigger}</span>
                         <Badge className="bg-white/5 text-[8px] text-slate-600 border-none group-hover:text-slate-400">{cmd.group}</Badge>
                      </div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 leading-relaxed">{cmd.desc}</p>
                    </button>
                  ))}
               </CardContent>
           </Card>

           {/* Model Status */}
           <Card className="bg-[#0a0a0f] border-white/5 shadow-2xl border-r-blue-500/20 border-r-2">
              <CardHeader className="pb-4">
                 <CardTitle className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Network className="w-4 h-4 text-blue-500" />
                    Neural Hub Registry
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 {AI_MODELS.map((model) => (
                   <div key={model.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black text-white uppercase tracking-tighter">{model.name}</p>
                         <p className="text-[8px] text-slate-500 uppercase font-black">{model.region} • {model.latency}</p>
                      </div>
                      <Badge className={cn(
                        "text-[8px] font-black border-0 px-2",
                        model.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                      )}>
                        {model.status}
                      </Badge>
                   </div>
                 ))}
                 <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5">Settings</Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
