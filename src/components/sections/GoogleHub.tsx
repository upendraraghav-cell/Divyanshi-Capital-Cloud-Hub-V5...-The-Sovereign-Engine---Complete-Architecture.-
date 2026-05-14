import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Mail, 
  MessageSquare, 
  Layout, 
  Files, 
  Shield, 
  Zap,
  Globe,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const services = [
  { 
    id: 'calendar', 
    name: 'Google Calendar', 
    desc: 'Meeting scheduling & TAT monitoring', 
    status: 'Linked',
    icon: Calendar,
    color: 'text-blue-500',
    stat: '12 Events Today'
  },
  { 
    id: 'chat', 
    name: 'Google Chat', 
    desc: 'Internal team comms & bot alerts', 
    status: 'Linked',
    icon: MessageSquare,
    color: 'text-emerald-500',
    stat: 'Active'
  },
  { 
    id: 'mail', 
    name: 'Gmail Sovereign', 
    desc: 'Autonomous lead follow-up & MIS reports', 
    status: 'Linked',
    icon: Mail,
    color: 'text-red-500',
    stat: '243 Sent Today'
  },
  { 
    id: 'drive', 
    name: 'Google Drive', 
    desc: 'Master Personal File storage (encrypted)', 
    status: 'Linked',
    icon: Files,
    color: 'text-amber-500',
    stat: 'P1 Master Syncing'
  },
  { 
    id: 'sheets', 
    name: 'Google Sheets', 
    desc: 'P1 Master Project Registry (V5 Engine)', 
    status: 'Linked',
    icon: Layout,
    color: 'text-green-500',
    stat: 'Real-time Bridge'
  }
];

export function GoogleHub() {
  const handleSync = (service: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Re-establishing Neural Link with ${service}...`,
        success: `${service} Identity Matrix Synchronized.`,
        error: `Link failure on ${service}. Check OAuth permissions.`
      }
    );
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Google Sovereign Hub</h1>
          <p className="text-slate-500 flex items-center gap-2 text-sm font-medium">
            Standardizing the Neural Bridge with Google Core Services <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter opacity-50">Enterprise V5</Badge>
          </p>
        </div>
        <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest h-12 px-6">
          <RefreshCw className="w-4 h-4" />
          Sync All Nodes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -5 }}
                className="group relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <service.icon size={80} />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${service.color}`}>
                      <service.icon size={24} />
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] px-3 uppercase tracking-tighter">
                      {service.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white mb-2">{service.name}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Metadata</span>
                      <span className="text-xs font-bold text-white">{service.stat}</span>
                    </div>
                    <button 
                      onClick={() => handleSync(service.name)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[2.5rem] bg-white/5 border-white/10 backdrop-blur-3xl overflow-hidden border">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-lg font-black text-white italic uppercase flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-500" />
                Security Layer
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium">Identity & Key Management for Google Integrations</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OAuth Tokens</p>
                    <p className="text-xs font-bold text-white uppercase tracking-tighter">Encrypted at Rest</p>
                  </div>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Bridge</p>
                    <p className="text-xs font-bold text-white uppercase tracking-tighter">128-bit Matrix Sync</p>
                  </div>
                  <Globe className="w-4 h-4 text-cyan-500" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Master Project IDs</h4>
                <div className="space-y-3">
                  {[
                    { name: 'P1 Master Registry', id: '1Mk9AzGdKK...Qwh70r0UicU' },
                    { name: 'Sales MIS Log', id: '1SaFxHICu3G...lNYiKl4' },
                    { name: 'HR MD Matrix', id: '1xR-UyH8LXv...xr6iiuGs' }
                  ].map(id => (
                    <div key={id.name} className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-cyan-500/30 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{id.name}</span>
                        <ExternalLink size={10} className="text-slate-600 group-hover:text-cyan-500" />
                      </div>
                      <p className="text-[10px] font-mono text-cyan-400 font-medium truncate">{id.id}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full h-12 bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-[1.02] transition-all">
                Update Master ID Map
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
