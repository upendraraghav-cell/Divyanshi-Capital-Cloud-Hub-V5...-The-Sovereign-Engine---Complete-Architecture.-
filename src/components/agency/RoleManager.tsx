import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Shield, 
  Search, 
  UserCircle2, 
  Database,
  Link2,
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
  Settings2,
  Brain
} from 'lucide-react';
import { ALL_EMPLOYEES } from '@/data/staff';
import { SOURCE_REGISTRY } from '@/data/registry';
import { cn } from '@/lib/utils';
import { ROLE_PERMISSIONS, Permissions, DEFAULT_PERMISSIONS } from '@/lib/rbac';
import { toast } from 'sonner';
import { ActivityService } from '@/services/activityService';
import { RoleService } from '@/services/roleService';

export function RoleManager() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'personnel' | 'roles'>('personnel');
  const [roles, setRoles] = React.useState<Record<string, Permissions>>({});
  const [loading, setLoading] = React.useState(true);
  
  // In a real app, we would filter by the active brand from context
  const activeBrand = SOURCE_REGISTRY[0]; // Defaulting to Divyanshi Capital
  const employees = ALL_EMPLOYEES.filter(emp => emp.brand === activeBrand.name);

  useEffect(() => {
    RoleService.getAllRoles().then(r => {
        if(Object.keys(r).length === 0) {
            setRoles(ROLE_PERMISSIONS);
        } else {
            setRoles(r);
        }
        setLoading(false);
    });
  }, []);

  const togglePermission = async (roleName: string, permissionKey: keyof Permissions) => {
    const newPermissions = {
        ...roles[roleName],
        [permissionKey]: !roles[roleName][permissionKey]
    };
    
    setRoles(prev => ({
      ...prev,
      [roleName]: newPermissions
    }));
    
    await RoleService.updateRole(roleName, newPermissions);
    
    ActivityService.log('intelligence', `Permission matrix updated for role: ${roleName}`);
    toast.success(`Permission updated for ${roleName}`);
  };

  const handleAddRole = async () => {
    const roleName = prompt("Enter new role name:");
    if (roleName && !roles[roleName]) {
      const newPermissions = { ...DEFAULT_PERMISSIONS };
      setRoles(prev => ({
        ...prev,
        [roleName]: newPermissions
      }));
      await RoleService.updateRole(roleName, newPermissions);
      ActivityService.log('system', `New intelligence role registered: ${roleName}`);
      toast.success(`New role "${roleName}" added to the hierarchy`);
    } else if (roleName && roles[roleName]) {
      toast.error("Role already exists");
    }
  };

  const handleDeleteRole = async (roleName: string) => {
    if (confirm(`Are you sure you want to delete the "${roleName}" role? all users with this role will lose access.`)) {
      setRoles(prev => {
        const next = { ...prev };
        delete next[roleName];
        return next;
      });
      await RoleService.deleteRole(roleName);
      ActivityService.log('system', `Role decommissioned from Global Matrix: ${roleName}`);
      toast.success(`Role "${roleName}" decommissioned`);
    }
  };

  const permissionLabels: Record<keyof Permissions, string> = {
    canViewDashboard: 'Dashboard Access',
    canManageSovereignCRM: 'Master CRM Auth',
    canAccessLoanOS: 'Loan OS Execution',
    canEditSettings: 'System Settings',
    canViewAnalytics: 'Data Analytics',
    canUseSmartForm: 'Smart Entry',
    canAccessAICenter: 'AI Hub Access'
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Sovereign Role Control</h1>
          <p className="text-slate-400">Permissions, Identity Mapping & Backend Neural Associations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setViewMode(viewMode === 'personnel' ? 'roles' : 'personnel')}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold uppercase text-[10px] tracking-widest px-6 rounded-xl h-11"
          >
             {viewMode === 'personnel' ? 'Permissions Matrix' : 'Personnel Registry'} <Settings2 className="w-4 h-4 ml-2" />
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest px-6 rounded-xl h-11">
             Force Master Sync <Database className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Nodes', value: employees.length, icon: Users, color: 'text-blue-500' },
          { label: 'Defined Roles', value: Object.keys(roles).length, icon: Shield, color: 'text-orange-500' },
          { label: 'Master Sync', value: '100%', icon: Database, color: 'text-emerald-500' },
          { label: 'Identity Grid', value: 'ACTIVE', icon: UserCircle2, color: 'text-purple-500' },
        ].map((stat, i) => (
          <Card key={i} className="bg-slate-900/50 border-white/10">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                 <stat.icon className={stat.color + " w-5 h-5"} />
                 <Badge className="bg-white/5 text-slate-500 border-none text-[8px] font-black uppercase tracking-widest">{stat.label}</Badge>
               </div>
               <p className="text-2xl font-black text-white italic">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {viewMode === 'personnel' ? (
        <Card className="bg-slate-900 border-white/10 overflow-hidden">
          <CardHeader className="bg-white/5 border-b border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Personnel Registry</CardTitle>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search Personnel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-white/10 h-10 text-sm focus:border-orange-500/50"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Personnel / Emp Code</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Department / Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Branch / Manager</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Node ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employees.map((emp) => (
                  <tr key={emp.empCode} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/10 font-black italic">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm italic leading-none mb-1">{emp.name}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{emp.empCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{emp.department || 'N/A'}</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge className={cn(
                            "border-none text-[8px] font-black uppercase tracking-widest py-1 px-2",
                            emp.role === 'Admin' || emp.role === 'SaaS Administrator' || emp.role === 'MD' || emp.role.includes('Director') 
                              ? "bg-red-500/10 text-red-500" 
                              : emp.role === 'Editor' || emp.role.includes('Head')
                                ? "bg-blue-500/10 text-blue-500" 
                                : "bg-emerald-500/10 text-emerald-500"
                          )}>
                            {emp.role}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                         <p className="text-[10px] text-white font-bold">{emp.branch || 'Head Office'}</p>
                         <p className="text-[9px] text-slate-500 italic">Mgmt: {emp.manager || 'Direct'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] bg-black/30 w-fit px-3 py-1 rounded-lg border border-white/5">
                        <Link2 className="w-3 h-3 text-slate-600" />
                        {emp.personalFileId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          emp.status === 'ACTIVE' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-500"
                        )} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {emp.status || 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-900 border-white/10 overflow-hidden">
          <CardHeader className="bg-white/5 border-b border-white/5 p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Access Control Matrix</CardTitle>
            </div>
            <Button 
              onClick={handleAddRole}
              className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black font-black uppercase text-[10px] tracking-widest px-4 rounded-xl h-9"
            >
              Add New Role <Plus className="w-3 h-3 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 sticky left-0 bg-slate-900 z-10">Neural Role Path</th>
                  {(Object.keys(permissionLabels) as (keyof Permissions)[]).map(key => (
                    <th key={key} className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 text-center whitespace-nowrap">
                      {permissionLabels[key]}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {Object.entries(roles).map(([roleName, perms]) => (
                  <tr key={roleName} className="hover:bg-white/5 transition-all">
                    <td className="px-6 py-6 sticky left-0 bg-slate-900/95 z-10 backdrop-blur-sm border-r border-white/5">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-500/10 text-orange-500 border-none text-[9px] font-black uppercase tracking-tight py-1 px-2">
                          {roleName}
                        </Badge>
                      </div>
                    </td>
                    {(Object.keys(permissionLabels) as (keyof Permissions)[]).map(permKey => {
                      const isActive = perms[permKey];
                      return (
                        <td key={permKey} className="px-6 py-4 text-center">
                          <button 
                            onClick={() => togglePermission(roleName, permKey)}
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-all mx-auto",
                              isActive 
                                ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                                : "bg-white/5 text-slate-600 hover:bg-red-500/10 hover:text-red-500 border border-transparent"
                            )}
                          >
                            {isActive ? <Check className="w-4 h-4" /> : <X className="w-3 h-3" />}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-right">
                      <Button 
                        disabled={['Admin', 'SaaS Administrator', 'Viewer'].includes(roleName)}
                        onClick={() => handleDeleteRole(roleName)}
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex items-start gap-4">
         <div className="p-3 bg-blue-500/10 rounded-xl">
           <Brain className="w-6 h-6 text-blue-500" />
         </div>
         <div className="space-y-1">
           <h3 className="text-xs font-black text-white uppercase italic tracking-tighter">Cyber-Registry Protocol</h3>
           <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
             Changes to the <span className="text-white">Neural Role Matrix</span> are persistent across all nodes. 
             When a permission is toggled, all authenticated staff members associated with that role will experience an 
             instantaneous modular lockdown or authorization update. <span className="text-blue-400">Total System Sync achieved.</span>
           </p>
         </div>
      </div>
    </div>
  );
}
