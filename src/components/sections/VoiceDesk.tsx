/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Volume2, 
  Headphones, 
  Brain, 
  Sparkles, 
  Clock, 
  Save, 
  Trash2, 
  Maximize2,
  Phone,
  MessageSquare,
  Zap,
  Waves
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const recordings = [
  { id: 'rec_01', name: 'Loan Pitch V1', duration: '1:24', date: 'Today, 10:45 AM', type: 'Pitch' },
  { id: 'rec_02', name: 'Client Call #482', duration: '5:12', date: 'Yesterday', type: 'Call log' },
  { id: 'rec_03', name: 'SARI Strategic Note', duration: '0:45', date: 'May 04', type: 'Note' },
];

export function VoiceDesk() {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [analyserData, setAnalyserData] = useState<number[]>(new Array(40).fill(0));

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        setAnalyserData(prev => prev.map(() => Math.random() * 100));
      }, 100);
    } else {
      setTimer(0);
      setAnalyserData(new Array(40).fill(0));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 600);
    const secs = Math.floor((seconds % 600) / 10);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Voice <span className="text-blue-500">Desk</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Bulbul Voice Office: Neural Transcription & Sales Guidance</p>
        </div>
        <div className="flex gap-4">
           <Badge className="bg-blue-500/10 text-blue-500 border-none px-4 py-2 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
             <Waves className="w-4 h-4" />
             Neural Mic Active
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recording Interface */}
        <Card className="lg:col-span-2 bg-[#050508] border-white/10 shadow-2xl overflow-hidden relative border-t-blue-500/50">
           <CardContent className="p-0 flex flex-col h-[500px]">
              <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-12">
                 {/* Visualizer */}
                 <div className="flex items-end justify-center gap-1 h-32 w-full max-w-md">
                    {analyserData.map((val, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: isRecording ? `${val}%` : '5%' }}
                        className={cn(
                          "w-1.5 rounded-full transition-all duration-100",
                          isRecording ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-slate-800"
                        )}
                      />
                    ))}
                 </div>

                 <div className="text-center space-y-4">
                    <div className="text-6xl font-black italic text-white font-mono tracking-tighter">
                       {formatTime(timer)}
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">
                       {isRecording ? 'TRANSCRIBING NEURAL VOX...' : 'READY FOR INPUT'}
                    </p>
                 </div>

                 <div className="flex items-center gap-8">
                    <Button 
                      variant="outline" 
                      className="w-16 h-16 rounded-full border-white/10 text-slate-500 hover:text-white"
                      disabled={isRecording}
                    >
                       <Zap className="w-6 h-6" />
                    </Button>
                    <button 
                      onClick={() => setIsRecording(!isRecording)}
                      className={cn(
                        "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 relative group",
                        isRecording ? "bg-red-600 scale-110" : "bg-blue-600 hover:bg-blue-500"
                      )}
                    >
                       <div className="absolute inset-0 bg-inherit rounded-full animate-ping opacity-20" />
                       {isRecording ? <Square className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white shadow-2xl" />}
                    </button>
                    <Button 
                      variant="outline" 
                      className="w-16 h-16 rounded-full border-white/10 text-slate-500 hover:text-white"
                      disabled={isRecording}
                    >
                       <Headphones className="w-6 h-6" />
                    </Button>
                 </div>
              </div>

              {/* Transcript Preview */}
              <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                       <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase italic">Live Sentiment</p>
                      <p className="text-[9px] text-slate-500 uppercase font-black">Neutral • Logic 98%</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <Button variant="ghost" className="text-[10px] font-black uppercase text-slate-500 hover:text-white">Clear</Button>
                    <Button className="bg-white text-black hover:bg-slate-200 font-black uppercase text-[10px] px-8 rounded-xl">Save Note</Button>
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
           <Card className="bg-[#0a0a0f] border-white/5 shadow-2xl h-full">
              <CardHeader className="pb-4">
                 <CardTitle className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Neural Recordings
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {recordings.map((rec) => (
                      <div key={rec.id} className="p-5 hover:bg-white/[0.02] transition-all group flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-colors">
                               <Volume2 className="w-5 h-5" />
                            </div>
                            <div>
                               <h5 className="text-[11px] font-black italic uppercase text-white tracking-tight">{rec.name}</h5>
                               <p className="text-[9px] text-slate-500 font-bold uppercase">{rec.date} • {rec.duration}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-500 hover:text-white"><Play className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-500 hover:text-red-500"><Trash2 className="w-3 h-3" /></Button>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 border-t border-white/5">
                    <Button variant="ghost" className="w-full text-[9px] font-black uppercase text-slate-600 hover:text-white">View Full Vault</Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-white/5 shadow-2xl">
              <CardContent className="p-8 space-y-4">
                 <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Sparkles className="w-6 h-6" />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase italic">AI Pitch Optimizer</h4>
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                   Record your pitch and let Bulbul analyze it for impact, tonality, and conversion triggers.
                 </p>
                 <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] h-10">
                   Start Analysis
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
