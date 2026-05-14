import React from 'react';
import { Bell, Search, User, Settings, LogOut, CheckCircle2, Zap, Shield, Cpu, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSovereignStore } from '@/lib/useSovereignStore';

interface HeaderProps {
  user: any;
  setActiveTab?: (tab: string) => void;
  title?: string;
}

export function Header({ user, title }: HeaderProps) {
  const { addTelemetry, setUser } = useSovereignStore();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dc_sovereign_user');
    toast.success("Identity Detached: Safe termination confirmed.");
    addTelemetry("Matrix Session Closed. Identity Disconnected.");
  };

  return (
    <header className="h-20 border-b border-white/5 bg-[#06112C]/60 backdrop-blur-3xl flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 flex justify-start items-center gap-8">
        <div className="flex items-center gap-4">
           <div className="flex flex-col">
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic leading-none">{title || 'SOVEREIGN_OS'}</h2>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sector: ACTIVE_EXECUTION</span>
              </div>
           </div>
        </div>

        <div className="relative w-full max-w-md group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <Input 
            placeholder="NEURAL_QUERY_INPUT..." 
            className="pl-11 bg-white/5 border-white/5 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/50 transition-all rounded-2xl h-12 text-white font-mono text-[10px]"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <kbd className="px-1.5 pb-0.5 rounded border border-white/10 text-[8px] font-black text-slate-500 bg-white/5">⌘</kbd>
             <kbd className="px-1.5 pb-0.5 rounded border border-white/10 text-[8px] font-black text-slate-500 bg-white/5">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Resource Telemetry */}
        <div className="hidden xl:flex items-center gap-6 border-r border-white/5 pr-6">
           <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-white uppercase tracking-tighter transition-all group-hover:text-cyan-400">84%</span>
                 <Activity size={12} className="text-cyan-400" />
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural Link</span>
           </div>
           <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-white uppercase tracking-tighter">24ms</span>
                 <Zap size={12} className="text-gold-500" />
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Latency</span>
           </div>
        </div>

        {/* System Notifications */}
        <div className="relative group p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <Bell size={20} className="text-slate-400 group-hover:text-white" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#06112C]" />
        </div>

        {/* Identity Node */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-colors group">
              <div className="flex flex-col items-end mr-1">
                 <span className="text-[11px] font-black text-white uppercase tracking-tighter leading-none">{user?.name || "Authorized"}</span>
                 <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest mt-1">NODE_ID: {user?.empCode || "GUEST"}</span>
              </div>
              <div className="relative h-12 w-12 rounded-2xl border border-white/10 overflow-hidden group-hover:border-cyan-500 transition-colors bg-[#0A193D] p-0.5">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent" />
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Matrix'}`}
                  alt="Identity"
                  className="h-full w-full object-cover rounded-[0.85rem] relative z-10"
                />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-[#0A193D] border-white/5 backdrop-blur-3xl rounded-3xl p-2" align="end">
            <div className="p-4 border-b border-white/5 mb-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Authenticated Node</p>
              <p className="text-xs font-black text-white uppercase truncate">{user?.email}</p>
            </div>
            <DropdownMenuGroup>
              <DropdownMenuItem className="p-3 rounded-2xl focus:bg-white/5 cursor-pointer flex items-center gap-3">
                <User size={16} className="text-slate-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 rounded-2xl focus:bg-white/5 cursor-pointer flex items-center gap-3">
                <Settings size={16} className="text-slate-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Matrix Config</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 rounded-2xl focus:bg-white/5 cursor-pointer flex items-center gap-3">
                <Shield size={16} className="text-slate-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Security Latch</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5 mx-2 my-2" />
            <DropdownMenuItem 
               onClick={handleLogout}
               className="p-3 rounded-2xl focus:bg-red-500/10 text-red-400 cursor-pointer flex items-center gap-3"
            >
              <LogOut size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Terminate Link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
