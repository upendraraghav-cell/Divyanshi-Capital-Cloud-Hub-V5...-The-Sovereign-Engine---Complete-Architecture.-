/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  ShieldAlert, 
  RefreshCw, 
  Database, 
  Globe, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Link,
  Lock,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const auditLogs = [
  { id: 'log_01', type: 'AUTH', action: 'Tenant Login', user: 'Upendra R.', tenant: 'Divyanshi Capital', status: 'Success', time: '2 mins ago' },
  { id: 'log_02', type: 'REPAIR', action: 'API Self-Heal', user: 'LAILA (AI)', tenant: 'Core System', status: 'Fixed', time: '14 mins ago' },
  { id: 'log_03', type: 'SYCH', action: 'Sheet Pivot', user: 'Khushboo', tenant: 'HR Matrix', status: 'Warning', time: '42 mins ago' },
  { id: 'log_04', type: 'MGMT', action: 'Plan Upgrade', user: 'System', tenant: 'Real Estate Elite', status: 'Success', time: '1 hour ago' },
  { id: 'log_05', type: 'WARN', action: 'Rate Limit', user: 'Unknown IP', tenant: 'Public API', status: 'Blocked', time: '3 hours ago' },
];

export function V2Dashboard() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">V2 <span className="text-blue-500">Controller</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Platform Orchestrator: API Gateway & Repair Layer</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="border-white/10 text-white font-black uppercase text-[10px] rounded-xl h-12 px-6">
              <ShieldAlert className="w-4 h-4 mr-2" /> Security Clear
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] rounded-xl h-12 px-8">
              <RefreshCw className="w-4 h-4 mr-2" /> Purge Cache
           </Button>
        </div>
      </div>

      {/* API Health Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Gateway Latency', value: '42ms', status: 'Optimized', icon: Clock, color: 'text-emerald-500' },
          { label: 'Active Webhooks', value: '841', status: 'Relaying', icon: Link, color: 'text-blue-500' },
          { label: 'Auth Validation', value: '100%', status: 'Secure', icon: Lock, color: 'text-orange-500' },
          { label: 'Daily Requests', value: '4.2M', status: 'Healthy', icon: Globe, color: 'text-purple-500' }
        ].map((node, i) => (
          <Card key={i} className="bg-[#0a0a0f] border-white/5 shadow-2xl relative overflow-hidden group">
            <CardContent className="p-6 flex items-center justify-between">
               <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{node.label}</h4>
                  <p className="text-2xl font-black italic text-white mt-1">{node.value}</p>
                  <p className={cn("text-[9px] font-bold uppercase mt-2", node.color)}>{node.status}</p>
               </div>
               <div className={cn("p-4 rounded-full bg-white/5", node.color)}>
                  <node.icon className="w-6 h-6" />
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mini App Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-3">
            <h2 className="text-xl font-black italic text-white uppercase tracking-widest flex items-center gap-3">
               <Database className="w-5 h-5 text-blue-500" />
               System Mini-App Registry
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 mb-6">Autonomous micro-utilities within the Mallik Matrix</p>
         </div>
         {[
           { name: 'Neural Scrapper', desc: 'Auto-extract P1 data from MIS sheets.', icon: Search, color: 'text-orange-500', link: 'bg-orange-500/10' },
           { name: 'TAT Sentinel', desc: 'Monitor and penalize delay breaches.', icon: Clock, color: 'text-blue-500', link: 'bg-blue-500/10' },
           { name: 'Revenue Lock', desc: 'Secure settlement & payout gateway.', icon: Lock, color: 'text-purple-500', link: 'bg-purple-500/10' },
           { name: 'BHISHM Auditor', desc: 'Deep-dive security log analysis.', icon: ShieldAlert, color: 'text-red-500', link: 'bg-red-500/10' },
           { name: 'Integration Hub', desc: 'Connect 3rd party API nodes.', icon: Link, color: 'text-emerald-500', link: 'bg-emerald-500/10' },
           { name: 'Matrix Repair', desc: 'Manual trigger for LAILA healing.', icon: RefreshCw, color: 'text-purple-500', link: 'bg-purple-500/10' },
         ].map((app, i) => (
           <motion.button 
             key={i}
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="p-6 rounded-3xl bg-[#0a0a0f] border border-white/5 hover:border-blue-500/30 transition-all text-left flex items-start gap-5 group"
           >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", app.link)}>
                 <app.icon className={cn("w-6 h-6", app.color)} />
              </div>
              <div>
                 <h4 className="text-sm font-black italic text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{app.name}</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 leading-relaxed">{app.desc}</p>
                 <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Execute Node</span>
                    <span className="text-blue-500">→</span>
                 </div>
              </div>
           </motion.button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LAILA Repair Panel */}
        <Card className="lg:col-span-1 bg-[#0a0a0f] border-white/5 shadow-2xl overflow-hidden p-0">
          <CardHeader className="p-8 border-b border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <RefreshCw className="w-6 h-6 animate-spin-slow" />
               </div>
               <div>
                  <CardTitle className="text-lg font-black italic text-white uppercase">LAILA Repair Layer</CardTitle>
                  <CardDescription className="text-slate-500 font-bold uppercase text-[9px]">Autonomous system healing logs</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
             {[
               { title: 'Firestore Sync Conflict', tenant: 'ten_04', fixed: true, time: '14m ago' },
               { title: 'API Rate Limit Hit', tenant: 'Public_API', fixed: true, time: '2h ago' },
               { title: 'Schema Mismatch Healed', tenant: 'ten_02', fixed: true, time: '5h ago' }
             ].map((job, i) => (
               <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                     <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white uppercase italic">{job.title}</h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Tenant: {job.tenant} • {job.time}</p>
                  </div>
               </div>
             ))}
             <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-slate-500 hover:text-white">View Full Heal History</Button>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card className="lg:col-span-2 bg-[#0a0a0f] border-white/5 shadow-2xl overflow-hidden p-0">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black italic text-white uppercase">V2 Audit Matrix</CardTitle>
              <CardDescription className="text-slate-500 font-bold uppercase text-[9px]">Global request & operation ledger</CardDescription>
            </div>
            <div className="flex gap-2">
               <Input placeholder="Search Audit..." className="bg-white/5 border-white/10 h-10 w-48 rounded-xl text-white text-[10px]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/5">
                    <tr>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-slate-500">TYPE</th>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-slate-500">ACTION NODE</th>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-slate-500">USER / BOT</th>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-slate-500">STATUS</th>
                      <th className="p-6 text-[9px] font-black uppercase tracking-widest text-slate-500">TIMESTAMP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                        <td className="p-6">
                           <Badge variant="outline" className="text-[8px] font-black border-white/10 text-slate-400">
                              {log.type}
                           </Badge>
                        </td>
                        <td className="p-6">
                           <p className="text-xs font-black text-white italic uppercase">{log.action}</p>
                           <p className="text-[10px] text-slate-600 font-bold uppercase">{log.tenant}</p>
                        </td>
                        <td className="p-6">
                           <p className="text-xs font-bold text-slate-300">{log.user}</p>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                log.status === 'Success' ? 'bg-emerald-500' : (log.status === 'Blocked' ? 'bg-red-500' : (log.status === 'Fixed' ? 'bg-blue-500' : 'bg-amber-500'))
                              )} />
                              <span className="text-[10px] font-black uppercase tracking-tight text-white">{log.status}</span>
                           </div>
                        </td>
                        <td className="p-6">
                           <p className="text-[10px] font-mono text-slate-500">{log.time}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
