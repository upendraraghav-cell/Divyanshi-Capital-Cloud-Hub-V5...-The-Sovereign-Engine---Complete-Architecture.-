import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Mail, 
  Phone, 
  Trash2, 
  Edit2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  List,
  UserPlus,
  Activity,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { db, collection, onSnapshot, query, orderBy, limit } from '@/lib/firebase';

interface Node {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended';
  mrr: string;
  joined: string;
  health: number;
}

export function Clients() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    // Attempt to fetch from leads as a proxy for clients in this system
    const q = query(collection(db, 'leads'), orderBy('submittedAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadNodes = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.client_name || data.name || 'Unknown Node',
          company: data.bank || data.preferred_bank || 'Standard Entity',
          email: data.email || 'no-email@protocol.io',
          phone: data.mobile || data.phone || 'NO_PH_ID',
          status: 'active' as const,
          mrr: data.amount ? `₹${Number(data.amount).toLocaleString()}` : '₹0',
          joined: data.submittedAt ? new Date(data.submittedAt.seconds * 1000).toLocaleDateString() : 'RECENT',
          health: 100
        };
      });
      
      // Fallback if no leads exist
      if (leadNodes.length === 0) {
        setNodes([
          { id: '1', name: 'Rahul Sharma', company: 'Sharma Logistics', email: 'rahul@sharmalog.in', phone: '+91 98765 11100', status: 'active', mrr: '₹12,500', joined: 'Apr 12, 2026', health: 98 },
          { id: '2', name: 'Anita Desai', company: 'Desai Estates', email: 'anita@desaireal.com', phone: '+91 98765 22200', status: 'active', mrr: '₹8,900', joined: 'Apr 10, 2026', health: 95 },
        ]);
      } else {
        setNodes(leadNodes);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Clients Registry Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight italic uppercase">P1 Client Registry</h1>
          <p className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.4em]">Managing {nodes.length} Matrix Entities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
             <Button 
               variant="ghost" 
               size="sm" 
               className={`h-9 px-3 rounded-lg ${viewMode === 'table' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500'}`}
               onClick={() => setViewMode('table')}
             >
               <List className="w-4 h-4" />
             </Button>
             <Button 
               variant="ghost" 
               size="sm" 
               className={`h-9 px-3 rounded-lg ${viewMode === 'grid' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500'}`}
               onClick={() => setViewMode('grid')}
             >
               <LayoutGrid className="w-4 h-4" />
             </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 rounded-xl shadow-xl shadow-blue-600/20 h-11 uppercase tracking-widest text-[10px]">
            Index New Entity <UserPlus className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Registry Health', value: 'OPTIMAL', icon: Activity, color: 'text-emerald-500' },
           { label: 'Sync Status', value: 'LIVE', icon: Database, color: 'text-blue-500' },
           { label: 'Active Nodes', value: nodes.length, icon: Users, color: 'text-orange-500' }
         ].map((stat, i) => (
           <Card key={i} className="bg-slate-900/50 border-white/5 shadow-xl">
             <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={cn("p-2 rounded-lg bg-white/5 border border-white/5", stat.color)}>
                     <stat.icon className="w-4 h-4" />
                   </div>
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</span>
                </div>
                <span className={cn("text-lg font-black italic", stat.color)}>{stat.value}</span>
             </CardContent>
           </Card>
         ))}
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">
        <CardHeader className="bg-white/[0.01] border-b border-white/5 p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
              <Input 
                placeholder="Search Registry..." 
                className="pl-11 bg-white/5 border-white/10 text-white focus:ring-0 focus:border-orange-500/50 transition-all rounded-xl h-11"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-white/5 border-white/10 text-white font-bold h-11 px-4 rounded-xl">
                <Filter className="w-4 h-4 mr-2 text-orange-500" /> Filter
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white font-bold h-11 px-4 rounded-xl">
                <Download className="w-4 h-4 mr-2 text-orange-500" /> Export Matrix
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-extrabold border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4">Node Profile</th>
                  <th className="px-6 py-4">Financial Entity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Sync</th>
                  <th className="px-6 py-4">Volume</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {nodes.map((node) => (
                  <tr key={node.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/10 flex items-center justify-center text-xs font-black text-orange-500 shadow-lg group-hover:scale-110 transition-transform italic">
                          {node.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase">{node.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{node.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">{node.company}</span>
                        <span className="text-[9px] text-slate-600 font-bold font-mono">{node.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <Badge variant="outline" className={cn(
                        "rounded-lg px-2.5 py-1 font-black text-[9px] uppercase tracking-widest border-0",
                        node.status === 'active' ? "bg-emerald-500/10 text-emerald-500" :
                        node.status === 'pending' ? "bg-amber-500/10 text-amber-500" :
                        "bg-rose-500/10 text-rose-500"
                      )}>
                        {node.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-6">
                       <span className="text-[10px] font-black text-slate-500 uppercase">{node.joined}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-black text-white italic">{node.mrr}</span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-xl">
                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-panel w-48 bg-slate-900 border-white/10">
                          <DropdownMenuLabel className="text-slate-400 text-[10px] uppercase tracking-widest">Registry Action</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem className="gap-2 cursor-pointer text-white">
                            <ExternalLink className="w-4 h-4 text-blue-500" /> Inspect Node
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-white">
                            <Edit2 className="w-4 h-4 text-orange-500" /> Update Entity
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-rose-500">
                            <Trash2 className="w-4 h-4" /> Decommission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="bg-white/[0.01] border-t border-white/5 p-4 flex items-center justify-between">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Registry Nodes: {nodes.length}</p>
           <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5 text-slate-400">
                <ChevronLeft className="w-4 h-4" />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5 text-orange-500 font-black">
                1
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5 text-slate-400">
                <ChevronRight className="w-4 h-4" />
             </Button>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}
