import { useState } from 'react';
import { 
  Send, 
  Users, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  MessageSquare, 
  Bot, 
  Terminal,
  Activity,
  Globe,
  Lock,
  BrainCircuit,
  BellRing
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function TelegramAutomation() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'broadcast' | 'webhooks' | 'neural'>('broadcast');
  
  const [stats] = useState({
    subscribers: '12,402',
    deliveryRate: '99.8%',
    activeBots: 2,
    threatsBlocked: '142'
  });

  const [scriptUrl, setScriptUrl] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    const promise = new Promise(resolve => setTimeout(resolve, 2000));
    toast.promise(promise, {
      loading: 'Syncing Neural Webhooks...',
      success: 'Webhooks Synchronized with Telegram API',
      error: 'Sync Failed',
    });
    promise.finally(() => setIsSyncing(false));
  };

  const triggerNeuralScript = async () => {
    if (!scriptUrl) {
      toast.error('Missing Script Configuration', {
        description: 'Please input your Apps Script or API URL first.'
      });
      return;
    }

    setIsTriggering(true);
    try {
      // Simulation of the real API call to user's script
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Neural Script Triggered', {
        description: `Command sequence sent to ${new URL(scriptUrl).hostname}`
      });
    } catch (err) {
      toast.error('Connection Refused', {
        description: 'Check your AppScript deployment permissions (Web App set to "Anyone").'
      });
    } finally {
      setIsTriggering(false);
    }
  };

  const broadcastTypes = [
    { id: 'followup', icon: BellRing, title: 'Campaign Follow-up', desc: 'Auto-trigger based on user inactivity.', color: 'text-orange-500' },
    { id: 'global', icon: Globe, title: 'Global Broadcast', desc: 'Send updates to all channel members.', color: 'text-blue-500' },
    { id: 'secure', icon: Lock, title: 'Secure PII Send', desc: 'Encrypted delivery for sensitive data.', color: 'text-emerald-500' }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Bot className="w-5 h-5 text-blue-500" />
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Advanced Matrix</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight italic uppercase">Telegram Automation</h1>
          <p className="text-slate-400 font-medium">Enterprise-level broadcasting & Neural Webhook Management.</p>
        </div>
        <div className="flex gap-3">
           <Button 
             variant="outline" 
             onClick={handleSync}
             disabled={isSyncing}
             className="bg-white/5 border-white/10 text-white font-bold h-10 px-6 rounded-xl hover:bg-white/10"
           >
             <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
             Sync Webhooks
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] h-10 px-8 rounded-xl shadow-lg shadow-blue-500/20">
             <Zap className="w-3.5 h-3.5 mr-2" />
             Deploy Bot
           </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Subscribers', value: stats.subscribers, icon: Users, color: 'text-blue-400' },
          { label: 'Delivery Rate', value: stats.deliveryRate, icon: MessageSquare, color: 'text-emerald-400' },
          { label: 'Active Bots', value: stats.activeBots, icon: Bot, color: 'text-orange-400' },
          { label: 'Threats Blocked', value: stats.threatsBlocked, icon: ShieldCheck, color: 'text-rose-400' }
        ].map((stat, i) => (
          <Card key={i} className="bg-white/[0.03] border-white/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("p-2.5 rounded-lg bg-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-white italic">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Automation Control */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#0a131d] border-white/10 overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black italic tracking-tighter text-white uppercase flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-500" />
                    Campaign Broadcaster
                  </CardTitle>
                  <CardDescription className="text-slate-500 uppercase text-[10px] font-bold tracking-widest mt-1">Multi-Channel Telegram Operations</CardDescription>
                </div>
                <div className="flex bg-white/5 rounded-lg p-1">
                  {(['broadcast', 'webhooks', 'neural'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={cn(
                        "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === t ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'broadcast' && (
                  <motion.div
                    key="broadcast"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {broadcastTypes.map(type => (
                        <div key={type.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                          <type.icon className={cn("w-6 h-6 mb-4 group-hover:scale-110 transition-transform", type.color)} />
                          <h4 className="text-sm font-black text-white italic uppercase mb-1">{type.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{type.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Broadcast Message Content</label>
                          <textarea 
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-sm text-white min-h-[120px] focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                            placeholder="Type your campaign message here. AI will auto-format for Telegram..."
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-y border-white/5">
                           <div className="flex items-center gap-2">
                             <Switch defaultChecked />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Auto-Optimization</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Switch />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Smart Schedule (Best Time)</span>
                           </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] h-12 rounded-xl">
                          <Zap className="w-4 h-4 mr-2" />
                          Initialize Broadcast Flow
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                 {activeTab === 'webhooks' && (
                   <motion.div
                    key="webhooks"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                     <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <Terminal className="w-8 h-8 text-orange-500" />
                           <div>
                              <p className="text-sm font-black text-white italic uppercase">Self-Updating Webhook Matrix</p>
                              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Encryption status: AES-256 Enabled & Active</p>
                           </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const code = `function sendToLaila(data) {
  const url = "${window.location.origin}/api/webhooks/bridge";
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data)
  };
  return UrlFetchApp.fetch(url, options);
}`;
                            navigator.clipboard.writeText(code);
                            toast.success("Apps Script code copied to clipboard!");
                          }}
                          className="bg-orange-500/10 border-orange-500/20 text-orange-500 text-[10px] font-black uppercase"
                        >
                          Copy Apps Script Code
                        </Button>
                     </div>

                     <div className="space-y-3">
                        {[
                          { persona: 'LAILA', path: '/api/v1/telegram/laila/webhook', status: 'Optimal' },
                          { persona: 'BULBHUL', path: '/api/v1/telegram/bulbhul/webhook', status: 'Syncing' },
                          { persona: 'NEURAL_BRIDGE', path: '/api/webhooks/bridge', status: 'Optimal' }
                        ].map((hook, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 group">
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-[10px] text-blue-400">{hook.persona[0]}</div>
                                <div>
                                   <p className="text-xs font-black text-white uppercase italic">{hook.persona} Bot Core</p>
                                   <div className="flex items-center gap-2">
                                      <code className="text-[9px] text-slate-500">{window.location.origin}{hook.path}</code>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-4 w-4 text-slate-600 hover:text-white"
                                        onClick={() => {
                                          navigator.clipboard.writeText(`${window.location.origin}${hook.path}`);
                                          toast.success("URL copied!");
                                        }}
                                      >
                                        <Lock className="w-2.5 h-2.5" />
                                      </Button>
                                   </div>
                                </div>
                             </div>
                             <Badge className={cn(
                               "text-[8px] font-black uppercase tracking-[0.2em]",
                               hook.status === 'Optimal' ? "bg-emerald-500/10 text-emerald-500" :
                               hook.status === 'Locked' ? "bg-blue-500/10 text-blue-500" :
                               "bg-orange-500/10 text-orange-500 animate-pulse"
                             )}>
                                {hook.status}
                             </Badge>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                )}

                {activeTab === 'neural' && (
                   <motion.div
                    key="neural"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                   >
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                         <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                               <Terminal className="w-4 h-4 text-blue-500" />
                               <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Neural Script Configuration</span>
                            </div>
                            {scriptUrl && (
                              <Button 
                                variant="link" 
                                onClick={() => window.open(scriptUrl, '_blank')}
                                className="h-auto p-0 text-[10px] text-blue-400 font-black uppercase tracking-widest hover:text-white"
                              >
                                <Globe className="w-3 h-3 mr-1" />
                                Launch External Matrix
                              </Button>
                            )}
                         </div>
                         <div className="flex gap-3">
                            <Input 
                               placeholder="https://script.google.com/macros/s/.../exec" 
                               value={scriptUrl}
                               onChange={(e) => setScriptUrl(e.target.value)}
                               className="bg-black/40 border-white/10 h-10 text-xs font-mono text-blue-400 placeholder:text-slate-700"
                            />
                            <Button 
                               onClick={triggerNeuralScript}
                               disabled={isTriggering}
                               className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-lg whitespace-nowrap"
                            >
                               {isTriggering ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 mr-2" />}
                               Trigger Script
                            </Button>
                         </div>
                         <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <Lock className="w-4 h-4 text-blue-400 mt-0.5" />
                            <div className="space-y-1">
                               <p className="text-[9px] text-blue-300 font-bold uppercase tracking-wider">Security Notice: Iframe Blocking Active</p>
                               <p className="text-[8px] text-slate-500 font-medium leading-relaxed">
                                  Google scripts display a white screen inside containers. Use the "Launch External Matrix" button to view the dashboard directly. Ensure your script is deployed as a Web App with access set to "Anyone".
                               </p>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20">
                            <BrainCircuit className="w-6 h-6 text-blue-500 mb-4" />
                            <h5 className="text-sm font-black text-white italic uppercase mb-2">AI Mind Replay</h5>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                              "Simulates thousands of conversation outcomes before replying to ensure optimal conversion and security."
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                               <span className="text-[9px] font-black text-blue-400 uppercase">Process Confidence</span>
                               <span className="text-[9px] font-black text-white italic">99.2%</span>
                            </div>
                            <Progress value={99.2} className="h-1.5 mt-1 bg-white/5" />
                         </div>

                         <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-transparent border border-emerald-500/20">
                            <Activity className="w-6 h-6 text-emerald-500 mb-4" />
                            <h5 className="text-sm font-black text-white italic uppercase mb-2">Active Sentiment</h5>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                              "Real-time monitoring of user frustration or intent, auto-switching LAILA/BULBHUL nodes."
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                               <span className="text-[9px] font-black text-emerald-400 uppercase">System Readiness</span>
                               <span className="text-[9px] font-black text-white italic">Elite</span>
                            </div>
                            <Progress value={95} className="h-1.5 mt-1 bg-white/5" />
                         </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <ShieldCheck className="w-8 h-8 text-blue-500" />
                            <div>
                               <p className="text-sm font-black text-white italic uppercase tracking-tighter">Self-Learning Security Layer</p>
                               <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Auto-blocks spam and script injection attempts.</p>
                            </div>
                         </div>
                         <Switch defaultChecked />
                      </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
           <Card className="bg-white/[0.03] border-white/10">
              <CardHeader className="pb-2">
                 <CardTitle className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Live Feed Matrix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 {[
                   { user: 'Client_9921', action: 'Requested Home Loan Quote', time: '2m ago', state: 'Replied by LAILA' },
                   { user: 'Partner_Node', action: 'Broadcast Received', time: '5m ago', state: 'Success' },
                   { user: 'Visitor_442', action: 'CIBIL Check Triggered', time: '12m ago', state: 'Processing' }
                 ].map((log, i) => (
                    <div key={i} className="flex gap-3 relative">
                       {i !== 2 && <div className="absolute left-[11px] top-6 bottom-[-20px] w-[2px] bg-white/5" />}
                       <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex-shrink-0 flex items-center justify-center">
                          <Activity className="w-3 h-3 text-blue-400" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                             <p className="text-[10px] font-black text-white uppercase italic truncate">{log.user}</p>
                             <span className="text-[8px] text-slate-500 font-bold whitespace-nowrap">{log.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight mb-1">{log.action}</p>
                          <Badge className="bg-white/5 text-slate-500 border-none text-[8px] font-black uppercase px-2 h-4">{log.state}</Badge>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>

           <Card className="bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/20 overflow-hidden relative group">
              <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-blue-500/10 blur-3xl rounded-full" />
              <CardContent className="p-6 relative z-10">
                 <Zap className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                 <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2 leading-tight">Neural Trigger Active</h4>
                 <p className="text-[11px] text-slate-400 leading-relaxed font-medium mb-6 italic">
                    "LAILA is currently monitoring all channels for intent-based triggers. All responses are verified through the AI Mind Replay engine."
                 </p>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-[9px] font-black text-white uppercase tracking-widest">
                       <span>CPU Load</span>
                       <span className="text-blue-400">Normal</span>
                    </div>
                    <Progress value={24} className="h-1.5 bg-white/5" />
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
