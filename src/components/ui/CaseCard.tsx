import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Briefcase, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CaseCardProps {
  id: string;
  name: string;
  loan: string;
  amount: string;
  status: string;
  rm?: string;
}

export function CaseCard({ id, name, loan, amount, status, rm }: CaseCardProps) {
  const statusConfig = {
    'Lead': { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Briefcase },
    'Pending': { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertCircle },
    'Approved': { color: 'text-purple-500', bg: 'bg-purple-500/10', icon: CheckCircle2 },
    'Disbursed': { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: Wallet },
    'Rejected': { color: 'text-rose-500', bg: 'bg-rose-500/10', icon: AlertCircle },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Lead'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="bg-black/40 border-white/10 hover:border-blue-500/40 transition-all overflow-hidden relative">
        <div className={cn("absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity", config.color)}>
           <config.icon className="w-8 h-8" />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
             <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] font-black uppercase italic tracking-widest text-slate-500">
               {id}
             </Badge>
             <Badge className={cn("text-[9px] font-black uppercase tracking-tighter border-none", config.bg, config.color)}>
               {status}
             </Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Customer / Entity</p>
              <h4 className="text-lg font-black text-white italic uppercase tracking-tighter truncate">{name}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Asset Type</p>
                <div className="flex items-center gap-2">
                   <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                   <p className="text-xs font-bold text-slate-300 uppercase">{loan}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Amount</p>
                <p className="text-sm font-black text-white italic">{amount}</p>
              </div>
            </div>

            {rm && (
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase italic">
                      {rm.split(' ').map(n => n[0]).join('')}
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 italic uppercase truncate max-w-[100px]">{rm}</p>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
