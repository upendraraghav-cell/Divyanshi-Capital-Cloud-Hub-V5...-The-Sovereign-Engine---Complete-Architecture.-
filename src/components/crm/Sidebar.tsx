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
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'smart-form', label: 'Smart Form', icon: FileText },
  { id: 'loanos', label: 'Loan OS', icon: Wallet },
  { id: 'inbox', label: 'Mail Inbox', icon: Mail },
  { id: 'cards', label: 'Business Cards', icon: Contact },
  { id: 'team', label: 'Team Panel', icon: Users },
  { id: 'whatsapp-campaigns', label: 'WA Campaigns', icon: Zap },
  { id: 'voice-desk', label: 'Voice Desk', icon: Mic },
  { id: 'avatar-control', label: 'Avatar Control', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Layers },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'sari-intelligence', label: 'SARI AI', icon: Sparkles, role: 'MD' },
  { id: 'v3-engine', label: 'Admin Hub', icon: ShieldCheck, role: 'MD' },
  { id: 'v2-controller', label: 'V2 Controller', icon: Activity, role: 'MD' },
  { id: 'autonomous', label: 'Autonomous Core', icon: Cpu, role: 'MD' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-bottom border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-slate-50 font-black italic uppercase tracking-tighter text-lg leading-tight">MALLIK <span className="text-orange-500">SYSTEM</span></h1>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Sovereign Business OS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.filter(item => {
          if (!item.role) return true;
          if (item.role === 'MD') {
            return user?.role?.includes('Managing Director') || user?.role === 'MD' || user?.role?.includes('Founder');
          }
          return item.role === user?.role;
        }).map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-orange-500/10 text-orange-500" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <item.icon size={20} className={cn("transition-colors", isActive ? "text-orange-500" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="font-medium text-sm">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-6 bg-orange-500 rounded-r-full"
                />
              )}
              
              <ChevronRight 
                size={14} 
                className={cn(
                  "ml-auto transition-transform duration-200 opacity-0 group-hover:opacity-100",
                  isActive && "opacity-100"
                )} 
              />
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-900 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-slate-900/50">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-orange-400 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              user?.displayName?.charAt(0) || 'U'
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.displayName || 'User'}</p>
            <p className="text-[10px] text-slate-500 font-mono truncate uppercase">{user?.role || 'Agent'}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors group"
        >
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};
