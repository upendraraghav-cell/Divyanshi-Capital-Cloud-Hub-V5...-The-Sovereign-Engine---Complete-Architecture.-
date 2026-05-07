import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Download,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const MOCK_ATTENDANCE = [
  { name: '09:00', present: 12, late: 2 },
  { name: '10:00', present: 28, late: 5 },
  { name: '11:00', present: 42, late: 6 },
  { name: '12:00', present: 45, late: 6 },
  { name: '13:00', present: 43, late: 6 },
  { name: '14:00', present: 45, late: 6 },
];

const STAFF_LOG = [
  { id: 1, name: 'Amit Sharma', role: 'Senior RM', punchIn: '09:12 AM', status: 'Active', work: '3 Bank Visits' },
  { id: 2, name: 'Priya Varma', role: 'Sales Lead', punchIn: '09:30 AM', status: 'Field', work: '5 Client KYC' },
  { id: 3, name: 'Vikram Singh', role: 'NBFC Liaison', punchIn: '10:05 AM', status: 'Late', work: '1 Login Pending' },
  { id: 4, name: 'Sanjay Gupta', role: 'Senior RM', punchIn: '09:05 AM', status: 'Active', work: '8 Files Processed' },
];

export function MISReport() {
  const [syncing, setSyncing] = useState(false);

  const triggerSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/mis/sync');
      const data = await res.json();
      if (data.ok) {
        toast.success(`Matrix Recalibrated: ${data.updatedLeads} Leads Synced`);
      }
    } catch (e) {
      toast.error("Deep Sync Failure");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight italic uppercase">Daily MIS Matrix</h1>
          <p className="text-slate-400">Synchronized Attendance & Productivity Intelligence (Apps Script Latch)</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={triggerSync}
            className="border-white/10 bg-white/5 text-xs font-black uppercase"
          >
            <Clock className={cn("w-3 h-3 mr-2", syncing && "animate-spin")} />
            {syncing ? 'Syncing Macros...' : 'Recalibrate Day'}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-xs font-black uppercase">
            <Download className="w-3 h-3 mr-2" />
            Export Final Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Attendance', value: '94%', sub: '45/48 Present', icon: Users, color: 'text-blue-500' },
          { label: 'Files Disbursed', value: '₹12.4L', sub: 'Today (Verified)', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Pending Logins', value: '18', sub: 'Critical Sector', icon: AlertCircle, color: 'text-amber-500' },
          { label: 'Neural Accuracy', value: '99.8%', sub: 'Apps Script Sync', icon: CheckCircle2, color: 'text-purple-500' },
        ].map((stat, i) => (
          <Card key={`mis-main-stat-${i}`} className="bg-black/40 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge className="bg-white/5 border-white/10 text-[8px] font-black uppercase">Realtime</Badge>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-black/40 border-white/10 overflow-hidden">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-sm font-black uppercase italic text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Staff Login Velocity (Hourly)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={MOCK_ATTENDANCE}>
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                  />
                  <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-sm font-black uppercase italic text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Live Staff Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
             {STAFF_LOG.map((staff) => (
                <div key={staff.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                         {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-white uppercase">{staff.name}</p>
                         <p className="text-[8px] text-slate-500 font-bold uppercase">{staff.role}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-mono text-slate-400">{staff.punchIn}</p>
                      <Badge className={cn(
                        "text-[8px] font-black uppercase mt-1",
                        staff.status === 'Late' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                         {staff.status}
                      </Badge>
                   </div>
                </div>
             ))}
             <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-slate-500 hover:text-white">
                View All Personnel
             </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
           <CardTitle className="text-sm font-black uppercase italic text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-purple-500" />
              Macro Link: Google Apps Script Status
           </CardTitle>
           <Badge className="bg-blue-500 text-white border-none text-[8px] font-black uppercase">Target: v3.1 Matrix</Badge>
        </CardHeader>
        <CardContent className="p-6">
           <div className="p-4 rounded-xl bg-black/60 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                 <p className="text-xs font-black text-blue-400 uppercase tracking-widest italic">Connection URL (Macros API)</p>
                 <code className="text-[10px] text-slate-500 bg-black p-2 rounded block break-all">
                    https://script.google.com/macros/s/AKfycbxlxt37vhvS-QSx3g4jUNro7RnRScaRQwUWcan7yhNs9SUqcvHoalYDlFFF0N9IS6M/exec
                 </code>
              </div>
              <div className="flex gap-4">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Status</p>
                    <Badge className="bg-emerald-500/20 text-emerald-500 font-black">ACTIVE</Badge>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Latency</p>
                    <p className="text-xs font-bold text-white">42ms</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Sync Rate</p>
                    <p className="text-xs font-bold text-white">5m</p>
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
