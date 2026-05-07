import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Info, AlertTriangle, CheckCircle2, Megaphone } from 'lucide-react';
import { gasService } from '@/services/gasService';

interface Notification {
  id: string;
  type: 'OFFER' | 'MIS' | 'HR' | 'SYSTEM';
  title: string;
  message: string;
}

export const NotificationPopup: React.FC = () => {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // Poll for notifications occasionally
    const checkNotifications = async () => {
      try {
        const response = await gasService.callBackend('GENIE_NOTIFY');
        if (response.ok && response.data) {
          setActiveNotification(response.data);
        }
      } catch (err) {
        console.error("Notification Poll Error", err);
      }
    };

    const interval = setInterval(checkNotifications, 300000); // Every 5 mins
    
    // Simulate initial popup for demo
    setTimeout(() => {
      setActiveNotification({
        id: '1',
        type: 'OFFER',
        title: 'Axis Bank Exclusive',
        message: 'Pre-approved Personal Loan offers up to ₹40L are now live for select profiles.'
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!activeNotification) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] w-full max-w-sm"
      >
        <div className="bg-slate-900 border border-orange-500/30 rounded-[2.5rem] p-8 shadow-[0_0_80px_rgba(249,115,22,0.2)] backdrop-blur-2xl overflow-hidden relative">
          {/* Animated Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-[60px]" />
          
          <button 
            onClick={() => setActiveNotification(null)}
            className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-900/30 mb-6 group">
              <Megaphone className="text-white group-hover:rotate-12 transition-transform" />
            </div>

            <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-2">{activeNotification.type} UPDATE</h3>
            <h4 className="text-xl font-bold text-white mb-4 tracking-tight leading-tight">{activeNotification.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              {activeNotification.message}
            </p>

            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setActiveNotification(null)}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-900/20"
              >
                Acknowledge
              </button>
              <button 
                onClick={() => setActiveNotification(null)}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Background Dim */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[190]"
      />
    </AnimatePresence>
  );
};
