/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  Play, 
  MessageCircle, 
  Zap,
  Cpu,
  Globe,
  Shield,
  Users,
  Layout,
  Sun,
  Moon,
  Grid,
  Clock,
  Database,
  Filter as FilterIcon,
  Bot,
  Combine,
  Send,
  RefreshCw,
  Terminal,
  CheckCircle2,
  ShieldCheck,
  Search,
  Loader2,
  Target,
  TrendingUp,
  FileText,
  Calculator,
  Briefcase,
  HandCoins as HandCoinsIcon,
  Scale,
  Activity,
  Phone,
  Mail,
  Brain,
  Cloud,
  AlertCircle,
  Ghost,
  Radio,
  BarChart3,
  LineChart,
  Maximize2,
  Plus,
  Trash2,
  ExternalLink,
  FileSearch
} from 'lucide-react';
import { ALL_EMPLOYEES } from '@/data/staff';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { callBackend } from '@/lib/api';
import { db, auth, collection, addDoc, serverTimestamp, doc, onSnapshot, updateDoc, setDoc } from '@/lib/firebase';
import { toast } from 'sonner';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  Legend
} from 'recharts';

const PERFORMANCE_DATA: Record<string, any[]> = {
  'Upendra R.': [
    { day: 'Mon', completion: 85, efficiency: 90 },
    { day: 'Tue', completion: 88, efficiency: 92 },
    { day: 'Wed', completion: 95, efficiency: 95 },
    { day: 'Thu', completion: 92, efficiency: 94 },
    { day: 'Fri', completion: 90, efficiency: 91 },
    { day: 'Sat', completion: 80, efficiency: 85 },
    { day: 'Sun', completion: 70, efficiency: 80 },
  ],
  'Amit S.': [
    { day: 'Mon', completion: 40, efficiency: 60 },
    { day: 'Tue', completion: 45, efficiency: 65 },
    { day: 'Wed', completion: 42, efficiency: 62 },
    { day: 'Thu', completion: 38, efficiency: 58 },
    { day: 'Fri', completion: 40, efficiency: 60 },
    { day: 'Sat', completion: 35, efficiency: 55 },
    { day: 'Sun', completion: 30, efficiency: 50 },
  ],
  'Priya P.': [
    { day: 'Mon', completion: 70, efficiency: 75 },
    { day: 'Tue', completion: 72, efficiency: 78 },
    { day: 'Wed', completion: 75, efficiency: 80 },
    { day: 'Thu', completion: 78, efficiency: 82 },
    { day: 'Fri', completion: 75, efficiency: 80 },
    { day: 'Sat', completion: 70, efficiency: 75 },
    { day: 'Sun', completion: 65, efficiency: 70 },
  ],
  'LAILA': [
    { day: 'Mon', completion: 98, efficiency: 99 },
    { day: 'Tue', completion: 99, efficiency: 99 },
    { day: 'Wed', completion: 98, efficiency: 98 },
    { day: 'Thu', completion: 99, efficiency: 100 },
    { day: 'Fri', completion: 99, efficiency: 99 },
    { day: 'Sat', completion: 98, efficiency: 98 },
    { day: 'Sun', completion: 99, efficiency: 99 },
  ],
  'Mallik S.': [
    { day: 'Mon', completion: 55, efficiency: 65 },
    { day: 'Tue', completion: 60, efficiency: 70 },
    { day: 'Wed', completion: 58, efficiency: 68 },
    { day: 'Thu', completion: 62, efficiency: 72 },
    { day: 'Fri', completion: 60, efficiency: 70 },
    { day: 'Sat', completion: 55, efficiency: 65 },
    { day: 'Sun', completion: 50, efficiency: 60 },
  ],
  'System Node': [
    { day: 'Mon', completion: 80, efficiency: 85 },
    { day: 'Tue', completion: 82, efficiency: 88 },
    { day: 'Wed', completion: 85, efficiency: 90 },
    { day: 'Thu', completion: 88, efficiency: 92 },
    { day: 'Fri', completion: 86, efficiency: 90 },
    { day: 'Sat', completion: 82, efficiency: 85 },
    { day: 'Sun', completion: 80, efficiency: 82 },
  ],
};

