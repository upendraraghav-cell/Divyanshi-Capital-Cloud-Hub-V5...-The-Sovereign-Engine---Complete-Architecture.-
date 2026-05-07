import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Search, 
  Database, 
  Briefcase, 
  User, 
  Building2,
  RefreshCcw,
  Navigation,
  Globe,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MatrixNode {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  rm: string;
  status: string;
}

export function NeuralMap() {
  const [nodes, setNodes] = useState<MatrixNode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState('');

  const fetchMatrix = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/intelligence/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'map', query: 'all' })
      });
      const data = await res.json();
      if (data.ok) {
        setNodes(data.locations);
        setLastSync(data.sheetInfo.lastSync);
        toast.success(`Latched to Google Sheet: ${data.sheetInfo.rowsSynced} locations synced`);
      }
    } catch (error) {
      toast.error("Failed to sync with Neural Geo-Matrix");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const filteredNodes = nodes.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.rm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight italic uppercase">Neural Geo-Matrix</h1>
          <p className="text-slate-400">Google Sheets Synced Coordination Grid for Multi-User Sales Pilots</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchMatrix}
            disabled={isLoading}
            className="border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white"
          >
            <RefreshCcw className={cn("w-3 h-3 mr-2", isLoading && "animate-spin")} />
            Recalibrate Matrix
          </Button>
          {lastSync && (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase">
              Last Sync: {new Date(lastSync).toLocaleTimeString()}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-black/40 border-white/10 aspect-[16/9] relative overflow-hidden group">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/72.8777,19.0760,11,0/800x600?access_token=pk.mock')] bg-cover bg-center transition-transform duration-10000 group-hover:scale-110" />
            
            {/* Radar Pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-64 border border-blue-500/20 rounded-full animate-ping" />
              <div className="absolute inset-0 w-64 h-64 border border-blue-500/10 rounded-full animate-ping delay-1000" />
            </div>

            {/* Matrix Data Layer */}
            <div className="absolute inset-0 p-8 flex items-center justify-center pointer-events-none">
               <div className="text-center space-y-4">
                  <Globe className="w-16 h-16 text-blue-500/20 mx-auto animate-pulse" />
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Neural Mapping Overlay Active</p>
               </div>
            </div>

            {/* Pins */}
            {filteredNodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                className="absolute cursor-pointer pointer-events-auto group/pin"
                style={{ 
                  left: `${((node.lng - 72.8) * 1000) % 100}%`, 
                  top: `${((node.lat - 18.9) * 1000) % 100}%` 
                }}
              >
                <div className={cn(
                  "p-1.5 rounded-full shadow-2xl transition-all",
                  node.type === 'Bank' ? "bg-blue-600 shadow-blue-600/40" : "bg-purple-600 shadow-purple-600/40"
                )}>
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none z-50">
                   <div className="bg-black/90 border border-white/20 p-2 rounded-lg whitespace-nowrap shadow-2xl">
                     <p className="text-[10px] font-black text-white uppercase tracking-tighter">{node.name}</p>
                     <p className="text-[8px] text-slate-500 font-bold uppercase">{node.rm} ({node.status})</p>
                   </div>
                </div>
              </motion.div>
            ))}

            <div className="absolute bottom-4 left-4 flex gap-2">
               <Badge className="bg-blue-600 text-white border-none text-[8px] font-black uppercase">Banks</Badge>
               <Badge className="bg-purple-600 text-white border-none text-[8px] font-black uppercase">NBFCs</Badge>
               <Badge className="bg-emerald-600 text-white border-none text-[8px] font-black uppercase">On-Site RMs</Badge>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search Bank / RM..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border-white/10 pl-10 text-xs text-white"
              />
            </div>
            <Button variant="outline" size="icon" className="border-white/10 bg-white/5">
              <Filter className="w-4 h-4 text-slate-500" />
            </Button>
          </div>

          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-3">
              {filteredNodes.map((node) => (
                <motion.div
                  key={node.id}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                       <div className={cn(
                         "p-2 rounded-lg",
                         node.type === 'Bank' ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                       )}>
                         {node.type === 'Bank' ? <Building2 className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                       </div>
                       <div>
                         <h3 className="text-xs font-black text-white uppercase italic tracking-wider">{node.name}</h3>
                         <p className="text-[10px] text-slate-500 font-bold uppercase">{node.type} Node</p>
                       </div>
                    </div>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase",
                      node.status === 'Active' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {node.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-600 uppercase">Assigned RM</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-white font-bold">
                           <User className="w-3 h-3 text-blue-400" />
                           {node.rm}
                        </div>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-600 uppercase">Coordinates</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-mono">
                           <Navigation className="w-3 h-3" />
                           {node.lat.toFixed(2)}, {node.lng.toFixed(2)}
                        </div>
                     </div>
                  </div>

                  <Button className="w-full mt-4 bg-white/5 hover:bg-blue-600 hover:text-white text-slate-500 h-8 text-[10px] font-black uppercase tracking-widest border border-white/5 group-hover:border-blue-500/30 transition-all">
                    Connect to RM
                  </Button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <Card className="bg-blue-600 border-none shadow-lg shadow-blue-600/20">
             <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/20">
                   <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Master Coordination</p>
                   <p className="text-xs font-bold text-white">Broadcast Lead to Nearest RM</p>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
