/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Bot, Loader2, X, Phone, MapPin, Search, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { db, auth, collection, doc, addDoc, query, orderBy, onSnapshot, serverTimestamp, handleFirestoreError, OperationType, limit } from '@/lib/firebase';
import { toast } from 'sonner';
import { AvatarDashboard } from './AvatarDashboard';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'superagi';
  timestamp: Date;
  metadata?: {
    type: 'caller' | 'map';
    data: any;
  };
  suggestions?: string[];
}

interface ChatConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  mood: any;
}

const BOT_PROFILES = {
  LAILA: {
    name: 'LAILA',
    subtitle: 'SaaS & Enterprise Advisor',
    icon: Sparkles,
    color: 'text-orange-500',
    bg: 'from-slate-900 to-slate-950',
    shadow: 'shadow-[0_0_40px_rgba(249,115,22,0.3)]',
    border: 'border-orange-500/50',
    greetings: [
      "Divyanshi Command Center active. LAILA online. How shall we optimize the equity nodes today, Boss?",
      "System scan complete. Your MRR is ₹45,600. 12 clients on trial. How can I help with your CRM?",
      "Welcome back, Boss. The data streams are flowing perfectly. Shall we audit the current operational bottlenecks?",
      "LAILA reporting. SaaS efficiency is at peak. Ready to drive another 30% growth injection?",
    ]
  },
  BULBHUL: {
    name: 'BULBHUL',
    subtitle: 'Loan & Eligibility Expert',
    icon: Bot,
    color: 'text-emerald-400',
    bg: 'from-slate-900 to-slate-950',
    shadow: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]',
    border: 'border-emerald-400/50',
    greetings: [
      "Namaste Sir! BULBHUL here. Ready to process your loan eligibility. How can I help you today?",
      "Hello Boss! I've audited the loan pipelines. All systems clear for lead distribution.",
      "Sweet greetings, Sir! Looking for a loan? I can check your eligibility 3x faster than anyone else!",
      "BULBHUL online. No false commitments, only fast delivery. Ready to collect docs?",
    ]
  }
};

