import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  Sparkles, 
  X, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Building2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { getSuperAGIResponse } from '@/lib/gemini';
import { toast } from 'sonner';

interface Message {
  role: 'bulbhul' | 'user';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export function BulbhulAssistant({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bulbhul',
      content: `Namaste ${user?.name || 'Sir'}! I am Bulbhul, your Personal Banker AI for Divyanshi Capital. How can I assist with your loan cases today?`,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const prompt = `
        You are Bulbhul, the AI Personal Banker for Divyanshi Capital. 
        User Role: ${user?.role}. 
        User Brand: ${user?.brand}.
        Current Task: Banking Assistance & Loan Operations.
        
        Recent query: ${input}
        
        Provide a professional, banker-like response in a mix of Hindi and English (Hinglish) if appropriate. 
        Keep it focused on loan processing, document requirements, and business growth.
      `;

      const response = await getSuperAGIResponse(prompt);
      const bulbText = response.text || "I processed that request boss.";
      
      const bulbMsg: Message = {
        role: 'bulbhul',
        content: bulbText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, bulbMsg]);
    } catch (error) {
      toast.error("Bulbhul is experiencing a network glitch...");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] pointer-events-none">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl flex items-center justify-center border-4 border-white/10 group relative"
          >
            <Bot className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-2 bg-orange-500/20 blur-xl rounded-full" 
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="pointer-events-auto absolute bottom-0 right-0 w-[400px] h-[600px] bg-slate-950 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-[#1f3550] to-[#0a131d] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Bulbhul AI</h3>
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Banker Body Active
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
            >
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex flex-col max-w-[85%]",
                  m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                )}>
                  <div className={cn(
                    "p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm",
                    m.role === 'user' 
                      ? "bg-orange-500 text-white rounded-br-none" 
                      : "bg-white/5 border border-white/5 text-slate-200 rounded-bl-none"
                  )}>
                    {m.content}
                  </div>
                  <span className="text-[8px] text-slate-500 font-black uppercase mt-1 px-1">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 mr-auto">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5">
              {[
                { label: 'Loan Status', icon: Zap },
                { label: 'Bank Policy', icon: Building2 },
                { label: 'Docs Needed', icon: FileText }
              ].map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(s.label)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 uppercase whitespace-nowrap hover:bg-orange-500/10 hover:text-orange-500 transition-all border-l-2 border-l-orange-500"
                >
                  <s.icon className="w-3 h-3" /> {s.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/5">
              <div className="relative group">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Bulbhul for banking help..."
                  className="w-full h-14 bg-slate-900 border border-white/10 rounded-2xl px-6 pr-24 text-xs text-white placeholder:text-slate-600 outline-none focus:border-orange-500/50 transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="w-10 h-10 rounded-xl text-slate-500 hover:text-white transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleSend}
                    className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
