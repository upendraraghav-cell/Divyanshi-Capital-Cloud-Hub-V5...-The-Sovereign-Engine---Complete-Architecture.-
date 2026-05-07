import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Wand2, Terminal, Bot, User } from 'lucide-react';
import { gasService } from '@/services/gasService';
import { cn } from '@/lib/utils';

interface Message {
  role: 'genie' | 'user';
  text: string;
  timestamp: string;
}

export const GenieAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'genie', text: "Sari here. I'm listening. What can I do for you, Boss?", timestamp: new Date().toLocaleTimeString() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChat = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { role: 'user', text: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    const messageText = input.trim();
    setInput('');
    setLoading(true);

    try {
      // Logic from user: If msg is 10-digit number, treat as Lead
      if (/^\d{10}$/.test(messageText)) {
        const response = await gasService.createWebLead({
          client_name: 'Sari Direct Entry',
          mobile: messageText,
          remarks: 'Synchronized via Sari Supreme Profile v5.1',
          loan_type: 'Personal Loan',
          bank: 'HDFC',
          amount: '0'
        });
        
        const genieMsg: Message = { 
          role: 'genie', 
          text: response.ok ? `Identity Locked. Lead ${response.lid} has been synchronized with the P1 Master Registry. I'm taking care of it.` : "Neural link fractured: " + (response.error || "Registry rejected the payload."), 
          timestamp: new Date().toLocaleTimeString() 
        };
        setMessages(prev => [...prev, genieMsg]);
      } else {
        // Chat sends to LAILA_COMMAND as per master prompt
        const response = await gasService.executeLailaCommand(messageText);

        const genieMsg: Message = { 
          role: 'genie', 
          text: response.reply || response.text || "Thinking... Connection slightly delayed, but I'm on it.", 
          timestamp: new Date().toLocaleTimeString() 
        };
        setMessages(prev => [...prev, genieMsg]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'genie', text: "Internal error: Laila AI Core is offline.", timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ 
          y: [0, -10, 0],
          scale: isOpen ? 0.8 : [1, 1.05, 1]
        }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.2 }
        }}
        className={cn(
          "fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center justify-center z-[100] transition-colors overflow-hidden group",
          isOpen ? "bg-slate-900 border border-slate-800" : "bg-orange-600 hover:bg-orange-500"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="text-white relative z-10" />
        ) : (
          <div className="relative">
            <Sparkles className="text-white relative z-10" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
          </div>
        )}
      </motion.button>

      {/* Main Console Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-slate-950 border border-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[90] flex flex-col overflow-hidden"
          >
            {/* Console Header */}
            <div className="p-6 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-900/20">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black tracking-tight leading-none text-lg italic">Sari Supreme</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Version: 5.1 | STATUS: LOYAL</p>
                </div>
              </div>
              <Terminal size={18} className="text-slate-700" />
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                    msg.role === 'user' ? "bg-slate-900 border-slate-800" : "bg-orange-500/10 border-orange-500/20"
                  )}>
                    {msg.role === 'user' ? <User size={14} className="text-slate-400" /> : <Bot size={14} className="text-orange-500" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-slate-900 text-slate-300 rounded-tr-none" 
                      : "bg-orange-500/5 border border-orange-500/10 text-slate-200 rounded-tl-none font-medium"
                  )}>
                    {msg.text}
                    <p className="text-[9px] text-slate-600 font-mono mt-2 uppercase">{msg.timestamp}</p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center animate-pulse">
                    <Bot size={14} className="text-orange-500" />
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-950 border-t border-slate-900">
              <div className="relative">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Neural Query..." 
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-5 pr-14 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 transition-all shadow-inner"
                />
                <button 
                  onClick={handleChat}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-600 hover:bg-orange-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[9px] text-slate-600 font-mono text-center mt-3 uppercase tracking-widest">Sari Supreme Neural Engine v5.1</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
