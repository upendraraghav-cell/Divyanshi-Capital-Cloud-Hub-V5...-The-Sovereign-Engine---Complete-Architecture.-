import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  XCircle,
  TrendingUp,
  Target,
  Users,
  Wallet,
  Calendar,
  Bell,
  Save,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LoanCase {
  id: string;
  customer: string;
  amount: string;
  type: 'Personal' | 'Business' | 'Home' | 'LAP';
  status: 'Lead' | 'Pending' | 'Approved' | 'Disbursed' | 'Rejected';
  rm: string;
  date: string;
  followUpDate?: string;
  followUpTime?: string;
  followUpNote?: string;
}

const MOCK_CASES: LoanCase[] = [
  { id: 'DC-9821', customer: 'Rajesh Khanna', amount: '₹15,00,000', type: 'Business', status: 'Approved', rm: 'Narendra Singh Raghav', date: '2024-04-12', followUpDate: '2024-05-02', followUpTime: '10:30' },
  { id: 'DC-9822', customer: 'Suman Shaurya', amount: '₹5,00,000', type: 'Personal', status: 'Disbursed', rm: 'Upendra Singh Raghav', date: '2024-04-15' },
  { id: 'DC-9823', customer: 'Modern Exports', amount: '₹45,00,000', type: 'LAP', status: 'Pending', rm: 'Khemchand', date: '2024-04-18', followUpDate: '2024-05-01', followUpTime: '14:00' },
  { id: 'DC-9824', customer: 'Karan Mehra', amount: '₹25,00,000', type: 'Home', status: 'Lead', rm: 'Narendra Singh Raghav', date: '2024-04-20' },
  { id: 'DC-9825', customer: 'Anita Desai', amount: '₹12,00,000', type: 'Personal', status: 'Rejected', rm: 'Dimpal', date: '2024-04-21' },
];

