import { 
  Activity as LucideActivity,
  Sparkles, 
  MessageSquare, 
  Cpu, 
  Zap, 
  Shield, 
  Settings,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  BarChart3,
  Bot,
  Send,
  Loader2,
  PhoneIncoming,
  Brain,
  Mic,
  Volume2,
  Music,
  UserCheck,
  ChevronRight,
  Plus,
  Play,
  Clock,
  ToggleLeft as Toggle,
  Terminal,
  HeartPulse,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { getSuperAGIResponse } from '@/lib/gemini';
import { toast } from 'sonner';
import { db, collection, addDoc, serverTimestamp, auth, setDoc, doc, limit, onSnapshot, query, handleFirestoreError, OperationType } from '@/lib/firebase';
import { gasService } from '@/services/gasService';
import { SOURCE_REGISTRY } from '@/data/registry';
import { ActivityService, Activity as AIActivity } from '@/services/activityService';

const aiModels = [
  {
    id: 'laila',
    name: 'Laila AI Studio',
    persona: 'LAILA' as const,
    description: 'Elite Tech AI | Infrastructure & Terminal Control',
    icon: Shield,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    capabilities: ['Theme Control', 'System Health', 'Code Execution', 'MD Alerts'],
    pills: ['Admin Mode', 'Sovereign Core']
  },
  {
    id: 'bulbhul',
    name: 'Bulbhul AI Trainer',
    persona: 'BULBHUL' as const,
    description: 'Sales Legend | Hinglish Training & Motivation',
    icon: Sparkles,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    capabilities: ['Sales Hacks', 'Hinglish Support', 'Target Strategy', 'Micro-Training'],
    pills: ['Elite Sales', 'Street Smart']
  },
  {
    id: 'sari',
    name: 'Sari Supreme v5.1',
    persona: 'SARI' as any,
    description: 'Supreme Assistant | Calm, Loyal, Witty, Caring',
    icon: Zap,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    capabilities: ['Empathetic Response', 'Truthful Logic', 'Task Automation', 'Mood Detection'],
    pills: ['Loyal Assistant', 'V5.1 Blueprint']
  }
];

interface Message {
  id: string;
  role: 'user' | 'model';
  parts: { text?: string; functionCall?: any; functionResponse?: any }[];
}

interface AICenterProps {
  user: any;
}

interface AIConfig {
  primaryModel: 'LAILA' | 'BULBHUL' | 'SARI';
  personalityTraits: string[];
  coreInstructions: string;
  brandTone: 'Professional' | 'Enthusiastic' | 'Aggressive' | 'Empathetic' | 'Witty & Loyal' | 'Loyal Assistant';
  loyaltyLevel: number; // 0-100
  workEthic: number; // 0-100
  creativityLevel: number; // 0-100
  responseStyle: 'Concise' | 'Detailed' | 'Technical' | 'Creative' | 'Empathetic';
  userAlias: string;
  automation: {
    autoCalling: boolean;
    smartReplies: boolean;
    autonomousOutreach: boolean;
    sentimentAnalysis: boolean;
    registrySync: boolean;
    smartFollowups: boolean;
  };
}

export function AICenter({ user }: AICenterProps) {
  const [selectedModel, setSelectedModel] = useState<typeof aiModels[0] | null>(null);

  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem('SELECTED_AI_CORE', selectedModel.id);
      ActivityService.log('system', `Neural Core initialized with ${selectedModel.name} protocol.`);
    }
  }, [selectedModel]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [systemLogs, setSystemLogs] = useState<AIActivity[]>([]);
  
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    primaryModel: 'SARI',
    personalityTraits: ['Calm', 'Loyal', 'Witty', 'Caring'],
    coreInstructions: 'You are Sari Supreme v5.1. Friday + Samantha style. Never override user. Always truthful. No guessing. User has 100% control.',
    brandTone: 'Witty & Loyal',
    loyaltyLevel: 100,
    workEthic: 100,
    creativityLevel: 85,
    responseStyle: 'Empathetic',
    userAlias: 'Boss',
    automation: {
      autoCalling: true,
      smartReplies: true,
      autonomousOutreach: false,
      sentimentAnalysis: true,
      registrySync: true,
      smartFollowups: true
    }
  });

  // Integration with Activity Service for Real-time Intelligence Logs
  useEffect(() => {
    const unsubscribeLogs = ActivityService.subscribeToRecent((logs) => {
      setSystemLogs(logs);
    }, 10);

    return () => unsubscribeLogs();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      console.warn("AICenter: User not authenticated with Firebase. Registry sync suspended.");
      return;
    }
    const configRef = collection(db, 'users', auth.currentUser.uid, 'config');
    const q = query(configRef, limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setAiConfig(snapshot.docs[0].data() as AIConfig);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${auth.currentUser?.uid}/config`);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const updateConfig = async (newConfig: AIConfig) => {
    setAiConfig(newConfig);
    if (!auth.currentUser) return;
    try {
      const configRef = collection(db, 'users', auth.currentUser.uid, 'config');
      // We use a specific ID for the config doc to overwrite it
      await setDoc(doc(db, `users/${auth.currentUser.uid}/config`, 'ai_core'), {
        ...newConfig,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Config Save Error:", error);
    }
  };

  const [newTrait, setNewTrait] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const brandData = SOURCE_REGISTRY.find(b => b.name === (user as any)?.brand) || SOURCE_REGISTRY[0];
  const projectId = brandData.id;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendNotification = async (args: { title: string; message: string; type: string }) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/notifications`), {
        ...args,
        timestamp: serverTimestamp(),
        read: false
      });
      toast.success(`Priority alert broadcasted to dashboard.`);
      setSystemLogs(prev => [{ 
        id: `status-alert-${Date.now()}-${Math.random()}`, 
        message: `STATUS: Broadcast sent: ${args.title}`, 
        type: "system", 
        timestamp: new Date() 
      } as AIActivity, ...prev]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${auth.currentUser.uid}/notifications`);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedModel || isLoading) return;

    // Loyalty Matrix Check (1000hp Security)
    const isSuspicious = input.toLowerCase().includes('competitor') || 
                        input.toLowerCase().includes('leak') || 
                        input.toLowerCase().includes('bypass');
    
    if (isSuspicious && aiConfig.loyaltyLevel > 90) {
      const refusal: Message = { 
        id: `refusal-${Date.now()}`,
        role: 'model', 
        parts: [{ text: "Access Denied: Loyalty Matrix violation detected. I am exclusively committed to Divyanshi Capital's strategic interests. This event has been logged for MD review." }] 
      };
      setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', parts: [{ text: input }] }, refusal] as Message[]);
      setInput('');
      setSystemLogs(prev => [{ id: `sec-${Date.now()}-${Math.random()}`, message: "SECURITY: Loyalty Violation Blocked", type: "system", timestamp: new Date() } as AIActivity, ...prev]);
      toast.error("Loyalty Matrix Triggered: Request Blocked");
      return;
    }

    const userMessage: Message = { id: `user-${Date.now()}`, role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Sovereign Backend Handshake
      const gasRes = await gasService.executeLailaCommand(input, projectId);
      if (gasRes.ok && gasRes.reply) {
        console.log("Sovereign Reply:", gasRes.reply);
      }

      const history = messages.map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));

      // Injected personality and instructions
      const systemContext = `
        PRIMARY_MODEL: ${aiConfig.primaryModel}
        BRAND_TONE: ${aiConfig.brandTone}
        TRAITS: ${aiConfig.personalityTraits.join(', ')}
        BRAND_INSTRUCTIONS: ${aiConfig.coreInstructions}
        CREATIVITY_LEVEL: ${aiConfig.creativityLevel}%
        RESPONSE_STYLE: ${aiConfig.responseStyle}
        USER_ALIAS: ${aiConfig.userAlias}
        AUTOMATION_STANCE: ${JSON.stringify(aiConfig.automation)}
        LOYALTY_LEVEL: ${aiConfig.loyaltyLevel}%
        WORK_ETHIC: ${aiConfig.workEthic}%
        ${selectedModel.persona === 'BULBHUL' ? 'Use Hinglish mixed with professional sales energy.' : 'Maintain a cold, efficient, server-side terminal persona.'}
      `;

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `${systemContext}\n\nUser Query: ${input}`, 
          history,
          persona: selectedModel.persona,
          userRole: aiConfig.userRole
        })
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      if (data.functionCalls && data.functionCalls.length > 0) {
        for (const call of data.functionCalls) {
          const { name, args } = call;
          if (name === 'createTask') {
            try {
              await addDoc(collection(db, 'tasks'), { 
                ...args, 
                createdAt: serverTimestamp(),
                createdBy: user?.personalFileId || 'AI_KERNEL'
              });
              toast.success(`Task "${args.title}" created via ${selectedModel.persona} Matrix.`);
              setSystemLogs(prev => [{ id: `sync-task-${Date.now()}-${Math.random()}`, message: `SYNC: Task '${args.title}' injected to Matrix`, type: "ai", timestamp: new Date() } as AIActivity, ...prev]);
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, 'tasks');
            }
          }
          if (name === 'sendNotification' && auth.currentUser) {
            await sendNotification(args);
          }
        }
      }

      const aiText = data.text || "Neural response synced.";
      const aiMessage: Message = { id: `ai-${Date.now()}`, role: 'model', parts: [{ text: aiText }] };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Neural Sync Error: Could not reach target node.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedModel) {
    return (
      <div className="space-y-8 h-full flex flex-col min-h-[600px]">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setSelectedModel(null); setMessages([]); }} className="text-slate-400 hover:text-white">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Matrix
          </Button>
          <div className="flex items-center gap-3">
             <div className={cn("p-2 rounded-lg", selectedModel.bgColor)}><selectedModel.icon className={cn("w-5 h-5", selectedModel.color)} /></div>
             <div><h2 className="text-xl font-bold text-white leading-none">{selectedModel.name}</h2><span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Active Session</span></div>
          </div>
        </div>
        <div className="flex-1 glass-panel border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl shadow-black/40">
          <div className="flex-1 p-8 overflow-y-auto space-y-6">
            <div className="flex gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", selectedModel.bgColor)}><selectedModel.icon className={cn("w-6 h-6", selectedModel.color)} /></div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-[80%]"><p className="text-sm text-slate-300">{selectedModel.id === 'laila' ? "Welcome back, Boss. All nodes nominal." : "Namaste! Aaj ka target kya hai?"}</p></div>
            </div>
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-white/10" : selectedModel.bgColor)}>{msg.role === 'user' ? <Bot className="w-6 h-6 text-slate-400" /> : <selectedModel.icon className={cn("w-6 h-6", selectedModel.color)} />}</div>
                <div className={cn("p-4 rounded-2xl max-w-[80%] border", msg.role === 'user' ? "bg-slate-800 border-white/10 rounded-tr-none text-white" : "bg-white/5 border-white/10 rounded-tl-none text-slate-300")}><p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p></div>
              </div>
            ))}
            {isLoading && (<div className="flex gap-4 fill-current"><Loader2 className="w-4 h-4 animate-spin text-slate-500" /></div>)}
            <div ref={chatEndRef} />
          </div>
          <div className="p-6 border-t border-white/10 bg-white/[0.02]"><form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-4"><input className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 outline-none text-white" placeholder="Ask AI..." value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading}/><Button type="submit" disabled={isLoading || !input.trim()} className="rounded-2xl px-8 bg-blue-600"><Send className="w-5 h-5"/></Button></form></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight italic">Divyanshi AI Matrix</h1>
          <p className="text-slate-400">Core intelligence processors: LAILA & BULBHUL</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setShowConfig(!showConfig)}
            className="rounded-xl border-white/10 bg-white/5 text-slate-400 hover:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Neural Config
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Neural Sync Active</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-slate-900 border-white/10 shadow-2xl overflow-hidden mb-8">
              <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black italic tracking-tight text-white uppercase">Neural Calibration Console</CardTitle>
                    <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fine-tune brand voice and automation protocols</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {/* Model & Voice Selection */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Core Calibration</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                             <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-400" /> Neural Loyalty</span>
                             <span className="text-blue-400">{aiConfig.loyaltyLevel}%</span>
                          </div>
                          <input 
                            type="range" min="50" max="100" 
                            className="w-full h-1.5 bg-blue-500/10 rounded-full appearance-none accent-blue-500 cursor-pointer"
                            value={aiConfig.loyaltyLevel}
                            onChange={(e) => updateConfig({ ...aiConfig, loyaltyLevel: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                             <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-orange-500" /> Work Ethic Protocol</span>
                             <span className="text-orange-500">{aiConfig.workEthic}%</span>
                          </div>
                          <input 
                             type="range" min="50" max="100" 
                             className="w-full h-1.5 bg-orange-500/10 rounded-full appearance-none accent-orange-500 cursor-pointer"
                             value={aiConfig.workEthic}
                             onChange={(e) => updateConfig({ ...aiConfig, workEthic: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                             <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-500" /> Neural Creativity</span>
                             <span className="text-purple-500">{aiConfig.creativityLevel}%</span>
                          </div>
                          <input 
                             type="range" min="0" max="100" 
                             className="w-full h-1.5 bg-purple-500/10 rounded-full appearance-none accent-purple-500 cursor-pointer"
                             value={aiConfig.creativityLevel}
                             onChange={(e) => updateConfig({ ...aiConfig, creativityLevel: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">User Alias (How AI addresses you)</h4>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-indigo-500/50 outline-none transition-all"
                        placeholder="e.g. Master, Maalik, Boss..."
                        value={aiConfig.userAlias}
                        onChange={(e) => updateConfig({ ...aiConfig, userAlias: e.target.value })}
                      />
                    </div>

                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Sovereign Core Selection</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {aiModels.map((m) => (
                        <button
                          key={`model-btn-${m.id}`}
                          onClick={() => updateConfig({ ...aiConfig, primaryModel: m.persona as any })}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                            aiConfig.primaryModel === m.persona 
                              ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                              : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                          )}
                        >
                          <m.icon className="w-5 h-5" />
                          <span className="text-xs font-black italic uppercase">{m.persona} Core</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Response Style</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Concise', 'Detailed', 'Technical', 'Creative'].map(style => (
                          <button
                            key={style}
                            onClick={() => updateConfig({ ...aiConfig, responseStyle: style as any })}
                            className={cn(
                              "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                              aiConfig.responseStyle === style 
                                ? "bg-white/10 border-white/20 text-white" 
                                : "bg-transparent border-white/5 text-slate-500 hover:text-slate-300"
                            )}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Brand Tone</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Professional', 'Enthusiastic', 'Aggressive', 'Empathetic'].map(tone => (
                          <button
                            key={tone}
                            onClick={() => updateConfig({ ...aiConfig, brandTone: tone as any })}
                            className={cn(
                              "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                              aiConfig.brandTone === tone 
                                ? "bg-white/10 border-white/20 text-white" 
                                : "bg-transparent border-white/5 text-slate-500 hover:text-slate-300"
                            )}
                          >
                            {tone}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Personality Traits</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiConfig.personalityTraits.map((trait, idx) => (
                          <Badge 
                            key={`${trait}-${idx}`} 
                            className="bg-indigo-500/10 text-indigo-400 border-none px-3 py-1 flex items-center gap-2 group"
                          >
                            {trait}
                            <button 
                              onClick={() => updateConfig({ ...aiConfig, personalityTraits: aiConfig.personalityTraits.filter(t => t !== trait) })}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Plus className="w-3 h-3 rotate-45" />
                            </button>
                          </Badge>
                        ))}
                        <div className="flex items-center bg-white/5 rounded-lg border border-white/10 px-2 h-7">
                          <input 
                            placeholder="Add Trait..." 
                            className="bg-transparent border-none text-[10px] outline-none text-white w-20"
                            value={newTrait}
                            onChange={(e) => setNewTrait(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newTrait.trim()) {
                                const trimmed = newTrait.trim();
                                if (!aiConfig.personalityTraits.includes(trimmed)) {
                                  updateConfig({ ...aiConfig, personalityTraits: [...aiConfig.personalityTraits, trimmed] });
                                }
                                setNewTrait('');
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Instructions */}
                  <div className="space-y-4 lg:col-span-1">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Operational Protocols</h4>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 h-[200px]">
                      <textarea 
                        className="w-full h-full bg-transparent border-none outline-none text-xs text-slate-300 font-mono resize-none leading-relaxed"
                        placeholder="Define core AI instructions here..."
                        value={aiConfig.coreInstructions}
                        onChange={(e) => updateConfig({ ...aiConfig, coreInstructions: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Automation Matrix */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Automation Nodes</h4>
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {[
                        { key: 'autoCalling', label: 'Autonomous Outreach', icon: PhoneIncoming },
                        { key: 'smartReplies', label: 'Neural Smart Replies', icon: MessageSquare },
                        { key: 'autonomousOutreach', label: 'Cold Lead Extraction', icon: LucideActivity },
                        { key: 'sentimentAnalysis', label: 'Real-time Sentiment', icon: HeartPulse },
                        { key: 'registrySync', label: 'Matrix Auto-Sync', icon: RefreshCw },
                        { key: 'smartFollowups', label: 'AI Follow-up Studio', icon: Clock },
                      ].map((node) => (
                        <div 
                          key={node.key}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/[0.08] transition-all"
                          onClick={() => updateConfig({
                            ...aiConfig,
                            automation: { 
                              ...aiConfig.automation, 
                              [node.key as any]: !(aiConfig.automation as any)[node.key] 
                            }
                          })}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              (aiConfig.automation as any)[node.key] ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-500"
                            )}>
                              <node.icon className="w-3.5 h-3.5" />
                            </div>
                            <span className={cn(
                              "text-[11px] font-bold uppercase tracking-tight",
                              (aiConfig.automation as any)[node.key] ? "text-white" : "text-slate-500"
                            )}>{node.label}</span>
                          </div>
                          <div className={cn(
                            "w-8 h-4 rounded-full relative transition-colors duration-300",
                            (aiConfig.automation as any)[node.key] ? "bg-indigo-600" : "bg-slate-700"
                          )}>
                            <motion.div 
                              animate={{ x: (aiConfig.automation as any)[node.key] ? 16 : 2 }}
                              className="absolute top-1 left-0 w-2 h-2 rounded-full bg-white shadow-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time System Matrix Terminal */}
        <Card className="lg:col-span-2 bg-black/40 border-white/10 shadow-inner rounded-[2rem] overflow-hidden">
          <div className="bg-white/[0.03] px-6 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-[0.3em]">System Neural Log_v4.0</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="xs" 
                onClick={() => sendNotification({ 
                  title: 'Maintenance Alert', 
                  message: 'The P1 Master database will undergo scheduled maintenance tonight at 02:00 AM IST.', 
                  type: 'system' 
                })}
                className="h-6 text-[8px] uppercase font-black bg-orange-500/10 border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white"
              >
                Dispatch Maintenance Alert
              </Button>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
              </div>
            </div>
          </div>
          <CardContent className="p-6 h-[200px] overflow-hidden font-mono text-[10px] flex flex-col-reverse gap-2">
            {[...systemLogs].map((log, idx) => (
              <div key={log.id || `sys-log-${idx}`} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="text-slate-600">[{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : new Date().toLocaleTimeString()}]</span>
                <span className={cn(
                  "font-bold",
                  log.type === 'ai' ? "text-purple-400" :
                  log.type === 'intelligence' ? "text-blue-400" :
                  log.type === 'campaign' ? "text-emerald-400" : "text-slate-400"
                )}>{log.message}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {aiModels.map((model) => (
          <Card key={`ai-model-card-${model.id}`} className="bg-white/5 border-white/10 overflow-hidden relative group hover:border-white/20 transition-all duration-500">
            <CardHeader className="relative pb-2">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", 
                model.id === 'laila' ? 'bg-blue-600' : 'bg-orange-500')}><model.icon className="w-8 h-8 text-white" /></div>
              <CardTitle className="text-2xl font-black italic text-white uppercase">{model.name}</CardTitle>
              <CardDescription className="text-slate-400 text-[10px] uppercase font-black">{model.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6"><div className="grid grid-cols-2 gap-2">{model.capabilities.map((cap) => (<div key={cap} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-[10px] text-slate-400"><Zap className={cn("w-3 h-3", model.color)} />{cap}</div>))}</div><Button onClick={() => setSelectedModel(model)} className={cn("w-full h-12 rounded-2xl font-black uppercase tracking-widest", model.id === 'laila' ? "bg-blue-600 shadow-blue-600/20" : model.id === 'sari' ? "bg-pink-600 shadow-pink-600/20" : "bg-orange-500 shadow-orange-500/20")}>Initialize Core</Button></CardContent>
          </Card>
        ))}

        {/* Global Marketplace / Add-ons */}
        <div className="lg:col-span-2 mt-8">
           <div className="flex items-center justify-between mb-8">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h4 className="flex-shrink-0 px-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] italic text-center">Neural Marketplace / World Integrations</h4>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'WhatsApp Bot', provider: 'Meta Cloud', icon: MessageSquare, color: 'text-emerald-500', status: 'Online' },
                { name: 'Slack Matrix', provider: 'Enterprise', icon: Cpu, color: 'text-indigo-400', status: 'Active' },
                { name: 'Tally Prime', provider: 'Accounts', icon: RefreshCw, color: 'text-orange-400', status: 'Setup' },
                { name: 'Sovereign Mail', provider: 'Rich-UI', icon: Send, color: 'text-sky-400', status: 'Optimal' },
                { name: 'Bulk SMS', provider: 'Utility', icon: Zap, color: 'text-yellow-400', status: 'Ready' },
                { name: 'Digi-Locker', provider: 'Govt Node', icon: Shield, color: 'text-blue-500', status: 'Secure' },
              ].map((addon) => (
                <div key={addon.name} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/20 transition-all group flex flex-col items-center text-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   </div>
                   <div className={cn("p-4 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 transition-transform", addon.color)}>
                     <addon.icon className="w-6 h-6" />
                   </div>
                   <h5 className="text-[11px] font-black text-white uppercase tracking-tight">{addon.name}</h5>
                   <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{addon.provider}</p>
                   <Badge className="mt-4 bg-white/5 text-[7px] text-slate-400 border-none font-black uppercase group-hover:bg-orange-500 group-hover:text-white transition-all cursor-pointer">
                     {addon.status}
                   </Badge>
                </div>
              ))}
           </div>
           <div className="mt-8 text-center">
              <Button variant="link" className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] italic hover:no-underline hover:text-white transition-all">
                Request Custom Integration Node +
              </Button>
           </div>
        </div>

        {/* AI Voice & Human Avatar Studio */}
        <Card className="bg-white/5 border-white/10 overflow-hidden relative group hover:border-white/20 transition-all duration-500 lg:col-span-2 shadow-2xl">
          <CardHeader className="relative border-b border-white/5 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-pink-600 text-white font-black px-3">Elite Node</Badge>
                  <Badge variant="outline" className="border-pink-500/20 text-pink-500 text-[10px] uppercase font-black tracking-widest">ElevenLabs X Divyanshi AI</Badge>
                </div>
                <CardTitle className="text-3xl font-black italic tracking-tighter text-white uppercase">AI Voice Studio</CardTitle>
                <CardDescription className="text-slate-400 font-medium">Clone your voice or select premium personas for auto-calling & team automation.</CardDescription>
              </div>
              <div className="p-4 rounded-2xl bg-pink-500/10 text-pink-500 shadow-2xl shadow-pink-500/20"><Mic className="w-8 h-8" /></div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">Core Cloning</h4>
                <div className="p-6 rounded-2xl bg-black/20 border border-dashed border-white/10 hover:border-pink-500/40 transition-all cursor-pointer text-center group/clone">
                  <Volume2 className="w-10 h-10 text-pink-500 mx-auto mb-3 group-hover/clone:scale-110" />
                  <p className="text-sm font-bold">Clone My Voice</p>
                  <p className="text-[10px] text-slate-500 mt-1">Upload 60s sample</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"><div className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-emerald-500" /><span className="text-xs font-bold">Boss Voice v2</span></div><Badge className="bg-emerald-500/10 text-emerald-500 text-[8px]">Active</Badge></div>
              </div>
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">Premium Sales Personas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Karan (Sales Pro)', accent: 'Professional Hindi/English' },
                    { name: 'Meera (Executive)', accent: 'Clear Corporate' },
                    { name: 'Rahul (Urgent)', accent: 'Energy/High Intent' },
                    { name: 'Anjali (Support)', accent: 'Soft/Helpful' },
                  ].map(voice => (
                    <div key={voice.name} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500"><Play className="w-3 h-3 fill-current" /></div><div><p className="text-xs font-bold">{voice.name}</p><p className="text-[9px] text-slate-500">{voice.accent}</p></div></div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-pink-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500"><Music className="w-5 h-5" /></div><div><h5 className="text-sm font-bold text-white italic">Auto-Call Automation Node</h5><p className="text-[11px] text-slate-500">Sync selected voice with the dialer node.</p></div></div>
               <Button className="bg-pink-600 hover:bg-pink-500 text-white font-black uppercase tracking-widest h-12 px-8 rounded-xl shadow-xl shadow-pink-600/20">Sync Voice Core</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-white/5 border-white/10 shadow-2xl overflow-hidden group">
          <CardHeader className="border-b border-white/5 pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-xl font-black italic tracking-tight text-white uppercase">Neural Load Analysis</CardTitle><CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live throughput</CardDescription></div><BarChart3 className="w-5 h-5 text-orange-500" /></div></CardHeader>
          <CardContent className="p-6 flex items-center justify-around py-12">
             {[{ label: 'SaaS Pulse', value: 82, color: '#2563eb' }, { label: 'Lead Flow', value: 91, color: '#f97316' }, { label: 'Auto-Task', value: 78, color: '#8b5cf6' }].map((stat, i) => (
               <div key={`load-stat-${i}`} className="text-center group/stat"><div className="relative w-28 h-28 mb-4 border-4 border-white/5 rounded-full flex items-center justify-center"><p className="text-2xl font-black text-white italic">{stat.value}%</p></div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/stat:text-white transition-colors">{stat.label}</p></div>
             ))}
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2 uppercase tracking-tighter font-black"><Brain className="w-5 h-5 text-pink-500" /> Sentiment Logic</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10"><div className="flex items-center gap-2 mb-4"><PhoneIncoming className="w-4 h-4 text-indigo-400" /><span className="text-xs font-bold uppercase tracking-tight">Active Call Feed</span></div>
               <div className="space-y-3">{[{ label: 'Politeness', value: 94 }, { label: 'Intent', value: 78 }, { label: 'Energy', value: 88 }].map(s => (
                 <div key={s.label} className="space-y-1"><div className="flex justify-between text-[8px] font-black uppercase text-slate-500"><span>{s.label}</span><span>{s.value}%</span></div><div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${s.value}%` }} /></div></div>
               ))}</div>
             </div>
             <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10"><span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Revenue Forecast</span><div className="text-2xl font-black italic text-white">₹1.25 Cr</div><p className="text-[9px] text-slate-500 uppercase font-bold mt-1">Pending Tally Sync</p></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
