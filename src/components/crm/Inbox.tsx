import React from 'react';
import { motion } from 'motion/react';
import { Mail, Star, Tag, Clock, ArrowRight, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const inboxData = [
  { id: 1, sender: 'Axis Bank MIS', subject: 'Incentive Structure V4 - May 2024', tag: 'OFFER', time: '10:45 AM', starred: true, status: 'urgent' },
  { id: 2, sender: 'QDN Tech Support', subject: 'System Handshake: Successful Deployment', tag: 'SYSTEM', time: 'Yesterday', starred: false, status: 'info' },
  { id: 3, sender: 'HR Recruitment', subject: 'Candidate Profile: Senior RM (Sales)', tag: 'HR', time: 'Yesterday', starred: true, status: 'new' },
  { id: 4, sender: 'P1 Master Bot', subject: 'Registry Sync Alert: ID_XM_459', tag: 'SYNC', time: 'May 28', starred: false, status: 'warning' },
  { id: 5, sender: 'Upendra Raghav', subject: 'Strategic Review: Q3 Trajectory', tag: 'STRATEGY', time: 'May 27', starred: true, status: 'important' },
];

export const Inbox: React.FC = () => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Mail className="text-orange-500" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Sovereign Inbox</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">INBOUND_MATRIX_ACTIVE</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input 
              placeholder="Search Mail..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-orange-500/50"
            />
          </div>
          <button className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-800">
        {inboxData.map((mail) => (
          <motion.div 
            key={mail.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
            className="p-4 sm:p-6 flex items-center gap-4 cursor-pointer group transition-all"
          >
            <div className="hidden sm:block">
              <Star 
                size={18} 
                className={cn(
                  "transition-colors",
                  mail.starred ? "text-orange-500 fill-orange-500" : "text-slate-700 hover:text-slate-500"
                )} 
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-bold text-slate-200 truncate">{mail.sender}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                  mail.tag === 'OFFER' ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                  mail.tag === 'SYSTEM' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                  "bg-slate-800 text-slate-400 border border-slate-700"
                )}>
                  {mail.tag}
                </span>
              </div>
              <p className="text-sm text-slate-400 truncate group-hover:text-slate-200 transition-colors">{mail.subject}</p>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-[10px] font-mono text-slate-600">{mail.time}</span>
              <div className={cn(
                "w-2 h-2 rounded-full",
                mail.status === 'urgent' ? "bg-red-500 animate-pulse" :
                mail.status === 'new' ? "bg-orange-500" :
                "bg-slate-700"
              )}></div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-all sm:translate-x-4 group-hover:translate-x-0 ml-4 hidden sm:block">
              <ArrowRight size={18} className="text-orange-500" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-slate-950/30 border-t border-slate-800 flex justify-center">
        <button className="text-[10px] font-bold text-slate-500 hover:text-orange-500 uppercase tracking-widest transition-colors">
          View All Matrix Communications
        </button>
      </div>
    </div>
  );
};
