import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Settings2,
  GripVertical,
  Bell,
  RefreshCw,
  LayoutGrid,
  Zap,
  Briefcase,
  PieChart,
  BarChart3,
  Activity
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface KPIData {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: any;
  color: string;
  category: 'growth' | 'finance' | 'ops' | 'system';
}

interface GenieDashboardProps {
  user: any;
}

export function GenieDashboard({ user }: GenieDashboardProps) {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  // All Available KPIs
  const ALL_KPIS: KPIData[] = [
    { id: 'leads', title: 'Leads Today', value: '1,284', change: 12.5, icon: Users, color: 'text-cyan-500', category: 'growth' },
    { id: 'cases', title: 'Active Cases', value: '342', change: -2.4, icon: Briefcase, color: 'text-orange-500', category: 'ops' },
    { id: 'disbursals', title: 'Disbursals', value: '₹54.2L', change: 8.1, icon: Wallet, color: 'text-emerald-500', category: 'finance' },
    { id: 'pending', title: 'Inbox Pending', value: '18', change: 15.0, icon: MessageSquare, color: 'text-purple-500', category: 'system' },
    { id: 'revenue', title: 'Daily Revenue', value: '₹2.8L', change: 4.2, icon: TrendingUp, color: 'text-gold-500', category: 'finance' },
    { id: 'uptime', title: 'Neural Sync', value: '99.9%', change: 0.1, icon: Zap, color: 'text-blue-400', category: 'system' }
  ];

  // Selected KPIs and their order
  const [kpis, setKpis] = useState<KPIData[]>(ALL_KPIS.slice(0, 4));

  const toggleKpi = (kpi: KPIData) => {
    if (kpis.find(k => k.id === kpi.id)) {
      if (kpis.length > 1) {
        setKpis(kpis.filter(k => k.id !== kpi.id));
      } else {
        toast.error("At least one KPI must be visible.");
      }
    } else {
      setKpis([...kpis, kpi]);
    }
  };

  const isAdmin = user?.role === 'MD' || user?.role === 'Managing Director' || user?.role === 'Boss' || user?.role === 'SaaS Administrator' || user?.role === 'Admin';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch GET_DASHBOARD Equivalent
      const dashboardRes = await fetch('/api/v2/genie/dashboard');
      const dashboardJson = await dashboardRes.json();
      
      // Fetch GET_MD_SNAPSHOT if Admin
      let snapshotJson: any = { ok: false };
      if (isAdmin) {
        const snapshotRes = await fetch('/api/v2/genie/snapshot');
        snapshotJson = await snapshotRes.json();
      }

      if (dashboardJson.ok) {
        setDashboardData({
          ...dashboardJson.data,
          snapshot: snapshotJson.ok ? snapshotJson.data : null
        });
        
        // Update KPIs with real data if available
        if (dashboardJson.data?.stats) {
            setKpis(prev => prev.map(kpi => ({
                ...kpi,
                value: dashboardJson.data.stats[kpi.id]?.value || kpi.value,
                change: dashboardJson.data.stats[kpi.id]?.change || kpi.change
            })));
        }
      }

      // Mock Alerts
      setAlerts([
        { id: 1, title: 'High Disbursal Velocity', desc: 'Node 4 exceeds daily quota', type: 'success', time: '2m ago' },
        { id: 2, title: 'Unresolved Conflicts', desc: 'Registry sync failure in Sales Log', type: 'warning', time: '15m ago' },
        { id: 3, title: 'New Executive Task', desc: 'KYC Verification for Apex Corp', type: 'info', time: '1h ago' }
      ]);

    } catch (error) {
      console.error("Failed to fetch Genie data:", error);
      // fallback to mock for demo if needed, but we'll try real endpoints first
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  const chartData = useMemo(() => [
    { name: '00:00', value: 400 },
    { name: '04:00', value: 300 },
    { name: '08:00', value: 600 },
    { name: '12:00', value: 800 },
    { name: '16:00', value: 500 },
    { name: '20:00', value: 700 },
    { name: '23:59', value: 900 },
  ], []);

  const glassStyle = "bg-white/[0.03] border-white/10 backdrop-blur-3xl shadow-2xl rounded-[2.5rem]";

  return (
    <div className="space-y-10 pb-24 text-left">
      {/* Header with Role Intelligence */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-500/10 text-orange-500 border-none text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
              GENIE CRM SYSTEM V3
            </Badge>
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
              {isLoading ? 'Syncing Matrix...' : 'Uplink Stable'}
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.85]">
            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Console</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg max-w-xl">
             Personalized business overview for <span className="text-white font-bold">{user?.name || 'Authorized Node'}</span>. 
             Role: <span className="text-orange-500 font-bold uppercase">{user?.role || 'Guest'}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setIsConfiguring(!isConfiguring)}
            variant="outline" 
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-2xl h-14 px-6 font-black uppercase tracking-widest text-[10px]"
          >
            <Settings2 className="w-5 h-5 mr-3 text-orange-500" />
            Configure Widgets
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-500 text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-600/20">
            <Zap className="w-5 h-5 mr-3" />
            Neural Action
          </Button>
        </div>
      </div>

      {/* Configuration Panel */}
      <AnimatePresence>
        {isConfiguring && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 rounded-[2rem] bg-white/5 border border-orange-500/30 backdrop-blur-xl mb-10">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-orange-500" /> Matrix Configuration: Select Active KPIs
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {ALL_KPIS.map((kpi) => {
                  const isSelected = kpis.find(k => k.id === kpi.id);
                  return (
                    <button
                      key={kpi.id}
                      onClick={() => toggleKpi(kpi)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all text-left group",
                        isSelected 
                          ? "bg-orange-500/20 border-orange-500/50 text-white" 
                          : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                      )}
                    >
                      <kpi.icon className={cn("w-5 h-5 mb-3", isSelected ? "text-orange-500" : "text-slate-600")} />
                      <p className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{kpi.title}</p>
                      <div className={cn(
                        "mt-2 w-full h-1 rounded-full overflow-hidden",
                        isSelected ? "bg-orange-500/30" : "bg-white/5"
                      )}>
                        {isSelected && <motion.div layoutId={`config-bar-${kpi.id}`} className="h-full bg-orange-500 w-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Grid - Reorderable */}
      <div className="relative group">
        <Reorder.Group 
          axis="x" 
          values={kpis} 
          onReorder={setKpis}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {kpis.map((kpi) => (
            <Reorder.Item 
              key={kpi.id} 
              value={kpi}
              dragListener={isConfiguring}
              className={cn(
                "relative group flex flex-col",
                isConfiguring && "cursor-grab active:cursor-grabbing"
              )}
            >
              <Card className={cn(
                "h-full border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden transition-all duration-500",
                isConfiguring ? "ring-2 ring-orange-500/50 scale-[0.98]" : "hover:bg-white/[0.08] hover:-translate-y-1"
              )}>
                {isConfiguring && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-5 h-5 text-white" />
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10", kpi.color)}>
                      <kpi.icon className="w-7 h-7" />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-[11px] font-black tracking-tight",
                      kpi.change > 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {kpi.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(kpi.change)}%
                    </div>
                  </div>
                  <div className="mt-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{kpi.title}</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Business Overview Chart */}
        <Card className={cn(glassStyle, "lg:col-span-2 overflow-hidden relative shadow-2xl p-1")}>
          <div className="p-10 relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Business Velocity</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Live Neural Stream Performance</p>
              </div>
              <div className="flex gap-2">
                {['24H', '7D', '30D'].map(t => (
                  <Button key={t} variant="ghost" size="sm" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white">
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gradientOrange" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid #1e293b', 
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#f97316' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f97316" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#gradientOrange)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Latest Alerts & Notifications */}
        <Card className={cn(glassStyle, "flex flex-col")}>
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-orange-500" />
              <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Latest Alerts</h3>
            </div>
            <Badge className="bg-orange-500/10 text-orange-500 border-none text-[8px] font-black uppercase">Live Feed</Badge>
          </div>
          <CardContent className="p-6 space-y-4 overflow-y-auto max-h-[500px] no-scrollbar flex-1">
            <AnimatePresence initial={false}>
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-orange-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5",
                      alert.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                      alert.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                    )}>
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-white uppercase tracking-tight italic">{alert.title}</span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase">{alert.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{alert.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {alerts.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 py-20 opacity-50">
                <LayoutGrid className="w-12 h-12" />
                <p className="text-[10px] font-black uppercase tracking-widest">Matrix Silent</p>
              </div>
            )}
          </CardContent>
          <div className="p-6 bg-white/[0.02] border-t border-white/5">
             <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
               View Full Alert Matrix
             </Button>
          </div>
        </Card>
      </div>

      {/* Business Overview Insights */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
             <Briefcase className="w-4 h-4 text-orange-500" /> Business Overview Matrix
           </h3>
           <Button variant="ghost" size="sm" className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white">
             Expand Registry <ArrowUpRight className="w-3 h-3 ml-2" />
           </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={cn(glassStyle, "p-8 group hover:border-orange-500/30 transition-all")}>
             <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                   <TrendingUp className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase">On Target</Badge>
             </div>
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Projected Monthly Revenue</p>
             <p className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">₹1.42 Cr</p>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                   className="h-full bg-orange-500"
                   initial={{ width: 0 }}
                   animate={{ width: '84%' }}
                />
             </div>
          </Card>

          <Card className={cn(glassStyle, "p-8 group hover:border-blue-500/30 transition-all")}>
             <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                   <Users className="w-5 h-5" />
                </div>
                <Badge className="bg-blue-500/10 text-blue-500 border-none text-[8px] font-black uppercase">Prime Nodes</Badge>
             </div>
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Relationship Managers</p>
             <p className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">42 Active</p>
             <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#06112C] bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                    RM
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-[#06112C] bg-white/5 flex items-center justify-center text-[8px] font-black text-slate-500">
                  +37
                </div>
             </div>
          </Card>

          <Card className={cn(glassStyle, "p-8 group hover:border-purple-500/30 transition-all")}>
             <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                   <Activity className="w-5 h-5" />
                </div>
                <Badge className="bg-purple-500/10 text-purple-500 border-none text-[8px] font-black uppercase">Optimal Health</Badge>
             </div>
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Neural Bridge Latency</p>
             <p className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">14ms</p>
             <div className="flex items-end gap-1 h-8">
                {[4,6,3,8,5,9,4,7,5].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h*10}%` }}
                    className="flex-1 bg-purple-500/30 rounded-t-sm"
                  />
                ))}
             </div>
          </Card>
        </div>
      </div>

      {/* Role-Based Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'System Uptime', value: '99.98%', icon: Activity, color: 'text-emerald-400' },
          { label: 'Cloud Node', value: 'AsiaCore-01', icon: PieChart, color: 'text-blue-400' },
          { label: 'Active RMs', value: '42', icon: Users, color: 'text-orange-400' },
          { label: 'Neural Accuracy', value: '98.4%', icon: BarChart3, color: 'text-purple-400' }
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-xl font-black text-white italic tracking-tighter uppercase">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
