/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  BarChart3, 
  Plus, 
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Zap,
  Layout,
  MessageCircle,
  Eye,
  MousePointer2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const campaignData = [
  { name: 'Sent', value: 12000, color: '#3b82f6' },
  { name: 'Delivered', value: 11800, color: '#10b981' },
  { name: 'Read', value: 8500, color: '#f59e0b' },
  { name: 'Replied', value: 1200, color: '#ec4899' },
];

const campaigns = [
  { id: 'cam_01', name: 'Loan Approval Blast', status: 'Running', sent: '4.2k', read: '82%', conversion: '12%', eta: '45m' },
  { id: 'cam_02', name: 'Identity KYC Reminder', status: 'Completed', sent: '1.5k', read: '95%', conversion: '8%', eta: 'Finished' },
  { id: 'cam_03', name: 'Festival Offer V2', status: 'Paused', sent: '12.8k', read: '45%', conversion: '2%', eta: 'Stopped' },
  { id: 'cam_04', name: 'Reactivation Protocol', status: 'Scheduled', sent: '0', read: '0%', conversion: '0%', eta: 'Starts 2PM' },
];

const FLOW_TEMPLATES = [
  { id: 'f1', name: 'Loan Application Flow', category: 'Onboarding', conversion: '+22%' },
  { id: 'f2', name: 'Identity Varification', category: 'Compliance', conversion: '+15%' },
  { id: 'f3', name: 'Product Recommendation', category: 'Sales', conversion: '+30%' },
];

export function WhatsAppCampaigns() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">WhatsApp <span className="text-emerald-500">Cloud OS</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">META Cloud API V19.0: FLOWS & INTERACTIVE PROTOCOLS</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="border-white/10 text-white font-black uppercase text-[10px] rounded-xl h-12 px-6">
              Manage Flows
           </Button>
           <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] rounded-xl h-12 px-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Plus className="w-4 h-4 mr-2" /> Launch New Campaign
           </Button>
        </div>
      </div>

      {/* Meta Flows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FLOW_TEMPLATES.map((flow) => (
          <Card key={flow.id} className="bg-emerald-950/10 border-emerald-500/20 hover:border-emerald-500/40 transition-all group overflow-hidden">
             <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Zap size={60} className="text-emerald-500" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase mb-3">Active Flow</Badge>
                <h3 className="text-lg font-black italic text-white uppercase tracking-tight">{flow.name}</h3>
                <div className="flex items-center justify-between mt-4">
                   <p className="text-[10px] text-slate-500 font-bold uppercase">{flow.category}</p>
                   <span className="text-[10px] font-black text-emerald-500">{flow.conversion} Impact</span>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#0a0a0f] border-white/5 shadow-2xl overflow-hidden p-0">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black italic text-white uppercase">Neural Engagement Matrix</CardTitle>
              <CardDescription className="text-slate-500 font-bold uppercase text-[9px]">Live transmission telemetry</CardDescription>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3">Live Feed</Badge>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                   <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                   <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                   <Tooltip 
                     cursor={{fill: 'rgba(255,255,255,0.05)'}}
                     contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                   />
                   <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {campaignData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                   </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Panel */}
        <div className="space-y-6">
           {[
             { label: 'Global Open Rate', value: '78.2%', icon: Eye, color: 'text-blue-500', trend: '+4.2%' },
             { label: 'Avg. Click Rate', value: '14.5%', icon: MousePointer2, color: 'text-emerald-500', trend: '+1.8%' },
             { label: 'Opt-out Ratio', value: '0.8%', icon: AlertCircle, color: 'text-red-500', trend: '-0.2%' }
           ].map((stat, i) => (
             <Card key={i} className="bg-[#0a0a0f] border-white/5 shadow-xl relative group">
                <CardContent className="p-6 flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-black italic text-white mt-1">{stat.value}</p>
                      <p className={cn("text-[9px] font-black uppercase mt-1", stat.trend.includes('+') ? 'text-emerald-500' : 'text-red-500')}>
                        {stat.trend} <span className="text-slate-600">vs last cycle</span>
                      </p>
                   </div>
                   <div className={cn("p-4 rounded-2xl bg-white/5", stat.color)}>
                      <stat.icon className="w-6 h-6" />
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>
      </div>

      {/* Campaigns Registry */}
      <Card className="bg-[#0a0a0f] border-white/5 shadow-2xl overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-xl font-black italic text-white uppercase">Campaign Control Center</CardTitle>
              <CardDescription className="text-slate-500 font-bold uppercase text-[9px]">Active & Historical Broadcast Lifecycle</CardDescription>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input placeholder="Search campaign..." className="pl-10 bg-white/5 border-white/10 h-11 w-64 rounded-xl text-white" />
              </div>
              <Button variant="outline" className="border-white/10 text-white font-bold h-11 px-6 rounded-xl"><Filter className="w-4 h-4 mr-2" /> Sort</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Protocol Name</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status Node</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Transmitted</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Read %</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Conversion</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">ETA / Time</th>
                  <th className="p-6 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((cam) => (
                  <tr key={cam.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                             <MessageCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-black italic text-white uppercase tracking-tighter">{cam.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono italic">{cam.id}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <Badge className={cn(
                         "text-[9px] font-black px-2 py-0.5",
                         cam.status === 'Running' ? 'bg-emerald-500/10 text-emerald-500' : 
                         cam.status === 'Paused' ? 'bg-amber-500/10 text-amber-500' : 
                         cam.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'
                       )}>
                         {cam.status}
                       </Badge>
                    </td>
                    <td className="p-6">
                       <p className="text-sm font-black text-white italic">{cam.sent}</p>
                       <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Total Nodes</p>
                    </td>
                    <td className="p-6">
                       <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                             <span>Engagement</span>
                             <span className="text-white">{cam.read}</span>
                          </div>
                          <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-orange-500" style={{ width: cam.read }} />
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <p className="text-sm font-black text-white italic">{cam.conversion}</p>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] font-black uppercase italic text-white">{cam.eta}</span>
                       </div>
                    </td>
                    <td className="p-6 text-right">
                       <button className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                          <MoreVertical className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
