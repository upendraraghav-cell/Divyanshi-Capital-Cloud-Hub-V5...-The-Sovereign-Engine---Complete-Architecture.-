/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  Database, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Search, 
  Filter, 
  ArrowUpRight,
  MoreVertical,
  Terminal,
  Cpu,
  Server,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const data = [
  { name: '01:00', load: 24, users: 400 },
  { name: '04:00', load: 13, users: 300 },
  { name: '08:00', load: 68, users: 1200 },
  { name: '12:00', load: 92, users: 2400 },
  { name: '16:00', load: 85, users: 2100 },
  { name: '20:00', load: 45, users: 1500 },
  { name: '00:00', load: 18, users: 600 },
];

const tenants = [
  { id: 'ten_01', name: 'Divyanshi Capital', plan: 'ENTERPRISE', status: 'Optimal', load: '12%', users: 142, revenue: '₹42,500' },
  { id: 'ten_02', name: 'Global Finance HQ', plan: 'PRO', status: 'Monitoring', load: '68%', users: 45, revenue: '₹12,400' },
  { id: 'ten_03', name: 'Tech Solutions Inc', plan: 'STARTER', status: 'Optimal', load: '5%', users: 8, revenue: '₹4,900' },
  { id: 'ten_04', name: 'Real Estate Elite', plan: 'PRO', status: 'Error', load: '92%', users: 120, revenue: '₹18,500' },
];

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
const PIE_DATA = [
  { name: 'Enterprise', value: 400 },
  { name: 'Pro', value: 300 },
  { name: 'Starter', value: 300 },
  { name: 'Trial', value: 200 },
];

export function V3Dashboard() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">BHISHM <span className="text-orange-500">PROTOCOL</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Sovereign V3 Architecture: MD Strategic Control Hub</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="border-white/10 text-white font-black uppercase text-[10px] rounded-xl h-12 px-6">
              <ShieldCheck className="w-4 h-4 mr-2" /> Security Audit
           </Button>
           <Button className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-[10px] rounded-xl h-12 px-8 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <Zap className="w-4 h-4 mr-2" /> Trigger P1-V2-V3 Sync
           </Button>
        </div>
      </div>

      {/* Bhishm Enforcement Alert */}
      <Card className="bg-orange-500/5 border-orange-500/20 overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck size={80} className="text-orange-500" />
         </div>
         <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center shrink-0">
               <Activity className="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
            <div>
               <h3 className="text-xl font-black italic text-white uppercase tracking-tight">Active Protocol: <span className="text-orange-500">BHISHM LAYER 3</span></h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mt-1">
                  Revenue protection active. Neural bridge monitoring all 1,482 subscriber nodes. <br />
                  <span className="text-orange-500/80">LATENCY: 18ms | HEALER_STATE: NOMINAL | REVENUE_LOCK: ENABLED</span>
               </p>
            </div>
         </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Tenants', value: '1,482', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Total Users', value: '24,801', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Global Load', value: '42.8%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'MRR Growth', value: '+12.4%', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' }
        ].map((stat, i) => (
          <Card key={i} className="bg-[#0a0a0f] border-white/5 shadow-2xl relative overflow-hidden group">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-3 rounded-2xl", stat.bg)}>
                     <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <Badge className="bg-white/5 text-slate-500 border-none">Live</Badge>
               </div>
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</h4>
               <p className="text-3xl font-black italic text-white mt-1">{stat.value}</p>
            </CardContent>
            <div className={cn("absolute bottom-0 left-0 w-full h-[2px] opacity-20 bg-gradient-to-r", stat.bg.replace('/10', ''))} />
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#0a0a0f] border-white/5 shadow-2xl overflow-hidden p-0">
          <CardHeader className="p-8 border-b border-white/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-black italic text-white uppercase">System Telemetry</CardTitle>
              <div className="flex gap-2">
                 <Badge className="bg-orange-500/10 text-orange-500">Global Load %</Badge>
                 <Badge className="bg-blue-500/10 text-blue-500 font-bold">Node Users</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="load" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0a0f] border-white/5 shadow-2xl overflow-hidden p-0">
           <CardHeader className="p-8 border-b border-white/5 text-center">
              <CardTitle className="text-lg font-black italic text-white uppercase">Subscription Matrix</CardTitle>
           </CardHeader>
           <CardContent className="p-8 flex flex-col items-center justify-center">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                 {PIE_DATA.map((p, i) => (
                   <div key={p.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-[10px] font-black uppercase text-slate-400">{p.name}</span>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Tenant Table */}
      <Card className="bg-[#0a0a0f] border-white/5 shadow-2xl overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-xl font-black italic text-white uppercase">Tenant Control Registry</CardTitle>
              <CardDescription className="text-slate-500 font-bold uppercase text-[9px]">Overview of all subscriber nodes</CardDescription>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input placeholder="Search Node ID..." className="pl-10 bg-white/5 border-white/10 h-11 w-64 rounded-xl text-white" />
              </div>
              <Button variant="outline" className="border-white/10 text-white font-bold h-11 px-6 rounded-xl"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Tenant Identity</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Plan Payload</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Health Node</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Telemetry</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">MRR Share</th>
                  <th className="p-6 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs">
                             {t.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black italic text-white uppercase tracking-tighter">{t.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono italic">{t.id}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <Badge className={cn(
                         "text-[9px] font-black px-2 py-0.5",
                         t.plan === 'ENTERPRISE' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                       )}>
                         {t.plan}
                       </Badge>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full animate-pulse",
                            t.status === 'Optimal' ? 'bg-emerald-500' : (t.status === 'Error' ? 'bg-red-500' : 'bg-amber-500')
                          )} />
                          <span className="text-[10px] font-black uppercase italic text-white">{t.status}</span>
                       </div>
                    </td>
                    <td className="p-6">
                       <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                             <span>Node Load</span>
                             <span className="text-white">{t.load}</span>
                          </div>
                          <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: t.load }} />
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <p className="text-sm font-black text-white italic">{t.revenue}</p>
                       <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Revenue/Node</p>
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
