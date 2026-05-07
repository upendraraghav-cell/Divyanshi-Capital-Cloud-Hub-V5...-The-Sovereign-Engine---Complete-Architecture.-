/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Smile, 
  Cpu, 
  MessageCircle, 
  Save, 
  RefreshCw, 
  Eye,
  Camera,
  Layers,
  Palette,
  Type,
  Brain,
  Zap,
  Volume2,
  Gauge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { sariService } from '@/services/sariService';

const AVATAR_TEMPLATES = [
  { id: 'bulbul-prime', name: 'Bulbul Prime', seed: 'Bulbul', desc: 'Professional financial advisor persona.' },
  { id: 'jarvis-dark', name: 'Strategic Node', seed: 'Jarvis', desc: 'Minimalist tech-first aesthetic.' },
  { id: 'sophia-soft', name: 'Support Pulse', seed: 'Sophia', desc: 'Empathetic and friendly customer care.' },
  { id: 'titan-bold', name: 'Sales Titan', seed: 'Titan', desc: 'Aggressive, results-oriented lead closer.' },
];

const PERSONALITIES = [
  'Professional & Strategic',
  'Friendly & Empathetic',
  'Technical & Direct',
  'Playful & Engaging',
  'Sovereign & Commanding'
];

export function AvatarControl() {
  const [selectedTemplate, setSelectedTemplate] = useState('bulbul-prime');
  const [avatarName, setAvatarName] = useState('BULBUL');
  const [personality, setPersonality] = useState('Professional & Strategic');
  const [voiceLang, setVoiceLang] = useState('hi-IN');
  
  // Behavioral Parameters
  const [toneIntensity, setToneIntensity] = useState([70]); // 0: Technical, 100: Conversational
  const [emotionalPulse, setEmotionalPulse] = useState([50]);
  const [reasoningDepth, setReasoningDepth] = useState([85]);
  const [sovereignAuthority, setSovereignAuthority] = useState([90]);

  React.useEffect(() => {
    const b = sariService.currentBehavior;
    setAvatarName(b.name);
    setPersonality(b.personality);
    setVoiceLang(b.voiceLang);
    setToneIntensity([b.tone]);
    setEmotionalPulse([b.emotion]);
    setReasoningDepth([b.reasoning]);
    setSovereignAuthority([b.authority]);
  }, []);

  const currentSeed = AVATAR_TEMPLATES.find(t => t.id === selectedTemplate)?.seed || 'Bulbul';
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${currentSeed}`;

  const handleSave = () => {
    // Update SARI Engine behavioral context
    sariService.updateBehavior({
      name: avatarName,
      personality,
      voiceLang,
      tone: toneIntensity[0],
      emotion: emotionalPulse[0],
      reasoning: reasoningDepth[0],
      authority: sovereignAuthority[0]
    });
    
    toast.success(`Sovereign Matrix updated. SARI identity synchronized.`);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Avatar <span className="text-orange-500">Control</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Configure your Workspace UI Agent (BULBUL) identity.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="border-white/10 text-white font-black uppercase text-[10px] rounded-xl h-12 px-6">
              Preview Chatbot
           </Button>
           <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-[10px] rounded-xl h-12 px-8 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <Save className="w-4 h-4 mr-2" /> Save configuration
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Identity Config */}
        <Card className="lg:col-span-2 bg-[#0a0a0f] border-white/5 shadow-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
           <CardHeader className="p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Palette className="w-6 h-6" />
                 </div>
                 <div>
                    <CardTitle className="text-xl font-black italic text-white uppercase tracking-tight">Identity Designer</CardTitle>
                    <CardDescription className="text-slate-500 font-bold uppercase text-[9px]">Neural Profile Customization</CardDescription>
                 </div>
              </div>
           </CardHeader>
           <CardContent className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Agent Name</Label>
                       <div className="relative">
                          <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <Input 
                            value={avatarName} 
                            onChange={(e) => setAvatarName(e.target.value)}
                            className="bg-white/5 border-white/10 h-14 pl-12 text-white font-black italic rounded-2xl" 
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Neural Personality</Label>
                       <Select value={personality} onValueChange={setPersonality}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-14 text-white font-bold rounded-2xl">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0a0a0f] border-white/10 text-white font-bold italic uppercase text-[10px]">
                             {PERSONALITIES.map(p => (
                               <SelectItem key={p} value={p} className="focus:bg-orange-500 focus:text-white">{p}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="space-y-3">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Voice Language preference</Label>
                       <Select value={voiceLang} onValueChange={setVoiceLang}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-14 text-white font-bold rounded-2xl">
                             <div className="flex items-center gap-2">
                                <Volume2 className="w-4 h-4 text-orange-500" />
                                <SelectValue />
                             </div>
                          </SelectTrigger>
                          <SelectContent className="bg-[#0a0a0f] border-white/10 text-white font-bold italic uppercase text-[10px]">
                             <SelectItem value="hi-IN" className="focus:bg-orange-500 focus:text-white">Hindi/English (Bilingual)</SelectItem>
                             <SelectItem value="en-US" className="focus:bg-orange-500 focus:text-white">English (US)</SelectItem>
                             <SelectItem value="en-IN" className="focus:bg-orange-500 focus:text-white">English (India)</SelectItem>
                             <SelectItem value="ta-IN" className="focus:bg-orange-500 focus:text-white">Tamil</SelectItem>
                             <SelectItem value="te-IN" className="focus:bg-orange-500 focus:text-white">Telugu</SelectItem>
                             <SelectItem value="hi-HI" className="focus:bg-orange-500 focus:text-white">Pure Hindi</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="space-y-3 pt-4">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic mb-4">Core Visual Template</p>
                       <div className="grid grid-cols-2 gap-4">
                          {AVATAR_TEMPLATES.map((tmpl) => (
                            <button
                              key={tmpl.id}
                              onClick={() => setSelectedTemplate(tmpl.id)}
                              className={cn(
                                "p-4 rounded-2xl border text-left transition-all group relative overflow-hidden",
                                selectedTemplate === tmpl.id ? "bg-orange-500/10 border-orange-500" : "bg-white/5 border-white/10 hover:border-white/20"
                              )}
                            >
                               <p className={cn("text-[10px] font-black uppercase italic tracking-tighter", selectedTemplate === tmpl.id ? "text-orange-500" : "text-white")}>{tmpl.name}</p>
                               <p className="text-[8px] text-slate-500 font-bold uppercase mt-1 leading-tight">{tmpl.desc}</p>
                               {selectedTemplate === tmpl.id && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-[32px] border border-white/5 relative group">
                    <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-white/5 overflow-hidden shadow-2xl mb-8 relative z-10 transition-transform group-hover:scale-105 duration-500">
                       <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover p-4" />
                    </div>
                    <div className="text-center relative z-10">
                       <Badge className="bg-orange-500/10 text-orange-500 border-none text-[8px] font-black uppercase px-3 py-1 mb-2">Live AI Matrix</Badge>
                       <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">{avatarName}</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">{personality}</p>
                    </div>
                 </div>
              </div>

               {/* Behavioral Matrix */}
               <div className="pt-10 border-t border-white/5">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Gauge className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black italic text-white uppercase tracking-tight">Behavioral Matrix</h4>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">Advanced Neural Parameters</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-8">
                         {/* Tone Intensity */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Tone Intensity</Label>
                              <span className="text-[10px] font-black text-blue-500 uppercase">{toneIntensity[0] > 50 ? 'Conversational' : 'Technical'}</span>
                           </div>
                           <input 
                             type="range"
                             value={toneIntensity[0]} 
                             onChange={(e) => setToneIntensity([parseInt(e.target.value)])} 
                             max="100" 
                             step="1" 
                             className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                           />
                           <div className="flex justify-between text-[8px] font-black uppercase text-slate-600">
                              <span>Binary/Code</span>
                              <span>Natural Flow</span>
                           </div>
                        </div>

                        {/* Emotional Pulse */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Emotional Pulse</Label>
                              <span className="text-[10px] font-black text-purple-500 uppercase">{emotionalPulse[0]}% Spectrum</span>
                           </div>
                           <input 
                             type="range"
                             value={emotionalPulse[0]} 
                             onChange={(e) => setEmotionalPulse([parseInt(e.target.value)])} 
                             max="100" 
                             step="1" 
                             className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                           />
                           <div className="flex justify-between text-[8px] font-black uppercase text-slate-600">
                              <span>Stoic Node</span>
                              <span>High Empathy</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        {/* Reasoning Depth */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Reasoning Depth</Label>
                              <span className="text-[10px] font-black text-emerald-500 uppercase">{reasoningDepth[0] > 70 ? 'Deep Strategic' : 'Fast Reactive'}</span>
                           </div>
                           <input 
                             type="range"
                             value={reasoningDepth[0]} 
                             onChange={(e) => setReasoningDepth([parseInt(e.target.value)])} 
                             max="100" 
                             step="1" 
                             className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                           />
                           <div className="flex justify-between text-[8px] font-black uppercase text-slate-600">
                              <span>Direct Response</span>
                              <span>Chain-of-Thought</span>
                           </div>
                        </div>

                        {/* Sovereign Authority */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Sovereign Authority</Label>
                              <span className="text-[10px] font-black text-orange-500 uppercase">{sovereignAuthority[0]}% Override</span>
                           </div>
                           <input 
                             type="range"
                             value={sovereignAuthority[0]} 
                             onChange={(e) => setSovereignAuthority([parseInt(e.target.value)])} 
                             max="100" 
                             step="1" 
                             className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                           />
                           <div className="flex justify-between text-[8px] font-black uppercase text-slate-600">
                              <span>Co-Pilot</span>
                              <span>Full Sovereign</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
           </CardContent>
        </Card>

        {/* Feature Checkpoints */}
        <div className="space-y-6">
           <Card className="bg-[#0a0a0f] border-white/5 shadow-2xl">
              <CardHeader className="pb-4">
                 <CardTitle className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-500" />
                    Neural Capabilities
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 {[
                   { label: 'Voice Interaction', enabled: true },
                   { label: 'Emotional Pulse', enabled: true },
                   { label: 'Proactive Dialing', enabled: false },
                   { label: 'Neural Scraping', enabled: true },
                   { label: 'Multi-lingual Support', enabled: true }
                 ].map((cap, i) => (
                   <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] font-black uppercase text-slate-400">{cap.label}</span>
                      <Badge className={cn(
                        "text-[8px] font-black px-2 py-0.5",
                        cap.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/20 text-slate-600'
                      )}>
                        {cap.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                   </div>
                 ))}
                 <Button variant="outline" className="w-full border-white/10 text-[9px] font-black uppercase tracking-widest h-10 mt-2">Modify Cognitive Layers</Button>
              </CardContent>
           </Card>

           <Card className="bg-[#0a0a0f] border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                 <Sparkles className="w-8 h-8 text-orange-500/20 group-hover:text-orange-500/40 transition-colors" />
              </div>
              <CardContent className="p-8">
                 <h4 className="text-sm font-black text-white uppercase italic mb-2">Agent Sovereignty</h4>
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                   Every subscriber gets their own {avatarName}. They can choose their face, name, and personality to match their brand DNA.
                 </p>
                 <div className="mt-6 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500">
                       <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                       <p className="text-[9px] font-black text-white uppercase">Integration Loop</p>
                       <p className="text-[8px] text-slate-500 font-bold uppercase">Linked to WhatsApp Cloud API</p>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
