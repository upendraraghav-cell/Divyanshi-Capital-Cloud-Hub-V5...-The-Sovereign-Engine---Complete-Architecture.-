/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Webhook, 
  Database, 
  Mail, 
  MessageSquare, 
  Settings2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const INTEGRATIONS = [
  { id: 'meta', name: 'Meta Cloud API', icon: MessageSquare, category: 'Communication', status: 'Connected', lastSync: '2m ago', color: 'bg-blue-600', desc: 'WhatsApp & Instagram Business Messaging.' },
  { id: 'fire', name: 'Firebase Core', icon: Database, category: 'Storage', status: 'Connected', lastSync: 'Real-time', color: 'bg-orange-500', desc: 'Secure database and user authentication.' },
  { id: 'cibil', name: 'CIBIL Neural Connect', icon: ShieldCheck, category: 'Financial', status: 'Optimal', lastSync: '1h ago', color: 'bg-emerald-600', desc: 'Direct credit reporting and scoring node.' },
  { id: 'sendgrid', name: 'SendGrid Matrix', icon: Mail, category: 'Marketing', status: 'Paused', lastSync: '6h ago', color: 'bg-[#1A82E2]', desc: 'Enterprise email broadcast delivery.' },
  { id: 'stripe', name: 'Stripe Gateway', icon: Zap, category: 'Payments', status: 'Pending', lastSync: 'N/A', color: 'bg-[#635BFF]', desc: 'Global payment processing and payouts.' },
  { id: 'webhook', name: 'Sovereign Webhooks', icon: Webhook, category: 'Automation', status: 'Active', lastSync: '40s ago', color: 'bg-purple-600', desc: 'Custom event-driven execution nodes.' },
];

export function Integrations() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSync = (name: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `Synchronizing with ${name} node...`,
        success: `${name} matrix optimized and healthy.`,
        error: `Failed to synchronize with ${name}.`,
      }
    );
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Connection <span className="text-purple-500">Integrations</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">V3 Neural Bridge: External Node Management Registry</p>
        </div>
        <div className="flex gap-4">
           <Button className="bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-[10px] rounded-xl h-12 px-8">
              <Plus className="w-4 h-4 mr-2" /> Connect New Matrix
           </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
           <Input 
             placeholder="Search integration nodes..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="bg-[#0a0a0f] border-white/5 h-12 pl-12 text-white font-bold rounded-2xl"
           />
        </div>
        <Button variant="outline" className="border-white/5 bg-[#0a0a0f] text-white font-bold h-12 px-6 rounded-2xl">
           <Filter className="w-4 h-4 mr-2" /> All Categories
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTEGRATIONS.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map((node) => (
          <Card key={node.id} className="bg-[#0a0a0f] border-white/5 border-t-2 overflow-hidden shadow-2xl relative group" style={{ borderTopColor: node.status === 'Connected' || node.status === 'Optimal' ? '#10b981' : node.status === 'Paused' ? '#f59e0b' : '#ef4444' }}>
             <CardHeader className="p-6">
                <div className="flex items-start justify-between mb-2">
                   <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white", node.color)}>
                      <node.icon className="w-6 h-6" />
                   </div>
                   <Badge className={cn(
                     "text-[9px] font-black uppercase px-2 py-0.5",
                     node.status === 'Connected' || node.status === 'Optimal' || node.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                   )}>
                     {node.status}
                   </Badge>
                </div>
                <CardTitle className="text-lg font-black italic text-white uppercase tracking-tight">{node.name}</CardTitle>
                <CardDescription className="text-slate-500 font-bold uppercase text-[9px]">{node.category} Agent Matrix</CardDescription>
             </CardHeader>
             <CardContent className="p-6 pt-0 space-y-6">
                <p className="text-[11px] text-slate-400 font-bold uppercase leading-relaxed h-12 line-clamp-3">
                   {node.desc}
                </p>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">Last Synchronization</span>
                      <span className="text-[10px] font-black text-slate-400 mt-1">{node.lastSync}</span>
                   </div>
                   <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleSync(node.name)}
                        className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 hover:text-white"
                      >
                         <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 hover:text-white"
                      >
                         <Settings2 className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Protocol Information */}
      <Card className="bg-gradient-to-r from-[#0a0a0f] to-purple-950/10 border-white/5 overflow-hidden">
         <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 rounded-[32px] bg-purple-600/20 flex items-center justify-center text-purple-500 shrink-0">
               <Layers className="w-12 h-12" />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
               <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Secure Node Protocol</h3>
               <p className="text-sm text-slate-400 font-bold uppercase leading-relaxed max-w-2xl">
                 All integrations are routed through the **Mallik V3 Sovereignty Filter**. 
                 This ensures no PII (Personally Identifiable Information) leaks into non-compliant public AI agents.
               </p>
               <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">AES-256 Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">ISO/IEC 27001</span>
                  </div>
               </div>
            </div>
            <Button className="bg-white text-black hover:bg-slate-200 font-black uppercase text-[10px] px-10 h-12 rounded-xl shrink-0">
               Audit Connections
            </Button>
         </CardContent>
      </Card>
    </div>
  );
}
