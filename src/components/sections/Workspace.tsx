/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Globe, 
  Database, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  ExternalLink,
  Code2,
  FileCode2,
  Lock,
  Unlock,
  Play,
  Monitor,
  Command
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityService, Activity as AIActivity } from '@/services/activityService';
import { db, collection, query, orderBy, limit, onSnapshot } from '@/lib/firebase';

interface WorkspaceProps {
  user: any;
}

export function Workspace({ user }: WorkspaceProps) {
  const [logs, setLogs] = useState<AIActivity[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'active' | 'pending' | 'offline'>>({
    'Banking Portal': 'active',
    'CIBIL API': 'active',
    'GST Matrix': 'pending',
    'Email Node': 'active'
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AIActivity[];
      setLogs(newLogs.reverse());
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleRunScript = (scriptName: string) => {
    setIsExecuting(true);
    ActivityService.log('system', `Manual trigger: Executing ${scriptName}...`);
    setTimeout(() => {
      ActivityService.log('system', `${scriptName} execution completed successfully.`);
      setIsExecuting(false);
    }, 2000);
  };

  const coreFiles = [
    { name: 'server.ts', type: 'Logic', status: 'Running' },
    { name: 'gemini.ts', type: 'AI', status: 'Optimal' },
    { name: 'firebase.ts', type: 'DB', status: 'Syncing' },
    { name: 'activity.ts', type: 'Monitor', status: 'Optimal' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
               <Zap className="w-5 h-5 text-orange-500" />
             </div>
             <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Unified Workspace</h1>
          </div>
          <p className="text-slate-400 font-medium">Full-stack automation matrix connected to Antigravity IDE.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1.5 font-black uppercase tracking-widest">
            Neural Handshake Established
          </Badge>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Terminal View */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
            <div className="relative rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-xl overflow-hidden flex flex-col h-[500px] shadow-2xl">
              {/* Terminal Header */}
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.03] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-orange-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Antigravity Terminal v4.2</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-500 uppercase">System Ready</span>
                  </div>
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <RefreshCw className={cn("w-4 h-4", isExecuting && "animate-spin")} />
                  </button>
                </div>
              </div>

              {/* Terminal Content */}
              <div 
                ref={scrollRef}
                className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-2 selection:bg-orange-500/30"
              >
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 italic">
                    <Command className="w-12 h-12 mb-4" />
                    <p>Neural streams silent. Waiting for system triggers...</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 group"
                    >
                      <span className="text-slate-700 shrink-0 select-none">
                        [{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : new Date().toLocaleTimeString()}]
                      </span>
                      <span className={cn(
                        "break-all",
                        log.type === 'system' ? 'text-orange-400' : 
                        log.type === 'ai' ? 'text-blue-400' : 'text-slate-300'
                      )}>
                        <span className="opacity-50 mr-2">$</span>
                        {log.message}
                      </span>
                    </motion.div>
                  ))
                )}
                {isExecuting && (
                  <div className="flex gap-4 animate-pulse">
                    <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span>
                    <span className="text-white italic">Processing pipeline commands...</span>
                  </div>
                )}
              </div>

              {/* Terminal Footer */}
              <div className="px-6 py-3 border-t border-white/5 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">master_node</span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-500">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase">Root Enabled</span>
                  </div>
                </div>
                <div className="text-[9px] font-mono text-slate-600">
                  UTF-8 | DIVYANSHI-OS-HUB
                </div>
              </div>
            </div>
          </div>

          {/* Script Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-white uppercase italic">Neural Sync Utility</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Data Reconciliation</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                Forces a manual sync between all P1 spreadsheets and the SaaS Engine Database.
              </p>
              <Button 
                onClick={() => handleRunScript('GLOBAL_NEURAL_SYNC')}
                className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20"
              >
                <Play className="w-3 h-3 mr-2" /> Launch Sync Matrix
              </Button>
            </div>

            <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-white uppercase italic">Healing Matrix</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Self-Optimization Core</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                Analyze and repair any payload mismatches in the background worker threads.
              </p>
              <Button 
                onClick={() => handleRunScript('SELF_HEALING_PROTOCOLS')}
                className="w-full h-11 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-500/20"
              >
                <ShieldCheck className="w-3 h-3 mr-2" /> Repair Data Blocks
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          {/* Browser Portal Matrix */}
          <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-500" />
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Browser Matrix</h4>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 text-[8px] font-black">4 PORTALS ACTIVE</Badge>
            </div>

            <div className="space-y-3">
              {Object.entries(connectionStatus).map(([name, status], i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-white/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                      status === 'active' ? "bg-emerald-500/10 text-emerald-500" : 
                      status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-slate-500/10 text-slate-500"
                    )}>
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase italic">{name}</p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase">{status === 'active' ? 'Auth Established' : status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-blue-500" />
                    {status === 'active' ? <Lock className="w-3 h-3 text-emerald-500" /> : <Unlock className="w-3 h-3 text-slate-700" />}
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full h-11 rounded-2xl border-white/10 bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white">
              <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Authenticate All Portals
            </Button>
          </div>

          {/* System File Context */}
          <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-orange-500" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Context</h4>
              </div>
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                LAILA is currently analyzing 4 core logic files for optimization mapping.
              </p>
              
              <div className="space-y-2">
                {coreFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Code2 className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] font-mono text-slate-300">{file.name}</span>
                    </div>
                    <Badge variant="outline" className="text-[8px] border-white/10 opacity-60 px-1 font-mono uppercase">{file.type}</Badge>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[9px] font-black text-slate-500 uppercase">Context Depth</span>
                   <span className="text-[9px] font-black text-orange-400 italic">98.4%</span>
                </div>
                <Progress value={98.4} className="h-1.5 bg-white/5" />
              </div>
            </div>
          </div>

          {/* Security Node */}
          <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-rose-900/20 to-transparent border border-rose-500/20 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-white uppercase italic tracking-tighter">Emergency Kill-Switch</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Instantly terminates all active browser matrix sessions and locks the Neural Bridge.
            </p>
            <Button variant="outline" className="w-full text-rose-500 border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 h-10 rounded-xl font-bold uppercase text-[10px]">
              Execute Protocol-0
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
