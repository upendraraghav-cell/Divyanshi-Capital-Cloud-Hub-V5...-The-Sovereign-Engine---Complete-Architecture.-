/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, Search, User, Settings, LogOut, LogIn, AlertCircle, CheckCircle2, Info, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
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
import { auth, signInWithPopup, googleProvider, FirebaseUser } from '@/lib/firebase';
import { toast } from 'sonner';
import { SYSTEM_NOTIFICATIONS, SystemNotification } from '@/data/notifications';

interface HeaderProps {
  user: (FirebaseUser & { role?: string; brand?: string }) | null;
  setActiveTab?: (tab: string) => void;
  title?: string;
}

export function Header({ user, setActiveTab, title }: HeaderProps) {
  const isAdmin = user?.role === 'admin' || user?.role === 'SaaS Administrator';
  
  // Professional mapping for notifications
  const userNotifications = SYSTEM_NOTIFICATIONS.filter(n => {
    if (user?.role === 'SaaS Administrator') return n.role === 'SAAS_BOSS';
    if (user?.role === 'Managing Director') return n.role === 'BRAND_MD' && n.brand === user.brand;
    return n.role === 'STAFF';
  });

  const getIcon = (type: SystemNotification['type']) => {
    switch(type) {
      case 'SUCCESS': return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
      case 'WARNING': return <AlertCircle className="w-3 h-3 text-orange-500" />;
      case 'ALERT': return <Zap className="w-3 h-3 text-red-500" />;
      default: return <Info className="w-3 h-3 text-blue-500" />;
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Identity verified. Welcome, Master.");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Handshake failed!");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.info("System standby. Farewell, Master.");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="h-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 flex justify-start items-center gap-4">
        {title && (
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-white uppercase italic tracking-wider whitespace-nowrap">{title.replace('-', ' ')}</h2>
            <div className="w-1 h-3 bg-orange-500/50 rounded-full" />
          </div>
        )}
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
          <Input 
            placeholder="Search nodes, campaigns, or clients..." 
            className="pl-11 bg-white/5 border-white/10 focus-visible:ring-orange-500/50 focus-visible:border-orange-500/50 transition-all rounded-xl h-10 text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Status</span>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            {user ? (
               <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            ) : (
               <div className="w-2 h-2 rounded-full bg-slate-500" />
            )}
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                {user ? 'Authenticated' : 'System Standby'}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "relative hover:bg-white/5 rounded-full text-slate-400 hover:text-white cursor-pointer")}>
            <Bell className="w-5 h-5" />
            {userNotifications.length > 0 && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center bg-orange-500 rounded-full border-2 border-slate-950 text-[10px] font-black text-white">
                {userNotifications.length}
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-slate-900 border-white/10 p-0 overflow-hidden" align="end">
            <div className="p-4 border-b border-white/5 bg-white/5">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Neural Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {userNotifications.map((n) => (
                <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(n.type)}</div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-white uppercase italic leading-none">{n.title}</p>
                      <p className="text-[10px] text-slate-500 font-bold leading-tight line-clamp-2 uppercase tracking-tight">{n.description}</p>
                      <p className="text-[8px] text-slate-600 font-black italic">{n.time} • SYSTEM_DAEMON</p>
                    </div>
                  </div>
                </div>
              ))}
              {userNotifications.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-[10px] font-black text-slate-600 uppercase italic">No active neural signals</p>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/5 text-center">
              <Button variant="link" className="text-[9px] font-black text-orange-500 uppercase h-auto p-0">Clear Matrix Logs</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-right text-right hidden lg:flex">
              <span className="text-[11px] font-black text-white uppercase tracking-tighter leading-none">{user.displayName || "Authorized User"}</span>
              <Badge variant="outline" className={cn(
                "h-4 text-[7px] font-black uppercase tracking-[0.2em] border-0 px-1 mt-1",
                isAdmin ? "bg-orange-500/10 text-orange-500" : "bg-emerald-500/10 text-emerald-500"
              )}>
                {user.role || 'Staff'}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-11 w-11 rounded-full border border-white/10 p-0 overflow-hidden hover:border-orange-500/50 transition-colors bg-white/5 ring-1 ring-white/5">
                  <img 
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName || 'Boss'}`} 
                    alt="User" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-panel bg-slate-900 border-white/10" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem className="hover:bg-white/5 cursor-pointer" disabled>
                   <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-white/5 cursor-pointer"
                  onClick={() => setActiveTab?.('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem 
                  className="text-destructive hover:bg-destructive/10 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        ) : (
          <Button 
            onClick={handleLogin}
            className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
