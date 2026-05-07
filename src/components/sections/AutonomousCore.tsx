import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  Database, 
  ShieldCheck, 
  RefreshCw, 
  Terminal,
  Activity,
  ChevronRight,
  Sparkles,
  Command
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { gasService } from '@/services/gasService';
import { toast } from 'sonner';

export function AutonomousCore({ user }: { user: any }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEvolutionActive, setIsEvolutionActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Sovereign Engine Bootstrapped.",
    "[SYSTEM] Neural Bridge v5.0 Active.",
    "[SYSTEM] Ready for MD Directives."
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const handleAction = async (action: string, handler: () => Promise<any>, successMsg: string) => {
    if (isSyncing || isEvolutionActive) return;
    
    const toastId = toast.loading(`Initiating ${action}...`);
    setIsSyncing(true);
    addLog(`Neural Command: Executing ${action}...`);
    
    try {
      const res = await handler();
      if (res.ok) {
        toast.success(successMsg, { id: toastId });
        addLog(`[SUCCESS] ${action} Protocol Complete.`);
      } else {
        toast.error(`${action} Failed: ${res.error}`, { id: toastId });
        addLog(`[ERROR] ${action} Protocol Fracture: ${res.error}`);
      }
    } catch (e: any) {
      toast.error(`System Error: ${e.message}`, { id: toastId });
      addLog(`[CRITICAL] Neural Bridge Fail: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const masterEngine = () => handleAction(
    "MASTER_AUTO_ENGINE", 
    () => gasService.triggerMasterAutoEngine(),
    "Master Auto Engine Deployed - System Aligned"
  );

  const syncP1 = () => handleAction(
    "P1_SYNC", 
    () => gasService.syncP1ToProperties(),
    "P1 Registry Synchronized with Script Core"
  );

  const goLive = () => handleAction(
    "GO_LIVE", 
    () => gasService.goLiveProduction(),
    "Production Nodes Live - Traffic Enabled"
  );

  const marketScan = () => handleAction(
    "EVOLUTION_SCAN", 
    () => gasService.autonomousMarketScan(),
    "Autonomous Market Scan Complete - Evolution Data Saved"
  );

  if (user?.role !== 'MD' && user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <ShieldCheck className="w-16 h-16 text-rose-500 mx-auto opacity-50" />
          <h2 className="text-2xl font-black uppercase text-white">Access Restricted</h2>
          <p className="text-slate-500 text-sm italic font-bold">Only Maalik or MD Command can access the Sovereign Core.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-3">
            <Cpu className="text-blue-500 w-10 h-10" />
            Autonomous Core
          </h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1 italic">
            Divyanshi Capital | Sovereign Evolution Engine v5.0
          </p>
        </div>
        <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Core Online</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Zap className="text-amber-500" />} 
          title="Neural Uptime" 
          value="99.98%" 
          trend="+0.02%" 
          color="amber"
        />
        <StatCard 
          icon={<RefreshCw className="text-blue-500" />} 
          title="Sync Latency" 
          value="12.4ms" 
          trend="-2.1ms" 
          color="blue"
        />
        <StatCard 
          icon={<Activity className="text-green-500" />} 
          title="Active Nodes" 
          value="42" 
          trend="+3" 
          color="green"
        />
        <StatCard 
          icon={<ShieldCheck className="text-purple-500" />} 
          title="Integrity" 
          value="100%" 
          trend="SECURE" 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/40 border-white/10 overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Command Modules</CardTitle>
              <CardDescription className="text-xs italic font-bold">Direct MD Overrides and Self-Evolution Triggers</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CommandButton 
                icon={<Command className="w-5 h-5" />}
                title="Master Auto Engine"
                description="One-click full system alignment"
                onClick={masterEngine}
                loading={isSyncing}
                color="blue"
              />
              <CommandButton 
                icon={<Database className="w-5 h-5" />}
                title="P1 Registry Sync"
                description="Fetch latest tokens from Master"
                onClick={syncP1}
                loading={isSyncing}
                color="amber"
              />
              <CommandButton 
                icon={<Sparkles className="w-5 h-5" />}
                title="Evolution Scan"
                description="Initiate market AI-upgrade"
                onClick={marketScan}
                loading={isSyncing}
                color="purple"
              />
              <CommandButton 
                icon={<ShieldCheck className="w-5 h-5" />}
                title="Go Live Mode"
                description="Prepare for heavy transaction load"
                onClick={goLive}
                loading={isSyncing}
                color="green"
              />
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Sovereign Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-48 flex items-end justify-between gap-2">
                {[45, 67, 89, 100, 92, 110, 105, 120, 95, 115, 130, 140].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-1 bg-gradient-to-t from-blue-500/20 to-blue-500/80 rounded-t-sm"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-black text-slate-600 uppercase italic">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-black/40 border-white/10 h-full flex flex-col">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Live Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="p-4 space-y-3 font-mono text-[11px] h-[500px] overflow-y-auto">
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "p-2 border-l-2",
                      log.includes('[ERROR]') ? "bg-rose-500/5 border-rose-500 text-rose-400" :
                      log.includes('[SUCCESS]') ? "bg-green-500/5 border-green-500 text-green-400" :
                      "bg-white/5 border-blue-500 text-blue-400"
                    )}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, color }: any) {
  const colorMap = {
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-500",
    blue: "border-blue-500/20 bg-blue-500/5 text-blue-500",
    green: "border-green-500/20 bg-green-500/5 text-green-500",
    purple: "border-purple-500/20 bg-purple-500/5 text-purple-500",
  };

  return (
    <Card className="bg-black/40 border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colorMap[color as keyof typeof colorMap]}`}>
            {icon}
          </div>
          <span className={`text-[10px] font-black uppercase italic ${colorMap[color as keyof typeof colorMap]}`}>
            {trend}
          </span>
        </div>
        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest leading-none mb-2">{title}</h3>
        <p className="text-3xl font-black text-white tracking-tighter italic">{value}</p>
      </CardContent>
    </Card>
  );
}

function CommandButton({ icon, title, description, onClick, loading, color }: any) {
  const colorMap = {
    blue: "hover:border-blue-500/50 text-blue-500 bg-blue-500/10",
    amber: "hover:border-amber-500/50 text-amber-500 bg-amber-500/10",
    purple: "hover:border-purple-500/50 text-purple-500 bg-purple-500/10",
    green: "hover:border-green-500/50 text-green-500 bg-green-500/10",
  };

  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border border-white/5 text-left transition-all group",
        colorMap[color as keyof typeof colorMap],
        loading && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="mt-1 transition-transform group-hover:scale-110 group-hover:rotate-6">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-black uppercase italic text-white flex items-center gap-2">
          {title}
          <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
        </h4>
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">{description}</p>
      </div>
    </button>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