const MessageItem = memo(({ msg, currentBot, profile, setInput }: { msg: Message, currentBot: string, profile: any, setInput: (v: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
        msg.sender === 'user' ? 'bg-secondary' : currentBot === 'LAILA' ? 'bg-amber-500' : 'bg-emerald-500'
      }`}>
        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <profile.icon className="w-4 h-4 text-white" />}
      </div>
      <div className={`p-3 rounded-2xl text-sm space-y-3 ${
        msg.sender === 'user' 
          ? `${currentBot === 'LAILA' ? 'bg-amber-600' : 'bg-emerald-600'} text-white rounded-tr-none shadow-lg shadow-black/20` 
          : 'bg-white/5 border border-white/10 rounded-tl-none pr-8'
      }`}>
        <div>{msg.text}</div>
        
        {msg.suggestions && msg.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {msg.suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="h-6 text-[10px] font-bold uppercase tracking-widest rounded-full border-white/10 hover:bg-white/10 hover:border-orange-500/50"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
        
        {msg.metadata?.type === 'caller' && (
          <div className="mt-3 p-0 rounded-2xl bg-black/60 border border-white/10 overflow-hidden shadow-2xl">
            <div className={`px-4 py-2 border-b border-white/5 flex items-center justify-between bg-gradient-to-r ${currentBot === 'LAILA' ? 'from-amber-500/20' : 'from-emerald-500/20'} to-transparent`}>
               <div className="flex items-center gap-2">
                  <Phone className={`w-3.5 h-3.5 ${currentBot === 'LAILA' ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/90">Identity Match Resolved</span>
               </div>
               <Badge className="bg-emerald-500/20 text-emerald-400 text-[8px] border-none font-black animate-pulse">ENHANCED</Badge>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl`}>
                  👤
                </div>
                <div>
                  <h4 className="text-sm font-black text-white italic tracking-tight">{msg.metadata.data.name || 'Unknown Subject'}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Neural ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Authenticity</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${msg.metadata.data.score || 85}%` }}
                        className={`h-full ${currentBot === 'LAILA' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      />
                    </div>
                    <span className={`text-[10px] font-black ${currentBot === 'LAILA' ? 'text-amber-400' : 'text-emerald-400'}`}>{msg.metadata.data.score || 85}%</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Risk Assessment</p>
                  <Badge variant="outline" className="h-4 text-[9px] border-emerald-500/50 text-emerald-400 bg-emerald-500/5">LOW_THREAT</Badge>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] border-b border-white/5 pb-1">
                  <span className="text-slate-500 font-bold uppercase">Carrier</span>
                  <span className="text-white font-mono">Neural-Jio Connect</span>
                </div>
                <div className="flex justify-between text-[9px]">
                   <span className="text-slate-500 font-bold uppercase">Geolocation</span>
                   <span className="text-white font-mono">28.6139° N, 77.2090° E</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {msg.metadata?.type === 'map' && (
          <div className="mt-3 p-0 rounded-2xl bg-black/60 border border-white/10 overflow-hidden shadow-2xl">
            <div className={`px-4 py-2 border-b border-white/5 flex items-center justify-between bg-gradient-to-r ${currentBot === 'LAILA' ? 'from-amber-500/20' : 'from-emerald-500/20'} to-transparent`}>
               <div className="flex items-center gap-2">
                  <MapPin className={`w-3.5 h-3.5 ${currentBot === 'LAILA' ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/90">Geo-Matrix Response</span>
               </div>
               <Badge className="bg-blue-500/20 text-blue-400 text-[8px] border-none font-black uppercase">Active Scan</Badge>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-white italic">Detected {msg.metadata.data.count || 3} proximity nodes</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 tracking-widest">Master Cloud Registry Synced</p>
                </div>
                <Search className="w-4 h-4 text-slate-500 animate-pulse" />
              </div>

              <div className="space-y-2">
                 {[1, 2, 3].map((_, i) => (
                    <div key={`geo-node-${i}`} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/5 group hover:bg-white/[0.08] transition-colors cursor-pointer">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-slate-500'} animate-pulse`} />
                          <div>
                             <p className="text-[10px] font-bold text-white">Node Segment #{Math.floor(Math.random() * 900) + 100}</p>
                             <p className="text-[8px] text-slate-500 font-bold uppercase">{Math.random().toFixed(1)}km range</p>
                          </div>
                       </div>
                       <Navigation className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                 ))}
              </div>

              <Button 
                variant="outline"
                className={`w-full h-9 border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest gap-2`}
              >
                <div className={`w-2 h-2 rounded-full ${currentBot === 'LAILA' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                Initialize Full Terminal View
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  </motion.div>
));

export function ChatConsole({ isOpen, onClose, mood }: ChatConsoleProps) {
  const [currentBot, setCurrentBot] = useState<'LAILA' | 'BULBHUL'>('LAILA');
  const [userRole, setUserRole] = useState<'BOSS' | 'CLIENT'>('BOSS');

  const profile = BOT_PROFILES[currentBot];
  const greeting = useMemo(() => profile.greetings[Math.floor(Math.random() * profile.greetings.length)], [isOpen, currentBot]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'avatar'>('chat');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [avatarSettings, setAvatarSettings] = useState<any>(null);

  // Load avatar settings
  useEffect(() => {
    if (!auth.currentUser) return;
    const settingsRef = doc(db, 'users', auth.currentUser.uid, 'avatar', 'settings');
    return onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) setAvatarSettings(doc.data());
    });
  }, []);

  // Load or create session
  useEffect(() => {
    if (!auth.currentUser || !isOpen) return;
    setSessionId(`session-${currentBot.toLowerCase()}`); 
  }, [isOpen, currentBot]);

  // Listen for messages
  useEffect(() => {
    if (!auth.currentUser || !sessionId || !isOpen) return;

    const messagesRef = collection(db, 'users', auth.currentUser.uid, 'sessions', sessionId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })).reverse() as Message[];
      
      if (msgs.length === 0) {
        setMessages([{
          id: 'greeting',
          text: greeting,
          sender: 'superagi',
          timestamp: new Date()
        }]);
      } else {
        setMessages(msgs);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${auth.currentUser?.uid}/sessions/${sessionId}/messages`);
    });

    return () => unsubscribe();
  }, [sessionId, isOpen, greeting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !auth.currentUser || !sessionId) {
      if (!auth.currentUser) toast.error("Please sign in to talk to the system!");
      return;
    }

    const userText = input;
    setInput('');
    setIsLoading(true);

    try {
      const messagesRef = collection(db, 'users', auth.currentUser.uid, 'sessions', sessionId, 'messages');
      
      // 1. Save user message to Firestore
      await addDoc(messagesRef, {
        text: userText,
        sender: 'user',
        timestamp: serverTimestamp()
      });

      // --- INTENT DETECTION (Caller ID, Matrix Map, MIS Report) ---
      const phoneMatch = userText.match(/\b\d{10}\b/);
      const isMapSearch = /bank|nbfc|map|rm|near/i.test(userText);
      const isMISReport = /report|attendance|mis|work|punch/i.test(userText);

      if (phoneMatch) {
         const res = await fetch('/api/intelligence/lookup', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ type: 'caller', query: phoneMatch[0], botId: currentBot })
         });
         const result = await res.json();
         if (result.ok) {
           await addDoc(messagesRef, {
             text: `${currentBot} Matrix Sync: I've scanned the neural grid for ${phoneMatch[0]}. Data profile extracted.`,
             sender: 'superagi',
             timestamp: serverTimestamp(),
             metadata: { type: 'caller', data: result.data }
           });
           setIsLoading(false);
           return;
         }
      } else if (isMapSearch) {
         const res = await fetch('/api/intelligence/lookup', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ type: 'map', query: userText, botId: currentBot })
         });
         const result = await res.json();
         if (result.ok) {
           await addDoc(messagesRef, {
             text: `${currentBot} Geo-Matrix Sync: Synchronized with Master Sheet. Found ${result.locations.length} active nodes in range.`,
             sender: 'superagi',
             timestamp: serverTimestamp(),
             metadata: { type: 'map', data: { count: result.locations.length } }
           });
           setIsLoading(false);
           return;
         }
      } else if (isMISReport) {
         await addDoc(messagesRef, {
           text: `Master, here is the Daily Work & Attendance summary extracted from the Apps Script Matrix. We have 94% staff saturation today. Would you like to view the full MIS dashboard?`,
           sender: 'superagi',
           timestamp: serverTimestamp()
         });
         setIsLoading(false);
         return;
      }
      // ------------------------------------------------

      // 2. Get AI response
      const history = messages.slice(-10).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText, 
          history,
          persona: currentBot,
          userRole
        })
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      const aiReply = data.text || "I'm processing that for you...";

      // 3. Handle Tool Calls (Notifications)
      if (data.functionCalls && data.functionCalls.length > 0) {
        for (const call of data.functionCalls) {
          if (call.name === 'sendNotification') {
            const { title, message, type } = call.args as any;
            const notificationsRef = collection(db, 'users', auth.currentUser.uid, 'notifications');
            await addDoc(notificationsRef, {
              title,
              message,
              type,
              timestamp: serverTimestamp(),
              read: false
            });
            toast.success(`${currentBot} sent a priority alert!`);
          }
        }
      }

      // 4. Save message to Firestore
      await addDoc(messagesRef, {
        text: aiReply,
        sender: currentBot.toLowerCase(),
        timestamp: serverTimestamp(),
        suggestions: data.suggestions
      });

    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Connection failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          className={`fixed bottom-28 right-8 w-[400px] h-[700px] glass-panel rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border-white/10`}
        >
          {/* Header */}
          <div className={`p-6 border-b border-white/5 bg-[#001F3F]/40 flex flex-col items-center text-center gap-4 relative overflow-hidden transition-all`}>
            {/* Soft Teal Data Streams Background - Optimized */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute h-px animate-data-stream",
                    currentBot === 'LAILA' ? 'bg-[#39CCCC]' : 'bg-emerald-400'
                  )}
                  style={{
                    width: (Math.random() * 50 + 50) + 'px',
                    left: (Math.random() * 100) + '%',
                    top: (Math.random() * 100) + '%',
                    animationDelay: (i * 1.5) + 's',
                    animationDuration: (Math.random() * 5 + 5) + 's'
                  }}
                />
              ))}
            </div>

            <div className="absolute top-4 left-4 flex gap-2 z-20">
              <Button 
                size="xs" 
                variant={currentBot === 'LAILA' ? 'secondary' : 'outline'}
                className="h-6 text-[9px] font-bold px-2"
                onClick={() => setCurrentBot('LAILA')}
              >
                LAILA
              </Button>
              <Button 
                size="xs" 
                variant={currentBot === 'BULBHUL' ? 'secondary' : 'outline'}
                className="h-6 text-[9px] font-bold px-2"
                onClick={() => setCurrentBot('BULBHUL')}
              >
                BULBHUL
              </Button>
            </div>

            <div className="absolute top-4 right-12 z-20">
              <Badge variant="outline" className="text-[8px] border-white/20 text-white/50 cursor-pointer hover:text-white" onClick={() => setUserRole(userRole === 'BOSS' ? 'CLIENT' : 'BOSS')}>
                {userRole} VIEW
              </Badge>
            </div>

            {/* Avatar Halo Effect */}
            <div className="relative z-10 mt-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`absolute -inset-4 border-2 border-dashed ${profile.border.replace('border-', 'border-').replace('/50', '/30')} rounded-full`}
              />
              
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${profile.bg} flex items-center justify-center ${profile.shadow} border-2 ${profile.border} relative overflow-hidden`}
              >
                <img 
                  src={currentBot === 'LAILA' ? "https://picsum.photos/seed/laila/200/200" : "https://picsum.photos/seed/bulbhul/200/200"} 
                  alt={currentBot} 
                  className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <profile.icon className={`absolute w-8 h-8 ${profile.color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
              </motion.div>
            </div>
            
            <div className="relative z-10">
              <h3 className="font-bold text-lg tracking-tight text-white">{profile.name} Autonomous System</h3>
              <p className={`text-[10px] ${profile.color} font-bold uppercase tracking-[0.3em] mt-1`}>{profile.subtitle}</p>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="absolute top-4 right-4 hover:bg-white/10 rounded-full text-white/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Admin/User Tabs */}
          <div className="flex p-2 bg-white/5 border-b border-white/10">
            <Button 
              variant={activeTab === 'chat' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="flex-1 rounded-lg h-9"
              onClick={() => setActiveTab('chat')}
            >
              Consult {currentBot}
            </Button>
            <Button 
              variant={activeTab === 'avatar' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="flex-1 rounded-lg h-9 relative"
              onClick={() => setActiveTab('avatar')}
            >
              Node Identity
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_5px_#fbbf24] animate-pulse" />
            </Button>
          </div>

          {activeTab === 'chat' ? (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <MessageItem key={msg.id} msg={msg} currentBot={currentBot} profile={profile} setInput={setInput} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 items-center bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground italic">{currentBot} is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Actions (Templates) */}
              <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02] flex gap-2 overflow-x-auto no-scrollbar">
                {['Dashboard summary', 'Pending tasks', 'Revenue report'].map(action => (
                  <Button 
                    key={action}
                    variant="ghost" 
                    size="xs" 
                    className="h-6 text-[9px] uppercase font-bold border border-white/10 rounded-full whitespace-nowrap px-3 hover:text-white hover:border-orange-500/50"
                    onClick={() => setInput(action)}
                  >
                    {action}
                  </Button>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/5 bg-white/5">
                <div className="relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={`Command ${currentBot}...`}
                    className="pr-12 bg-background/50 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg shadow-lg ${currentBot === 'LAILA' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <AvatarDashboard />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
