import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Mail, 
  Contact, 
  MessageSquare, 
  ShieldCheck, 
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Wallet,
  Cpu,
  Activity,
  Zap,
  Mic,
  Palette,
  Layers,
  Sparkles,
  Command,
  HeartPulse,
  Globe
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

const navItems = [
  { id: 'genie', path: '/genie', label: 'Genie CRM Console', icon: Sparkles },
  { id: 'mallik', path: '/mallik', label: 'The Mallik System', icon: LayoutDashboard },
  { id: 'dashboard', path: '/p1', label: 'Mission Control', icon: LayoutDashboard },
  { id: 'enquiry', path: '/p1/enquiry', label: 'Portal Entry', icon: FileText },
  { id: 'loanos', path: '/p1/loanos', label: 'Neural Loan OS', icon: Wallet },
  { id: 'whatsapp', path: '/p1/whatsapp', label: 'WA Intelligence', icon: Zap },
  { id: 'telegram', path: '/p1/telegram', label: 'Telegram Hub', icon: MessageSquare },
  { id: 'social', path: '/p1/social', label: 'Social Hub', icon: Palette },
  { id: 'mail', path: '/p1/mail', label: 'Sovereign Mail', icon: Mail },
  { id: 'google', path: '/p1/google', label: 'Google Hub', icon: Globe },
  { id: 'mis', path: '/p1/mis', label: 'P1 Master MIS', icon: Activity },
  { id: 'users', path: '/p1/users', label: 'Identity Manager', icon: Users },
  { id: 'ai', path: '/v2', label: 'LAILA Core', icon: Sparkles, role: 'MD' },
  { id: 'settings', path: '/settings', label: 'System Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-64 h-screen bg-[#06112C] border-r border-white/5 flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]">
            <Command className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-black italic uppercase tracking-tighter text-lg leading-tight">DIVYANSHI <span className="text-cyan-500">V5</span></h1>
            <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.3em]">The Sovereign Engine</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.filter(item => {
          if (!item.role) return true;
          if (item.role === 'MD') {
            return user?.role?.includes('Managing Director') || user?.role === 'MD' || user?.role?.includes('Founder');
          }
          return item.role === user?.role;
        }).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-cyan-500/10 text-cyan-400" 
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <item.icon size={20} className={cn("transition-transform duration-500", isActive ? "text-cyan-400 scale-110" : "text-slate-500 group-hover:scale-110 group-hover:text-cyan-400")} />
              <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 w-1 h-8 bg-cyan-500 rounded-r-full"
                />
              )}
              
              <div className={cn(
                "ml-auto w-1.5 h-1.5 rounded-full transition-all duration-500",
                isActive ? "bg-cyan-500 animate-pulse" : "bg-transparent group-hover:bg-slate-700"
              )} />
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-xl rounded-full" />
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-cyan-400 overflow-hidden shrink-0">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Node" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-white truncate uppercase tracking-tighter leading-none mb-1">{user?.name || 'Authorized'}</p>
                <p className="text-[8px] text-cyan-500 font-black truncate uppercase tracking-widest">{user?.role || 'NEURAL_NODE'}</p>
              </div>
           </div>
           
           <button 
             onClick={onLogout}
             className="w-full flex items-center justify-center gap-3 py-3 text-red-400 bg-red-400/5 hover:bg-red-400 hover:text-white rounded-xl transition-all duration-300 group font-black text-[10px] uppercase tracking-widest"
           >
             <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
             Detach
           </button>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-6">
           <HeartPulse size={12} className="text-green-500 animate-pulse" />
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Matrix Health: Optimal</span>
        </div>
      </div>
    </aside>
  );
};