export function LoanOS({ user }: { user: any }) {
  const [search, setSearch] = useState('');
  const [cases, setCases] = useState<LoanCase[]>(MOCK_CASES);
  const [selectedCase, setSelectedCase] = useState<LoanCase | null>(null);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');

  const personalFileId = user?.personalFileId || 'DC-NODE-XXX';

  const statusColors = {
    'Lead': 'bg-blue-500/10 text-blue-500',
    'Pending': 'bg-amber-500/10 text-amber-500',
    'Approved': 'bg-purple-500/10 text-purple-500',
    'Disbursed': 'bg-emerald-500/10 text-emerald-500',
    'Rejected': 'bg-rose-500/10 text-rose-500',
  };

  const handleOpenFollowUp = (loanCase: LoanCase) => {
    setSelectedCase(loanCase);
    setFollowUpDate(loanCase.followUpDate || '');
    setFollowUpTime(loanCase.followUpTime || '');
    setFollowUpNote(loanCase.followUpNote || '');
    setIsFollowUpOpen(true);
  };

  const saveFollowUp = () => {
    if (!selectedCase) return;

    const updatedCases = cases.map(c => 
      c.id === selectedCase.id 
        ? { ...c, followUpDate, followUpTime, followUpNote } 
        : c
    );

    setCases(updatedCases);
    setIsFollowUpOpen(false);
    toast.success(`Follow-up locked for ${selectedCase.customer}`, {
      description: `Protocol scheduled for ${followUpDate} at ${followUpTime}`,
    });
  };

  const clearFollowUp = () => {
    if (!selectedCase) return;
    setFollowUpDate('');
    setFollowUpTime('');
    setFollowUpNote('');
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Badge className="bg-orange-500/10 text-orange-500 text-[8px] font-black uppercase border-none">Personal Node: {personalFileId}</Badge>
             <Badge className="bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase border-none">MASTER_FILE_ID: 1Mk9AzGd...</Badge>
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Divyanshi Capital - Loan OS (P1)</h1>
          <p className="text-slate-400">Master Asset & Disbursal Matrix • Unified SaaS Grid</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-[#00346a] hover:bg-[#004a96] text-white font-black uppercase text-xs">
            New Loan File +
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'disbursed', label: 'Today Disbursed', value: '₹54.2L', change: '+12%', icon: Wallet, color: 'text-emerald-500' },
          { id: 'pipeline', label: 'Active Pipeline', value: '240 Cases', change: '84 New', icon: TrendingUp, color: 'text-blue-500' },
          { id: 'target', label: 'Team Target', value: '78%', change: '₹2.4Cr Left', icon: Target, color: 'text-orange-500' },
          { id: 'agents', label: 'Total Agents', value: '48 Active', change: '94% Attendance', icon: Users, color: 'text-purple-500' },
        ].map((stat) => (
          <Card key={stat.id} className="bg-black/40 border-white/10 group hover:border-blue-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[8px] font-black uppercase">{stat.change}</Badge>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1 italic">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardHeader className="border-b border-white/5 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-sm font-black uppercase italic text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              Active Case Matrix
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  placeholder="Search Customer / ID..." 
                  className="pl-10 bg-white/5 border-white/10 text-xs w-64 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="border-white/10 bg-white/5 w-9 h-9">
                <Filter className="w-4 h-4 text-slate-400" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Case ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Follow-Up</th>
                  <th className="px-6 py-4">RM / Node</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cases.filter(c => c.customer.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())).map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-400 font-bold">{item.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white uppercase italic">{item.customer}</p>
                      <p className="text-[10px] text-slate-500">{item.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] font-bold uppercase">{item.type}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-white italic">{item.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn("text-[10px] font-black uppercase", statusColors[item.status])}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center">
                        {item.followUpDate ? (
                          <button 
                            onClick={() => handleOpenFollowUp(item)}
                            className="group/follow bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded px-2 py-1 transition-all"
                          >
                            <div className="flex items-center gap-1.5">
                              <Bell className="w-3 h-3 text-blue-400 animate-pulse" />
                              <span className="text-[9px] font-black text-blue-400 uppercase italic">
                                {item.followUpDate} @ {item.followUpTime}
                              </span>
                            </div>
                          </button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenFollowUp(item)}
                            className="bg-white/5 hover:bg-blue-500/20 border border-transparent hover:border-blue-500/20 text-[9px] font-black uppercase italic h-7 px-2"
                          >
                            <Calendar className="w-3 h-3 mr-1 opacity-50" />
                            Set Recall
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-black text-white">
                          {item.rm.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-bold text-slate-400">{item.rm}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Neural Follow-Up Dialog */}
      <Dialog open={isFollowUpOpen} onOpenChange={setIsFollowUpOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic uppercase italic tracking-tighter flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Follow-Up Scheduler
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs uppercase font-bold italic">
              Configure Strategic Call Protocol for {selectedCase?.customer}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Recall Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="bg-white/5 border-white/10 h-10 text-sm focus:border-blue-500/50 transition-all font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Neural Time</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  className="bg-white/5 border-white/10 h-10 text-sm focus:border-blue-500/50 transition-all font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note" className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Strategic Note</Label>
              <Input 
                id="note" 
                placeholder="Enter engagement details..." 
                value={followUpNote}
                onChange={(e) => setFollowUpNote(e.target.value)}
                className="bg-white/5 border-white/10 h-10 text-sm focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="ghost" 
              onClick={clearFollowUp}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-black uppercase italic h-9 px-4"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear Protocol
            </Button>
            <div className="flex-1 lg:hidden mb-2" />
            <Button 
              onClick={saveFollowUp}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase italic h-9 px-6"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              Lock Follow-Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-black/40 border-white/10">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-sm font-black uppercase italic text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Success Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                { id: 'milestone-1', title: 'Home Loan Approved', desc: 'DC-9821 verified by Backend', time: '12m ago', icon: CheckCircle2, color: 'text-emerald-500' },
                { id: 'milestone-2', title: 'New Lead Generated', desc: 'Suman Shaurya - Personal Loan', time: '1h ago', icon: Briefcase, color: 'text-blue-500' },
                { id: 'milestone-3', title: 'Case DC-9825 Rejected', desc: 'CIBIL Score Mismatch < 650', time: '3h ago', icon: XCircle, color: 'text-rose-500' },
                { id: 'milestone-4', title: 'Disbursal Confirmed', desc: '₹5.0L credited to Suman', time: '5h ago', icon: Clock, color: 'text-amber-500' },
              ].map((act, i) => (
                <div key={act.id} className="flex gap-4 relative">
                  {i !== 3 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-white/5" />}
                  <div className={cn("p-1 rounded-full bg-white/5 z-10 w-6 h-6 flex items-center justify-center", act.color)}>
                    <act.icon className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase italic">{act.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{act.desc}</p>
                    <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-black/40 border-white/10">
          <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase italic text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Weekly Disbursal Velocity
            </CardTitle>
            <Badge className="bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase border-none">GOAL: ₹5.0 Cr</Badge>
          </CardHeader>
          <CardContent className="p-10 flex flex-col items-center justify-center min-h-[300px]">
             <div className="w-full h-4 relative bg-white/5 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-amber-500"
                />
             </div>
             <div className="flex justify-between w-full text-[10px] font-black text-slate-500 uppercase italic">
                <span>Current: ₹3.42 Cr</span>
                <span>Target: ₹5.00 Cr</span>
             </div>
             <div className="mt-12 grid grid-cols-6 gap-2 w-full h-[150px]">
                {[30, 45, 60, 40, 85, 75].map((h, i) => (
                  <div key={i} className="flex flex-col items-center justify-end h-full gap-2">
                     <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${h}%` }}
                       className="w-full bg-blue-500/20 border border-blue-500/30 rounded-t-lg relative group cursor-pointer hover:bg-blue-500/40 transition-colors"
                     >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-black text-white bg-black p-1 rounded">₹{h}L</div>
                     </motion.div>
                     <span className="text-[8px] text-slate-600 font-bold">D0{i+1}</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