const GENIE_MODES = [
  { id: 'command', label: 'Central Command', icon: Radio, description: 'Unified communication and labor audit.' },
  { id: 'staff', label: 'All Employees', icon: Users, description: 'P1 Master Staff Registry Sync.' },
  { id: 'hub', label: 'Operations Hub', icon: Briefcase, description: 'All-in-One Dashboard for users.' },
  { id: 'engine', label: 'Front End Engine', icon: Target, description: 'Visitor landing and demo conversion.' },
  { id: 'integration', label: 'Core Config', icon: Globe, description: 'Backend integration and automation.' },
];

const AI_PROTOCOLS = [
  { id: 'Assist', icon: ShieldCheck, description: 'AI assists staff with operational guidance.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'Shadow', icon: Ghost, description: 'AI audits enterprise docs in background.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'Delegated', icon: Zap, description: 'AI takes over capacity matching tasks.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'Safe', icon: Radio, description: 'AI restricted to read-only audits.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
];

export function AIEmployee() {
  const [activeMode, setActiveMode] = useState<string>('command');

  const renderContent = () => {
    switch (activeMode) {
      case 'command': return <CentralCommand />;
      case 'staff': return <StaffRegistryView />;
      case 'hub': return <OperationsHub />;
      case 'integration': return <IntegrationHub />;
      case 'engine': return <FrontEndEngine />;
      default: return <CentralCommand />;
    }
  };

  return (
    <div className="min-h-screen bg-[#071018] text-[#ebf4ff] font-sans selection:bg-[#43a4ff]/30 pb-20">
      {/* Top Bar / Hub Header */}
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#203548]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-primary shadow-xl shadow-primary/20 ring-1 ring-white/10">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white italic uppercase">QDN <span className="text-[#43a4ff] not-italic">Management Services</span></h1>
            <p className="text-[10px] text-[#9ab0c7] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-3 h-3 text-[#25c37a]" />
              Divyanshi V1 Loan OS • Managed by LAILA
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#111c27] border border-[#203548]">
          {GENIE_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                activeMode === mode.id 
                  ? "bg-[#43a4ff] text-white shadow-lg shadow-[#43a4ff]/20" 
                  : "text-[#9ab0c7] hover:text-white hover:bg-white/5"
              )}
            >
              <mode.icon className="w-3 h-3" />
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main View Area */}
      <div className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function GenieHead({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  return (
    <div className={cn(
      "rounded-3xl border border-[#203548] relative overflow-hidden bg-radial-gradient from-[#1f3550] to-[#0a131d] shadow-2xl",
      size === 'lg' ? "w-32 h-32" : "w-16 h-16 rounded-2xl shadow-[#43a4ff]/10"
    )}>
      {/* Eyes */}
      <div 
        className={cn(
          "absolute bg-white rounded-full animate-genie-blink",
          size === 'lg' ? "top-10 w-4 h-4 left-8 shadow-[0_0_10px_#fff]" : "top-5 w-2 h-2 left-4"
        )}
      >
        <div className={cn("absolute bg-black rounded-full left-1/2 -translate-x-1/2 top-1", size === 'lg' ? "w-2 h-2" : "w-1 h-1")} />
      </div>
      <div 
        className={cn(
          "absolute bg-white rounded-full animate-genie-blink",
          size === 'lg' ? "top-10 w-4 h-4 right-8 shadow-[0_0_10px_#fff]" : "top-5 w-2 h-2 right-4"
        )}
      >
        <div className={cn("absolute bg-black rounded-full left-1/2 -translate-x-1/2 top-1", size === 'lg' ? "w-2 h-2" : "w-1 h-1")} />
      </div>
      
      <div className={cn(
        "absolute bottom-2 left-1/2 -translate-x-1/2 opacity-80",
        size === 'lg' ? "text-2xl" : "text-sm"
      )}>
        🦉
      </div>
    </div>
  );
}

function CentralCommand() {
  const [selectedMember, setSelectedMember] = useState<any>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="grid lg:grid-cols-12 gap-8 text-left">
        {/* Unified Communication Feed */}
        <div className="lg:col-span-8 space-y-6 text-left">
          <Card className="premium-card bg-[#111c27] border-[#203548]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Combine className="w-5 h-5 text-primary" />
                  Unified Pulse
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Mail • WhatsApp • CRM • Analytics</CardDescription>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30">Auto-Filtered by LAILA</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { channel: 'Mail', from: 'Amit Sharma', subject: 'Strategic Partnership Proposal', time: '2m ago', priority: 'High', icon: Mail, color: 'text-blue-400' },
                  { channel: 'WhatsApp', from: 'Priya Patel', subject: 'Integration logs verified', time: '15m ago', priority: 'Medium', icon: MessageCircle, color: 'text-emerald-400' },
                  { channel: 'CRM', from: 'System Note', subject: 'New Node deployment request from Vikram', time: '1h ago', priority: 'Urgent', icon: Database, color: 'text-amber-400' },
                  { channel: 'Analytics', from: 'Growth Monitor', subject: 'Traffic spike in US-East Node', time: '2h ago', priority: 'Insight', icon: TrendingUp, color: 'text-purple-400' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer"
                  >
                    <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform", item.color)}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{item.channel} • {item.from}</span>
                        <span className="text-[10px] text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{item.subject}</p>
                    </div>
                    <Badge variant="ghost" className="text-[9px] font-black uppercase tracking-tighter opacity-50 group-hover:opacity-100">{item.priority}</Badge>
                  </motion.div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 rounded-xl border border-dashed border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5">
                Load Full Command History
              </Button>
            </CardContent>
          </Card>

          {/* AI Labor Optimization / Capacity Heatmap */}
          <Card className="premium-card bg-[#111c27] border-[#203548]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Activity className="w-5 h-5 text-[#25c37a]" />
                  Labor Optimization Heatmap
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Real-time Task/Capacity Alignment</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="rounded-full border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                Optimize Allocation
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Upendra R.', role: 'Director', capacity: 95, status: 'Overloaded', color: 'bg-rose-500' },
                  { name: 'Amit S.', role: 'Ops Lead', capacity: 40, status: 'Available', color: 'bg-emerald-500' },
                  { name: 'Priya P.', role: 'SaaS Auditor', capacity: 75, status: 'Active', color: 'bg-amber-500' },
                  { name: 'LAILA', role: 'Mainframe', capacity: 12, status: 'Idle', color: 'bg-blue-500' },
                  { name: 'Mallik S.', role: 'Managing', capacity: 60, status: 'Syncing', color: 'bg-emerald-500' },
                  { name: 'System Node', role: 'Automation', capacity: 88, status: 'Peak', color: 'bg-rose-500' },
                ].map((member, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedMember(member)}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 cursor-pointer hover:border-primary/50 hover:bg-white/[0.08] transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TrendingUp className="w-3 h-3 text-primary" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{member.name}</p>
                        <p className="text-[9px] text-muted-foreground uppercase">{member.role}</p>
                      </div>
                      <Badge className={cn("text-[8px] px-1 py-0", member.color + "/20 " + member.color.replace('bg-', 'text-'))}>
                        {member.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span className="text-muted-foreground">Load</span>
                        <span className="text-white">{member.capacity}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${member.capacity}%` }}
                          className={cn("h-full", member.color)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
                <DialogContent className="max-w-2xl bg-[#0b141d] border-[#203548] text-white rounded-3xl p-8">
                  <DialogHeader className="mb-6 text-left">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", selectedMember?.color, selectedMember?.color.replace('bg-', 'text-'))}>
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">
                          {selectedMember?.name} <span className="text-primary not-italic font-bold ml-2">• Level Performance</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                          {selectedMember?.role} • Efficiency Optimization Log
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  {selectedMember && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-3 gap-4 text-left">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency Rate</p>
                          <p className="text-2xl font-black text-emerald-400">
                            {PERFORMANCE_DATA[selectedMember.name]?.[4]?.efficiency || 0}%
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Completion Rate</p>
                          <p className="text-2xl font-black text-primary">
                            {PERFORMANCE_DATA[selectedMember.name]?.[4]?.completion || 0}%
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</p>
                          <Badge className={cn("mt-1", selectedMember.color + "/20 " + selectedMember.color.replace('bg-', 'text-'))}>
                            {selectedMember.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                          <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                            <LineChart className="w-4 h-4 text-primary" />
                            Performance Trends (7 Days)
                          </h4>
                          <div className="flex gap-4 text-[9px] uppercase font-bold tracking-widest">
                            <span className="flex items-center gap-1.5 text-primary">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              Completion
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <div className="w-2 h-2 rounded-full bg-emerald-400" />
                              Efficiency
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ width: '100%', height: '400px' }} className="bg-white/[0.02] rounded-2xl border border-white/5 p-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PERFORMANCE_DATA[selectedMember.name] || []}>
                              <defs>
                                <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#43a4ff" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#43a4ff" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#203548" vertical={false} />
                              <XAxis 
                                dataKey="day" 
                                stroke="#9ab0c7" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                dy={10}
                              />
                              <YAxis 
                                stroke="#9ab0c7" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                domain={[0, 110]}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#111c27', 
                                  border: '1px solid #203548', 
                                  borderRadius: '12px',
                                  fontSize: '10px',
                                  color: '#fff'
                                }} 
                                itemStyle={{ color: '#fff' }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="completion" 
                                stroke="#43a4ff" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorComp)" 
                              />
                              <Area 
                                type="monotone" 
                                dataKey="efficiency" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorEff)" 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          className="rounded-xl border-white/10 hover:bg-white/5 uppercase text-[10px] font-bold px-6 h-12"
                          onClick={() => setSelectedMember(null)}
                        >
                          Close Log
                        </Button>
                        <Button 
                          className="rounded-xl bg-primary hover:bg-primary/90 text-white uppercase text-[10px] font-bold px-6 h-12 shadow-lg shadow-primary/20"
                          onClick={() => {
                            toast.success("Corrective action dispatched via LAILA OS.");
                            setSelectedMember(null);
                          }}
                        >
                          Dispatch Directive
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* AI Auditing / Document Analysis */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <Card className="premium-card bg-gradient-to-br from-[#111c27] to-[#071018] border-[#203548]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-3">
                <FileSearch className="w-5 h-5 text-primary" />
                Intelligence Audit
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Document Analysis Engine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 bg-white/[0.02] hover:bg-primary/5 transition-all cursor-pointer group">
                <FileText className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-center">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Drop Node Document</p>
                  <p className="text-[9px] text-muted-foreground uppercase mt-1">SaaS Agreements • P&L • Contracts</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recent Audit Findings</h4>
                {[
                  { doc: 'Q2_Financials.pdf', label: 'Analyzed', result: '98% Profitability Match', color: 'text-emerald-400' },
                  { doc: 'Stripe_Contract_v2.pdf', label: 'Updated', result: 'Ready for Master Approval', color: 'text-[#43a4ff]' },
                  { doc: 'Vendor_Log_Mar.xlsx', label: 'Flagged', result: 'Duplicate Nodes Detected', color: 'text-amber-400' },
                ].map((audit, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5 items-center">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{audit.doc}</p>
                      <p className={cn("text-[9px] font-medium uppercase tracking-tighter", audit.color)}>{audit.result}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                Process New Stream
              </Button>
            </CardContent>
          </Card>

          <Card className="premium-card bg-[#111c27] border-[#203548]">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-[#25c37a]/10 rounded-full flex items-center justify-center text-[#25c37a] mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                LAILA has pre-screened 14 DSA applications and triggered 5 demo links today, saving <span className="text-white font-bold">4.2 hours</span> of manual onboarding labor.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FrontEndEngine() {
  const tags = [
    'CRM', 'Lead Database', 'Dialer', 'Marketing', 'Customer Support',
    'Finance', 'Inventory', 'ERP', 'AI Voice Agents', 'Team Chat', 'HR',
    'Accounting', 'Project Management', 'Workflows', 'E-com',
    'WhatsApp', 'AI Analytics', 'CPQ', 'E-Sign'
  ];

  return (
    <div className="space-y-16 py-12 flex flex-col items-center text-center">
      <div className="max-w-4xl space-y-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-1 py-1 pr-4 rounded-full bg-[#111c27] border border-[#203548]"
        >
          <div className="w-8 h-8 rounded-full bg-[#43a4ff]/10 flex items-center justify-center text-[#43a4ff]">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9ab0c7]">SuperAGI Sponsored</span>
        </motion.div>

        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] italic uppercase">
          Mallik V3 <br />
          <span className="text-[#43a4ff] not-italic">Loan OS</span>
        </h2>

        <div className="flex justify-center">
          <Badge className="bg-[#7c5cff] hover:bg-[#6b4ae0] text-white px-8 py-2 rounded-full text-sm font-bold shadow-xl shadow-[#7c5cff]/20">
            QDN Management Services SaaS
          </Badge>
        </div>

        <div className="flex flex-wrap justify-center gap-3 py-10">
          {tags.map((tag, idx) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[11px] font-bold text-[#9ab0c7] hover:bg-white/10 hover:border-[#43a4ff]/50 hover:text-white transition-all cursor-default"
            >
              {tag}
            </motion.div>
          ))}
          <div className="px-4 py-2 rounded-xl border border-[#43a4ff]/20 bg-[#43a4ff]/5 text-[11px] font-bold text-[#43a4ff]">
            And More...
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-xl text-[#9ab0c7] font-medium">
            Plans starting at <span className="text-white font-bold">₹300.</span> Get <span className="text-emerald-400 font-black">25% OFF</span> with <span className="text-[#43a4ff] font-black">DIVYA100</span>
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <Button size="lg" className="bg-[#25c37a] hover:bg-[#1db06a] text-white font-black px-16 py-8 rounded-full text-2xl shadow-xl shadow-[#25c37a]/20 uppercase tracking-widest transform hover:scale-105 transition-all">
              Request Demo
            </Button>
            
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-[#43a4ff]/10 flex items-center justify-center text-[#43a4ff] group-hover:bg-[#43a4ff] group-hover:text-white transition-all">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold border-b-2 border-transparent group-hover:border-[#43a4ff] transition-all">Learn more</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function OperationsHub() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const settingsRef = doc(db, 'users', auth.currentUser.uid, 'avatar', 'settings');
    const unsub = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        // Initialize with default
        setDoc(settingsRef, {
          mode: 'Assist',
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    });

    return () => unsub();
  }, []);

  const changeProtocol = async (mode: string) => {
    if (!auth.currentUser) return;
    try {
      const settingsRef = doc(db, 'users', auth.currentUser.uid, 'avatar', 'settings');
      await updateDoc(settingsRef, { 
        mode,
        updatedAt: serverTimestamp() 
      });
      toast.success(`Success: Operational Mode set to ${mode}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update AI mode");
    }
  };

  const handleAudit = () => {
    setIsAnalyzing(true);
    toast.info("SuperAGI is performing a deep business audit...");
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Audit Complete: 100% Data Consistency Verified.");
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* SaaS Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
        {[
          { k: 'SaaS Subscription Rev', v: '₹8.4L', icon: HandCoinsIcon, color: 'text-[#43a4ff]' },
          { k: 'Active DSA Nodes', v: '342', icon: Globe, color: 'text-[#25c37a]' },
          { k: 'Loan File Syncs', v: '12k', icon: Zap, color: 'text-amber-400' },
          { k: 'Platform Uptime', v: '99.9%', icon: Activity, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.k} className="bg-[#111c27] p-6 rounded-3xl border border-[#203548] space-y-4">
            <div className="flex justify-between items-center">
              <s.icon className={cn("w-5 h-5", s.color)} />
              <Badge variant="outline" className="border-white/5 text-[9px]">Live</Badge>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#9ab0c7] uppercase tracking-widest mb-1">{s.k}</p>
              <p className="text-3xl font-black tracking-tight text-white">{s.v}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Operational Modes Section */}
      <div className="bg-[#111c27] p-8 rounded-[3rem] border border-[#203548] space-y-8 shadow-2xl text-left">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Cpu className="w-5 h-5 text-[#43a4ff]" />
              AI Operational Protocol
            </h2>
            <p className="text-xs text-[#9ab0c7] font-medium uppercase tracking-widest">Select how LAILA interacts with your business engine</p>
          </div>
          <Badge className="bg-[#43a4ff]/10 text-[#43a4ff] border-[#43a4ff]/20 px-4 py-1">
            Current: {settings?.mode || 'Loading...'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AI_PROTOCOLS.map((protocol) => (
            <button
              key={protocol.id}
              onClick={() => changeProtocol(protocol.id)}
              className={cn(
                "p-6 rounded-[2rem] border transition-all text-left flex flex-col gap-4 group relative overflow-hidden",
                settings?.mode === protocol.id 
                  ? "bg-white/5 border-[#43a4ff] shadow-xl shadow-[#43a4ff]/10" 
                  : "bg-white/[0.02] border-[#203548] hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", protocol.bg, protocol.color)}>
                <protocol.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-white group-hover:text-[#43a4ff] transition-colors">{protocol.id}</h3>
                <p className="text-[10px] text-[#9ab0c7] leading-relaxed uppercase font-bold tracking-tight">
                  {protocol.description}
                </p>
              </div>
              {settings?.mode === protocol.id && (
                <div className="absolute top-4 right-4 text-[#43a4ff]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 text-left">
        {/* Core Analysis */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#111c27] p-8 rounded-[3rem] border border-[#203548] relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-xl font-bold flex items-center gap-3 italic">
                <Terminal className="w-5 h-5 text-[#43a4ff]" />
                LAILA Operating Terminal
              </h2>
              <span className="text-[10px] font-bold text-[#43a4ff] uppercase tracking-[0.2em] animate-pulse">Analyzing Workflow...</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 relative z-10">
              <div className="space-y-6">
                <div className="p-16 border-2 border-dashed border-[#203548] rounded-[2.5rem] flex flex-col items-center justify-center gap-4 bg-[#0b141d]/50 hover:bg-[#43a4ff]/5 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Cloud className="w-8 h-8 text-[#9ab0c7]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Connect Data Stream</p>
                    <p className="text-[10px] text-[#9ab0c7] uppercase mt-1">CRM • ANALYTICS • LOGS</p>
                  </div>
                </div>
                <Button 
                  onClick={handleAudit}
                  disabled={isAnalyzing}
                  className="w-full h-16 rounded-2xl bg-[#43a4ff] hover:bg-[#348ee0] text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-[#43a4ff]/20"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
                  Run Deep System Audit
                </Button>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-[#0b141d] border border-[#203548] space-y-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#25c37a]/10 blur-3xl rounded-full" />
                   <h3 className="text-[10px] font-bold text-[#25c37a] uppercase tracking-widest flex items-center gap-2 relative z-10">
                    <Brain className="w-3 h-3" />
                    LAILA SaaS Advisor
                  </h3>
                  <p className="text-xs leading-relaxed italic text-white/80 font-medium relative z-10">
                    "Boss, our Divyanshi V1 Loan OS is ready for the new DSA integration. Shall I trigger the onboarding sequence for the new batch?"
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-[#9ab0c7] uppercase tracking-widest px-2">Operational Efficiency</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-[#9ab0c7] font-bold mb-1">Response TAT</p>
                      <p className="text-xl font-bold text-white">0.4s</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-[#9ab0c7] font-bold mb-1">Uptime</p>
                      <p className="text-xl font-bold text-[#25c37a]">99.9%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#43a4ff]/10 blur-[100px] rounded-full" />
          </div>
        </div>

        {/* Global Operations */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#111c27] p-8 rounded-[3rem] border border-[#203548] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#9ab0c7]">Global Operations</h2>
              <Badge variant="ghost" className="text-[#43a4ff] font-bold">Live Stream</Badge>
            </div>
            <div className="space-y-4">
              {[
                { name: 'US-East Node', city: 'Active', type: 'API', amt: '2k r/s', status: 'HEALTHY' },
                { name: 'Marketing Engine', city: 'Running', type: 'CRON', amt: 'Auto', status: 'SYNC' },
                { name: 'Billing Service', city: 'Ready', type: 'SEC', amt: 'Secure', status: 'STABLE' },
              ].map((op) => (
                <div key={op.name} className="p-5 rounded-2xl bg-[#0b141d] border border-[#203548] hover:border-[#43a4ff]/40 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white group-hover:text-[#43a4ff] transition-colors">{op.name}</h4>
                      <p className="text-[10px] text-[#9ab0c7] uppercase font-medium">{op.city} • {op.type} • {op.amt}</p>
                    </div>
                    <Badge className={cn(
                      "text-[8px] font-black",
                      op.status === 'HEALTHY' ? 'bg-[#25c37a]/20 text-[#25c37a]' : 'bg-amber-500/20 text-amber-500'
                    )}>{op.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[3rem] border border-[#203548] bg-gradient-to-br from-[#111c27] to-[#071018] relative overflow-hidden group">
            <div className="relative z-10 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-[#43a4ff]/10 flex items-center justify-center text-[#43a4ff]">
                 <Combine className="w-8 h-8" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm">System Integrator</h3>
              <p className="text-[10px] text-[#9ab0c7] leading-relaxed italic uppercase font-bold">
                Connect your legacy stack to SuperAGI with 1 Click.
              </p>
              <Button variant="outline" className="w-full border-white/10 rounded-xl hover:bg-white/5 uppercase text-[10px] font-bold h-12">
                Launch Bridge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationHub() {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-12 duration-700">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { label: 'Cloud Dialer', desc: 'Enterprise voice connectivity.', icon: Phone, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Omni-Channel SDK', desc: 'Connect WhatsApp, Email & SMS.', icon: MessageCircle, color: 'text-[#43a4ff]', bg: 'bg-[#43a4ff]/10' },
          { label: 'BI Parser', desc: 'Automatic data visualization.', icon: Mail, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Global Wallet', desc: 'Multi-currency SaaS billing.', icon: HandCoinsIcon, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'QDN Core', desc: 'Divyanshi business oversight.', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Channel Manager', desc: 'Track every dollar of ROI.', icon: FilterIcon, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map((int) => (
          <div key={int.label} className="bg-[#111c27] p-10 rounded-[3rem] border border-[#203548] flex flex-col items-start gap-6 hover:border-[#43a4ff]/30 transition-all cursor-pointer group">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", int.bg, int.color)}>
              <int.icon className="w-7 h-7" />
            </div>
            <div className="space-y-2 text-left">
              <h3 className="text-xl font-bold text-white">{int.label}</h3>
              <p className="text-xs text-[#9ab0c7] leading-relaxed uppercase tracking-widest font-bold">{int.desc}</p>
            </div>
            <div className="w-full flex justify-between items-center py-4 border-t border-[#203548] mt-4">
              <span className="text-[10px] font-bold text-[#25c37a] uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#25c37a] animate-pulse" />
                Live Sync
              </span>
              <ChevronRight className="w-4 h-4 text-[#9ab0c7] group-hover:text-[#43a4ff] translate-x-0 group-hover:translate-x-2 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffRegistryView() {
  const [followUpTarget, setFollowUpTarget] = useState<any>(null);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveFollowUp = async () => {
    if (!auth.currentUser || !followUpTarget || !followUpDate) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'followups'), {
        targetName: followUpTarget.name,
        targetEmail: followUpTarget.email,
        targetRole: followUpTarget.role,
        scheduledAt: new Date(followUpDate),
        notes: followUpNotes,
        createdBy: auth.currentUser.uid,
        creatorEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      toast.success(`Follow-up scheduled with ${followUpTarget.name}`);
      setFollowUpTarget(null);
      setFollowUpDate('');
      setFollowUpNotes('');
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule follow-up");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">P1 Master Employee Registry</h2>
          <p className="text-xs text-[#43a4ff] font-bold uppercase tracking-widest mt-1">Direct Link to All_Employee Logic</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-[#203548] text-white uppercase text-[10px] font-black h-12 px-6">
            <RefreshCw className="w-4 h-4 mr-2" /> Sync Registry
          </Button>
          <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white uppercase text-[10px] font-black h-12 px-6">
            <Plus className="w-4 h-4 mr-2" /> Add Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Strength', val: ALL_EMPLOYEES.length, icon: Users, color: 'text-blue-400' },
          { label: 'Active Nodes', val: ALL_EMPLOYEES.filter(e => e.status === 'ACTIVE').length, icon: Activity, color: 'text-emerald-400' },
          { label: 'Departments', val: new Set(ALL_EMPLOYEES.map(e => e.department)).size, icon: Grid, color: 'text-purple-400' },
          { label: 'Branch Hubs', val: new Set(ALL_EMPLOYEES.map(e => e.branch)).size, icon: Globe, color: 'text-amber-400' },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#111c27] border-[#203548] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-xl bg-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="border-white/5 text-[8px]">Live Data</Badge>
            </div>
            <p className="text-[10px] font-bold text-[#9ab0c7] uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{stat.val}</p>
          </Card>
        ))}
      </div>

      <Card className="bg-[#111c27] border-[#203548] shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/[0.01]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                className="w-full bg-[#0b141d] border-[#203548] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#43a4ff] placeholder:text-slate-600"
                placeholder="Search Employee Code, Name or Brand..."
              />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-slate-500">
                <FilterIcon className="w-3 h-3 mr-1" /> Filter
              </Button>
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-slate-500">
                <FileText className="w-3 h-3 mr-1" /> Export CSV
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black border-b border-white/5 bg-black/20">
                <th className="px-6 py-4">Emp Code</th>
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Role & Dept</th>
                <th className="px-6 py-4">Brand/Branch</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ALL_EMPLOYEES.map((employee) => (
                <tr key={employee.empCode} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="border-white/10 text-white font-mono text-[10px] bg-white/5">
                      {employee.empCode}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-xs font-black ring-1 ring-orange-500/20">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{employee.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-bold text-white uppercase italic">{employee.role}</p>
                    <p className="text-[9px] text-[#43a4ff] font-black uppercase tracking-widest">{employee.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{employee.brand}</span>
                       <span className="text-[9px] text-slate-600 font-bold uppercase">{employee.branch}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-500 hover:text-orange-500 group"
                        onClick={() => setFollowUpTarget(employee)}
                      >
                        <Clock className="w-4 h-4 group-hover:scale-110 transition-all" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white group">
                        <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-all" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
           <Shield className="w-6 h-6" />
        </div>
        <div>
           <p className="text-xs font-black text-white uppercase italic">Sovereign HR Matrix Sync Active</p>
           <p className="text-[10px] text-slate-500 font-bold uppercase">All changes are automatically pushed to 1xR-UyH8LXvAEacGXL8ZQA7nS7hJds2zlMtzxr6iiuGs</p>
        </div>
      </div>

      <Dialog open={!!followUpTarget} onOpenChange={(open) => !open && setFollowUpTarget(null)}>
        <DialogContent className="bg-[#0b141d] border-[#203548] text-white rounded-3xl p-8">
          <DialogHeader className="mb-6 text-left">
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">
              Schedule Follow-Up
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              Set a reminder to connect with {followUpTarget?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#9ab0c7]">Follow-Up Date & Time</Label>
              <Input 
                type="datetime-local" 
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="bg-white/5 border-white/10 text-white h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#9ab0c7]">Strategic Notes</Label>
              <textarea 
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                placeholder="Enter follow-up agenda or notes..."
                className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#43a4ff] placeholder:text-slate-600"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                className="rounded-xl border-white/10 hover:bg-white/5 uppercase text-[10px] font-bold px-6 h-12"
                onClick={() => setFollowUpTarget(null)}
              >
                Cancel
              </Button>
              <Button 
                disabled={isSaving || !followUpDate}
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white uppercase text-[10px] font-bold px-6 h-12 shadow-lg shadow-orange-500/20"
                onClick={handleSaveFollowUp}
              >
                {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Clock className="mr-2" />}
                Confirm Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Fixed Lucide Icons for completeness
function FileSearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22V4a2 2 0 0 1 2-2h8.5L20 7.5V22" />
      <path d="M14 2v6h6" />
      <circle cx="11.5" cy="15.5" r="2.5" />
      <path d="M13.3 17.3 15 19" />
    </svg>
  )
}
