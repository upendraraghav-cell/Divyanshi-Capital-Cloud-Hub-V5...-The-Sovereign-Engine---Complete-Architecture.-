import { 
  Users, 
  TrendingUp, 
  Clock, 
  Wallet, 
  UserPlus, 
  Send, 
  BarChart4,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Search,
  Sparkles,
  Shield,
  Activity,
  Cpu,
  Zap,
  CheckCircle2,
  Brain,
  Rocket,
  Building2,
  PhoneCall,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  FileText,
  Info,
  BarChart as BarChartIcon,
  Database,
  Plus,
  Radio
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { db, collection, onSnapshot, query, orderBy, limit } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SYSTEM_NOTIFICATIONS } from '@/data/notifications';
import { 
  Activity as ActivityInfo,
  ActivityService 
} from '@/services/activityService';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  Bar,
  CartesianGrid
} from 'recharts';

import { toast } from 'sonner';

export function Dashboard({ user }: { user: any }) {
  const [taskCount, setTaskCount] = useState(0);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [recentWebhooks, setRecentWebhooks] = useState<any[]>([]);
  const [activities, setActivities] = useState<ActivityInfo[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInboxSyncing, setIsInboxSyncing] = useState(false);
  const isAdmin = user?.role === 'admin' || user?.role === 'Managing Director' || user?.role === 'SaaS Administrator' || user?.role === 'Boss' || user?.role === 'MD';

  const fetchWebhooks = async () => {
    try {
      const res = await fetch('/api/webhooks/recent');
      if (!res.ok) return;
      const data = await res.json();
      if (data.ok) setRecentWebhooks(data.webhooks);
    } catch (e) {
      // Silently ignore network errors during periodic polling
    }
  };

  useEffect(() => {
    fetchWebhooks();
    const interval = setInterval(fetchWebhooks, 5000);
    
    // Subscribe to intelligence activities
    const unsubscribeActivities = ActivityService.subscribeToRecent((newActivities) => {
      setActivities(newActivities);
    }, 15);

    return () => {
      clearInterval(interval);
      unsubscribeActivities();
    };
  }, []);

  const handleRegistrySync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/gas/registry-sync');
      const data = await res.json();
      if (data.ok) {
        toast.success("Neural Matrix Registry Synced with GAS Bridge");
      }
      await fetchWebhooks();
    } catch (e) {
      toast.error("Registry Sync Failure");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleInboxSync = async () => {
    setIsInboxSyncing(true);
    try {
      const res = await fetch('/api/mis/sync');
      const data = await res.json();
      if (data.ok) {
        toast.success(`MD Inbox Synced! Updates: ${data.updatedLeads} | Conflicts: ${data.conflictsResolved}`);
      }
    } catch (e) {
      toast.error("Inbox Sync Failure");
    } finally {
      setIsInboxSyncing(false);
    }
  };

  const handleBootstrapBackend = async () => {
    const configLine = import.meta.env.VITE_ALL_IN_ONE_CONFIG;
    if (!configLine || configLine === "{}") {
      toast.error("VITE_ALL_IN_ONE_CONFIG variable is missing in environment.");
      return;
    }

    const toastId = toast.loading("Stabilizing Sovereign Backend...");
    try {
      const { gasService } = await import('@/services/gasService');
      const res = await gasService.setAllInOneConfig(configLine);
      if (res.ok) {
        toast.success("All-In-One Config Primed on Sovereign Backend", { id: toastId });
      } else {
        toast.error(res.error || "Bootstrap Failed", { id: toastId });
      }
    } catch (e) {
      toast.error("Handshake Error", { id: toastId });
    }
  };

  const isMasterView = user?.role === 'MD' || user?.role === 'Managing Director' || user?.role === 'Boss' || user?.role === 'SaaS Administrator' || user?.role === 'Admin';
  const isSaaSAdmin = user?.role === 'SaaS Administrator' || user?.role === 'Admin';
  const personalFileId = user?.personalFileId || 'GUEST-NODE';
  const serverId = user?.serverId || 'SYSTEM_CORE';

  const [marketingStats, setMarketingStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v2/marketing/stats')
      .then(res => res.json())
      .then(data => {
        if (data.ok) setMarketingStats(data.stats);
      })
      .catch(() => {});
  }, []);

  // Role-based feed filtering
  const dashboardNotifications = SYSTEM_NOTIFICATIONS.filter(n => {
    if (isSaaSAdmin || user?.role === 'Boss') return true;
    if (user?.role === 'Managing Director' || user?.role === 'MD') return (n.role === 'BRAND_MD' && n.brand === user.brand) || n.role === 'SAAS_BOSS';
    if (user?.role === 'Coordinator') return n.role === 'STAFF' || n.brand === user.brand;
    return n.role === 'STAFF';
  }).slice(0, 4);

  useEffect(() => {
    const qTasks = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
      setTaskCount(snapshot.size); 
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentTasks(items.slice(0, 3));
    });
    return () => unsubscribeTasks();
  }, []);

  const stats = [
    { label: 'Loan Disbursed', value: '₹54.2L', change: 'Daily Target', icon: Wallet, color: 'text-emerald-500', trend: 'up' },
    { label: 'Files Logged', value: '184', change: 'Neural Matrix', icon: CheckCircle2, color: 'text-orange-500', trend: 'up' },
    { label: 'Active Leads', value: '2,481', change: '84% Hot', icon: Cpu, color: 'text-blue-400', trend: 'up' },
    { label: 'Portal Status', value: 'OFFICIAL', change: 'Sovereign V4', icon: Zap, color: 'text-purple-500', trend: 'up' },
  ];

  const recentClients = [
    { name: 'Rahul Sharma', email: 'rahul@sharmalog.in', plan: 'Enterprise', status: 'Active', date: '2 mins ago', company: 'Sharma Logistics' },
    { name: 'Anita Desai', email: 'anita@desaireal.com', plan: 'Executive', status: 'Active', date: '5 mins ago', company: 'Desai Estates' },
    { name: 'Vikram Singh', email: 'vikram@singh.com', plan: 'Basic', status: 'Trial', date: '1 hour ago', company: 'Singh Corp' },
    { name: 'Priya Verma', email: 'priya@vermatech.io', plan: 'Enterprise', status: 'Active', date: '4 hours ago', company: 'Verma Innovations' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 2000 },
    { month: 'Apr', revenue: 2780 },
    { month: 'May', revenue: 1890 },
    { month: 'Jun', revenue: 2390 },
    { month: 'Jul', revenue: 3490 },
  ];

  if (isMasterView) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <Badge className="bg-orange-500/10 text-orange-500 border-none text-[8px] font-black uppercase tracking-[0.2em]">P1 Neural Matrix: Active</Badge>
               <Badge className="bg-blue-500/10 text-blue-500 border-none text-[8px] font-black uppercase tracking-[0.2em]">Bulbhul Hook: Primed</Badge>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
              Divyanshi Capital P1 Master
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Sovereign Registry Control & Loan OS Core Execution</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-right hidden xl:block">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Bulbhul Neural ID</p>
                <p className="text-xs font-mono text-blue-400">BULBHUL_P1_BRIDGE_STABLE</p>
             </div>
             <Button 
                variant="outline" 
                onClick={handleRegistrySync}
                disabled={isSyncing}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] h-14"
              >
                 {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2 text-orange-500" />}
                 Force P1 Sync
              </Button>
              <Button 
                variant="outline" 
                onClick={handleInboxSync}
                disabled={isInboxSyncing}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] h-14"
              >
                 {isInboxSyncing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />}
                 Neural MIS Sync
              </Button>
          </div>
        </div>

        {/* AI Intelligence Header - AI Studio Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-[#43a4ff]/5 border-[#43a4ff]/10 overflow-hidden relative shadow-2xl">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#43a4ff]/10 rounded-full blur-3xl" />
            <div className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-[#43a4ff] text-white uppercase text-[8px]">Master Hub Prediction</Badge>
                <Badge variant="outline" className="border-white/10 text-slate-500 uppercase tracking-widest text-[9px]">Direct Matrix Access</Badge>
              </div>
              <h3 className="text-4xl font-black italic tracking-tight text-white mb-1">Global Target: 82%</h3>
              <p className="text-slate-400 font-medium text-sm">
                Enterprise level dashboard with multi-brand registry control. Direct link to Master Spreadsheet nodes.
              </p>
              <div style={{ width: '100%', height: '250px' }} className="mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#43a4ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#43a4ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#43a4ff" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900 border-white/5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl" />
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                   <Brain className="w-6 h-6" />
                 </div>
                 <Badge className="bg-orange-500/10 text-orange-500 border-none text-[8px] font-black uppercase">Live Logs</Badge>
               </div>
               <div className="space-y-3">
                 {dashboardNotifications.map((n, i) => (
                   <div key={`notif-${n.id || i}`} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 group hover:border-orange-500/30 transition-all cursor-pointer">
                     <div className="flex gap-3">
                        <div className={cn(
                         "p-2 rounded-lg bg-white/5",
                         n.type === 'ALERT' ? 'text-rose-500' : 'text-blue-500'
                        )}>
                         {n.role === 'SAAS_BOSS' ? <Rocket className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                        </div>
                        <div className="flex flex-col">
                         <span className="text-[10px] font-black text-white leading-none uppercase italic">{n.title}</span>
                         <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1 line-clamp-1">{n.description}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             <div className="p-6 bg-white/[0.02] border-t border-white/5">
                <Button variant="ghost" className="w-full justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest group">
                  View Full Intelligence <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
             </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'P1 Master Disbursals', val: '₹ 8.2Cr', trend: '+12%', icon: Zap, color: 'text-orange-500' },
             { label: 'Active Sales Log', val: '1,240', trend: 'MIS Live', icon: TrendingUp, color: 'text-blue-500' },
             { label: 'HR MD Approvals', val: '42 Pending', trend: 'Neural Bridge', icon: Shield, color: 'text-emerald-500' },
             { label: 'Registry Health', val: 'STABLE', trend: 'TAT Master', icon: Building2, color: 'text-purple-500' }
           ].map((stat, i) => (
             <Card key={`top-stat-${i}`} className="bg-slate-900 border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent blur-2xl group-hover:bg-white/10 transition-all" />
               <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                     <div className={cn("p-3 rounded-2xl bg-white/5", stat.color)}>
                        <stat.icon className="w-6 h-6" />
                     </div>
                     <Badge variant="outline" className="text-[8px] border-white/10 text-slate-500">{stat.trend}</Badge>
                  </div>
                  <div className="mt-4">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                     <p className="text-2xl font-black text-white italic tracking-tighter mt-1">{stat.val}</p>
                  </div>
               </CardContent>
             </Card>
           ))}
        </div>

        {/* Digital Marketing ROI Matrix */}
        <div className="grid lg:grid-cols-3 gap-6">
           <Card className="lg:col-span-2 bg-[#111c27] border-[#203548] p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8">
                <Badge className="bg-emerald-500/10 text-emerald-500 uppercase text-[9px] font-black">ROI Tracking Active</Badge>
             </div>
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                      <BarChartIcon className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-white uppercase italic">SaaS Marketing Matrix</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Growth vs Spend Analytics</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {[
                     { label: 'Marketing Spend', val: marketingStats ? '₹' + Number(marketingStats.spend).toLocaleString('en-IN') : '₹1.25L', icon: Wallet, color: 'text-orange-500' },
                     { label: 'Neural Leads', val: marketingStats?.leads || '2,481', icon: Cpu, color: 'text-blue-400' },
                     { label: 'Master Convr.', val: marketingStats?.conversions || '184', icon: CheckCircle2, color: 'text-emerald-400' },
                     { label: 'ROAS', val: marketingStats?.roas ? marketingStats.roas + 'x' : '4.8x', icon: TrendingUp, color: 'text-purple-400' }
                   ].map((m, idx) => (
                     <div key={`marketing-stat-${idx}`} className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{m.label}</p>
                        <p className="text-xl font-black text-white italic tracking-tighter flex items-center gap-2">
                           <m.icon className={cn("w-3 h-3", m.color)} />
                           {m.val}
                        </p>
                     </div>
                   ))}
                </div>

                <div style={{ width: '100%', height: '200px' }} className="mt-4">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#203548" vertical={false} />
                         <XAxis dataKey="month" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                         <YAxis hide />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#111c27', border: '1px solid #203548', borderRadius: '12px', fontSize: '10px' }}
                            itemStyle={{ color: '#fff' }}
                         />
                         <Bar dataKey="revenue" fill="#43a4ff" radius={[4, 4, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
           </Card>

           <Card className="bg-gradient-to-br from-[#111c27] to-[#0a131d] border-[#203548] p-8 flex flex-col justify-between">
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#43a4ff]/10 text-[#43a4ff] flex items-center justify-center">
                       <Rocket className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-white uppercase italic">SaaS Node Earnings</h4>
                 </div>
                 
                 <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Estimated Monthly</p>
                          <p className="text-2xl font-black text-white italic">₹ 5.42L</p>
                       </div>
                       <Badge className="bg-emerald-500/20 text-emerald-500 border-none text-[8px] font-black uppercase tracking-widest">+18.4%</Badge>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                          className="h-full bg-orange-500"
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                       />
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium uppercase tracking-[0.2em] text-center">Neural Matrix Scalability: PRIME</p>
                 </div>
              </div>

              <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] mt-8 shadow-xl shadow-blue-500/20">
                 Scale Marketing Engine
              </Button>
           </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 bg-slate-900 border-white/5 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                 <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                   <Database className="w-4 h-4 text-orange-500" /> Recent Node Activations
                 </h3>
                 <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest italic">P1 Master Output</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black border-b border-white/5 bg-black/20">
                      <th className="px-6 py-4">Node Profile</th>
                      <th className="px-6 py-4">Company Entity</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Last Sync</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentClients.map((client) => (
                      <tr key={client.email} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-xs font-black ring-1 ring-orange-500/20 shadow-lg shadow-orange-500/10">
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{client.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{client.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">{client.company}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{client.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{client.date}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </Card>

           <Card className="bg-slate-900 border-white/5 flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                 <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" /> Master Intelligence
                 </h3>
                 <Badge className="bg-orange-500/10 text-orange-500 border-none text-[8px] font-black uppercase shadow-lg shadow-orange-500/10">Live</Badge>
              </div>
              <CardContent className="p-6 flex-1 space-y-3 overflow-y-auto max-h-[460px] no-scrollbar">
                {activities.length > 0 ? activities.map((activity) => (
                  <div key={activity.id} className="p-3 bg-black/20 border border-white/5 rounded-xl group hover:border-orange-500/30 transition-all">
                    <div className="flex items-center justify-between mb-1">
                       <span className={cn(
                         "text-[9px] font-black uppercase italic",
                         activity.type === 'ai' ? "text-purple-400" : 
                         activity.type === 'intelligence' ? "text-blue-400" : 
                         activity.type === 'campaign' ? "text-emerald-400" : "text-slate-400"
                       )}>
                         {activity.type} Node
                       </span>
                       <span className="text-[8px] text-slate-500 font-mono">
                         {activity.timestamp?.toDate ? activity.timestamp.toDate().toLocaleTimeString() : '...'}
                       </span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight">
                       {activity.message}
                    </p>
                  </div>
                )) : (
                  <div className="h-full flex items-center justify-center flex-col text-slate-600 gap-2 opacity-50">
                    <Brain className="w-8 h-8" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Scanning Neural Pathways...</p>
                  </div>
                )}
              </CardContent>
              <div className="p-4 bg-white/[0.02] border-t border-white/5">
                 <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest text-center">Global Matrix Protocol: V4.2.1 Stable</p>
              </div>
           </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Smart Intake Matrix */}
      <Card className="bg-gradient-to-br from-[#43a4ff]/10 to-transparent border-[#43a4ff]/20 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#43a4ff]/5 blur-3xl rounded-full" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-[#43a4ff]/20 text-[#43a4ff]">
                <Rocket className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Smart Intake Matrix</h2>
            </div>
            <p className="text-xs text-[#43a4ff] font-bold uppercase tracking-[0.3em] mt-1">Neural Node Input Primed & Ready</p>
          </div>
          <Button className="bg-[#43a4ff] hover:bg-[#43a4ff]/90 text-white rounded-2xl h-14 px-8 font-black text-[11px] tracking-[0.2em] uppercase shadow-xl shadow-[#43a4ff]/20 w-full md:w-auto">
            <Plus className="w-5 h-5 mr-3" /> Start New Intake
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 relative z-10">
           {[
             { label: 'Client Lead', icon: UserPlus },
             { label: 'Process Docs', icon: FileText },
             { label: 'HR Sync', icon: Users },
             { label: 'Loan Ops', icon: Zap }
           ].map(item => (
              <div key={item.label} className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-[#43a4ff]/40 transition-all cursor-pointer group hover:bg-white/10 active:scale-95">
                <item.icon className="w-5 h-5 text-[#43a4ff] mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-black text-white italic uppercase tracking-widest">{item.label}</p>
                <div className="h-1 w-8 bg-[#43a4ff]/30 mt-3 rounded-full group-hover:w-full transition-all duration-500" />
              </div>
           ))}
        </div>
      </Card>

      {/* Mini App Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-orange-500/10 border-orange-500/20 p-6 flex flex-col justify-between aspect-square group cursor-pointer hover:bg-orange-500/20 transition-all relative overflow-hidden shadow-xl hover:shadow-orange-500/10">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
          <div className="p-4 bg-orange-500 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
            <PhoneCall className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1 relative z-10 mt-auto">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Dialer Matrix</p>
            <p className="text-2xl font-black text-white italic leading-[1] uppercase tracking-tighter">Launch <br />Calls</p>
          </div>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/20 p-6 flex flex-col justify-between aspect-square group cursor-pointer hover:bg-blue-500/20 transition-all relative overflow-hidden shadow-xl hover:shadow-blue-500/10">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
          <div className="p-4 bg-blue-500 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1 relative z-10 mt-auto">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Client Sync</p>
            <p className="text-2xl font-black text-white italic leading-[1] uppercase tracking-tighter">Log <br />File</p>
          </div>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/20 p-6 flex flex-col justify-between aspect-square group cursor-pointer hover:bg-purple-500/20 transition-all relative overflow-hidden shadow-xl hover:shadow-purple-500/10">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
          <div className="p-4 bg-purple-500 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
            <BarChartIcon className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1 relative z-10 mt-auto">
            <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Analytics</p>
            <p className="text-2xl font-black text-white italic leading-[1] uppercase tracking-tighter">My <br />Krs</p>
          </div>
        </Card>

        <Card className="bg-emerald-500/10 border-emerald-500/20 p-6 flex flex-col justify-between aspect-square group cursor-pointer hover:bg-emerald-500/20 transition-all relative overflow-hidden shadow-xl hover:shadow-emerald-500/10">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="p-4 bg-emerald-500 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1 relative z-10 mt-auto">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Signals</p>
            <p className="text-2xl font-black text-white italic leading-[1] uppercase tracking-tighter">New <br />Leads</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-slate-900 border-white/5 overflow-hidden shadow-2xl">
          <div className="bg-white/5 p-5 flex items-center justify-between border-b border-white/5">
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Activity className="w-5 h-5 text-orange-500" /> Velocity Matrix
            </h3>
            <Badge className="bg-orange-500/10 text-orange-500 border-none text-[9px] font-black uppercase tracking-tight shadow-lg shadow-orange-500/10 px-3">Active Duty</Badge>
          </div>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Node Contribution</span>
                <span className="text-white italic">₹8.4L / ₹12L</span>
              </div>
              <div className="w-full h-4 bg-black rounded-full overflow-hidden ring-1 ring-white/10 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '74%' }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-orange-500/30 transition-all">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Calls Today</p>
                <p className="text-4xl font-black text-white italic tracking-tighter">142</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-orange-500/30 transition-all">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Approval Log</p>
                <p className="text-4xl font-black text-white italic tracking-tighter">03</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-white/5 overflow-hidden shadow-2xl flex flex-col">
           <div className="bg-white/5 p-5 flex items-center justify-between border-b border-white/5">
              <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-3">
                <Rocket className="w-5 h-5 text-blue-500" /> Neural Uplink
              </h3>
              <Badge className="bg-blue-500/10 text-blue-500 border-none text-[9px] font-black uppercase tracking-tight px-3">Synced</Badge>
           </div>
           <CardContent className="p-8 flex-1 flex flex-col justify-center space-y-6">
             {[
               { label: 'MASTER_FILE_ID', id: personalFileId, status: 'MASTER', color: 'text-blue-400' },
               { label: 'SERVER_ID', id: serverId.slice(0, 16), status: 'LIVE', color: 'text-orange-400' },
               { label: 'NEURAL_BRIDGE', id: 'BRIDGE_V4_SECURE', status: 'STABLE', color: 'text-emerald-400' },
             ].map((node, i) => (
               <div key={`node-latch-${i}`} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                 <div>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{node.label}</p>
                   <p className={cn("text-xs font-mono font-bold leading-none", node.color)}>{node.id}</p>
                 </div>
                 <Badge className="bg-white/5 text-slate-600 border-none text-[8px] font-bold uppercase tracking-[0.2em]">{node.status}</Badge>
               </div>
             ))}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
