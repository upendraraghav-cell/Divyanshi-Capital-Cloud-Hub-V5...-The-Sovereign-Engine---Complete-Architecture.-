import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  MessageCircle,
  PhoneCall,
  Zap,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { gasService } from '@/services/gasService';

const chartData = [
  { name: 'Mon', leads: 45, disbursed: 12 },
  { name: 'Tue', leads: 52, disbursed: 15 },
  { name: 'Wed', leads: 48, disbursed: 10 },
  { name: 'Thu', leads: 61, disbursed: 24 },
  { name: 'Fri', leads: 55, disbursed: 18 },
  { name: 'Sat', leads: 32, disbursed: 8 },
  { name: 'Sun', leads: 28, disbursed: 5 },
];

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl group hover:border-orange-500/30 transition-all hover:bg-slate-900"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2.5 rounded-xl bg-opacity-10", color)}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-mono">
        <ArrowUpRight size={14} />
        {trend}%
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
  </motion.div>
);

const cn = (...classes: any) => classes.filter(Boolean).join(' ');

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await gasService.callBackend('GET_DASHBOARD', { 
          projectId: 'PRJ_DIVYANSHI_001' 
        });
        if (response.ok) {
          setData(response);
        }
      } catch (e) {
        console.error("Dashboard Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Staff" 
          value={data?.totalStaff || "42"} 
          icon={Users} 
          trend="12" 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Project Code" 
          value={data?.project?.id || "PRJ_DIV_001"} 
          icon={Briefcase} 
          trend="8" 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Project Status" 
          value={data?.project?.status || "ACTIVE"} 
          icon={CheckCircle2} 
          trend="24" 
          color="bg-emerald-500" 
        />
        <div 
          onClick={() => setActiveTab('smart-form')}
          className="cursor-pointer group"
        >
          <StatCard 
            title="SYSTEM_ENTRY" 
            value="NEW_LEAD" 
            icon={Zap} 
            trend="100" 
            color="bg-purple-500" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-white italic">Conversion Intelligence</h3>
                <p className="text-xs text-slate-500 font-mono">NEURAL_TRAJECTORY_DATA</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500">LIVE_OFFERS: 12</div>
                <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-black text-orange-500">CALLBACKS: 8</div>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#f97316" fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Wise Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-4">Source Intelligence</h3>
              <div className="space-y-3">
                {[
                  { name: 'Direct Web', val: 45, color: 'w-[45%]' },
                  { name: 'DSA Network', val: 32, color: 'w-[32%]' },
                  { name: 'SARI WhatsApp', val: 18, color: 'w-[18%]' },
                  { name: 'Referrals', val: 5, color: 'w-[5%]' },
                ].map((source, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>{source.name}</span>
                      <span>{source.val}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className={cn("h-full bg-orange-500 rounded-full", source.color)}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-4">Business Health</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-xl font-black text-emerald-500">88%</p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase">Efficiency</p>
                </div>
                <div className="text-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-xl font-black text-orange-500">14</p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase">Days TAT</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={100} className="text-orange-500" />
            </div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={16} className="text-orange-500" />
              Latest Alerts
            </h3>
            <div className="space-y-4">
              {[
                { type: 'OFFER', msg: 'New Axis Bank PL Offer Live', time: '2m ago', color: 'text-orange-400' },
                { type: 'LEAD', msg: 'Priority Lead: Sumit K.', time: '5m ago', color: 'text-blue-400' },
                { type: 'MIS', msg: 'MIS Update: V4 P1 Sync', time: '12m ago', color: 'text-emerald-400' },
                { type: 'HR', msg: 'Candidate Waiting in Lobby', time: '1h ago', color: 'text-purple-400' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-3 text-xs border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className={cn("w-1 h-8 rounded-full", alert.color.replace('text-', 'bg-'))}></div>
                  <div>
                    <p className="font-semibold text-slate-200">{alert.msg}</p>
                    <p className="text-slate-500 text-[10px] uppercase font-mono mt-0.5">{alert.type} • {alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Comm Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 flex flex-col items-center group cursor-pointer hover:bg-emerald-500/5 transition-all">
                <MessageCircle size={24} className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xl font-black text-white">42</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">WhatsApp</p>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 flex flex-col items-center group cursor-pointer hover:bg-blue-500/5 transition-all">
                <PhoneCall size={24} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xl font-black text-white">18</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Calling</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-orange-600/5 border border-orange-500/10 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-orange-500">Team Score</p>
                <p className="text-[10px] text-slate-500 uppercase">92/100 P1 Rank</p>
              </div>
              <TrendingUp size={20} className="text-orange-500" />
            </div>
          </div>

          {/* Role Based Placeholder */}
          <div className="bg-slate-900/30 border border-dashed border-slate-800 p-6 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Users size={32} className="text-slate-700 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Role: Senior Agent</p>
              <p className="text-[9px] text-slate-700 italic">Personal Matrix Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
