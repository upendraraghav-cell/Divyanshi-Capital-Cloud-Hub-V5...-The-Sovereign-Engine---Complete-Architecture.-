/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Home, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  FileText, 
  Send, 
  MapPin, 
  BarChart3, 
  Database, 
  Bot, 
  FolderLock, 
  CloudCheck,
  Zap,
  ClipboardList,
  Brain,
  MessageSquare,
  Calendar,
  FileSpreadsheet,
  Sparkles,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPermissions, isAdmin as checkIsAdmin } from '@/lib/rbac';

export type TabType = 
  | 'Dashboard' 
  | 'Workspace'
  | 'Smart Form'
  | 'Loan OS'
  | 'Sovereign CRM'
  | 'Personal File'
  | 'AI Center' 
  | 'AI Staff'
  | 'Social Media'
  | 'Training'
  | 'Analytics'
  | 'Role Manager'
  | 'Agency'
  | 'Settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: any;
}

interface NavItem {
  name: TabType;
  icon: any;
  permission?: keyof ReturnType<typeof getPermissions>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: Home },
  { name: 'Workspace', icon: Zap, permission: 'canEditSettings' },
  { name: 'Smart Form', icon: ClipboardList, permission: 'canUseSmartForm' },
  { name: 'Loan OS', icon: Zap, permission: 'canAccessLoanOS' },
  { name: 'Sovereign CRM', icon: Database, permission: 'canManageSovereignCRM' },
  { name: 'Personal File', icon: FileSpreadsheet },
  // SaaS features hidden temporarily to focus on Dashboard
  { name: 'AI Center', icon: Brain, permission: 'canAccessAICenter' },
  { name: 'AI Staff', icon: Users, permission: 'canAccessAICenter' },
  { name: 'Social Media', icon: MessageSquare, permission: 'canAccessLoanOS' },
  { name: 'Training', icon: Calendar },
  { name: 'Analytics', icon: BarChart3, permission: 'canViewAnalytics' },
  { name: 'Role Manager', icon: Shield, permission: 'canEditSettings' },
  { name: 'Agency', icon: Users, permission: 'canEditSettings' },
  { name: 'Settings', icon: Settings, permission: 'canEditSettings' },
];

export function Sidebar({ activeTab, setActiveTab, user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const permissions = getPermissions(user?.role);
  const isAdmin = checkIsAdmin(user?.role);

  const filteredNavItems = navItems.filter(item => {
    if (!item.permission) return true;
    return permissions[item.permission as keyof typeof permissions];
  });

  return (
    <aside 
      className={cn(
        "relative h-screen flex flex-col border-r border-white/5 bg-slate-950/50 backdrop-blur-xl transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("p-6 flex flex-col gap-4", isCollapsed ? "items-center" : "")}>
        {/* Genie Brand UI */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1f3550] to-[#0a131d] border border-white/10 shadow-2xl relative overflow-hidden flex items-center justify-center transition-all duration-700 hover:rotate-12 hover:scale-110"
              style={{ boxShadow: '0 0 30px rgba(67, 164, 255, 0.2)' }}
            >
              <Bot className="w-10 h-10 text-white relative z-10" />
              <Sparkles className="w-5 h-5 text-orange-500 absolute top-2 right-2 animate-pulse" />
              <div className="absolute top-0 right-0 w-6 h-6 bg-orange-500/10 blur-md rounded-full" />
              <div className="absolute bottom-0 left-0 w-6 h-6 bg-blue-500/10 blur-md rounded-full" />
            </div>
            <div className="absolute -inset-2 bg-blue-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-black text-xl tracking-tight text-white leading-tight italic truncate uppercase">Divyanshi</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <span className="text-[10px] text-blue-400 uppercase tracking-widest font-black">
                   {user.brand === 'QDN Tech Internal' ? 'SaaS Boss Core' : 'P1 - Loan OS MD'}
                 </span>
                 <Badge className="bg-emerald-500/10 text-emerald-500 text-[7px] h-3 px-1 border-none font-black uppercase">
                   {user.role}
                 </Badge>
              </div>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-2 space-y-2">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <FolderLock className="w-3 h-3 text-slate-500" />
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Brand Registry</span>
                  </div>
                  <CloudCheck className="w-3 h-3 text-emerald-500" />
               </div>
               <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-white truncate">
                    Folder: {user.brand === 'QDN Tech Internal' ? 'SAAS_ROOT_SYS' : 'P1_LOAN_ASSETS_V1'}
                  </p>
                  <p className="text-[8px] text-slate-500 font-mono uppercase">Status: Drive Access Active</p>
               </div>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {filteredNavItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
              activeTab === item.name 
                ? "bg-white/5 text-white" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
              activeTab === item.name ? "text-orange-500" : "text-slate-400"
            )} />
            {!isCollapsed && (
              <span className="font-medium text-sm">{item.name}</span>
            )}
            {activeTab === item.name && (
              <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-white/5 text-muted-foreground rounded-full"
        >
          <ChevronLeft className={cn(
            "w-5 h-5 transition-transform duration-500",
            isCollapsed && "rotate-180"
          )} />
        </Button>
      </div>
    </aside>
  );
}
