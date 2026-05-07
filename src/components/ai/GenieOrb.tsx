/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertCircle, CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type GenieState = 'IDLE' | 'LISTENING' | 'WORKING' | 'ERROR' | 'SUCCESS';

interface GenieOrbProps {
  state?: GenieState;
  className?: string;
  message?: string;
}

export function GenieOrb({ state = 'IDLE', className, message }: GenieOrbProps) {
  const config = {
    IDLE: {
      color: 'bg-blue-500',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
      icon: Zap,
      animation: { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }
    },
    LISTENING: {
      color: 'bg-emerald-500',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]',
      icon: Sparkles,
      animation: { scale: [1, 1.2, 1], borderRadius: ["50%", "40%", "50%"] }
    },
    WORKING: {
      color: 'bg-amber-500',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.6)]',
      icon: Loader2,
      animation: { rotate: 360 }
    },
    ERROR: {
      color: 'bg-red-500',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.7)]',
      icon: AlertCircle,
      animation: { x: [-2, 2, -2, 2, 0] }
    },
    SUCCESS: {
      color: 'bg-green-500',
      glow: 'shadow-[0_0_40px_rgba(34,197,94,0.8)]',
      icon: CheckCircle2,
      animation: { scale: [1, 1.3, 1] }
    }
  };

  const current = config[state];
  const Icon = current.icon;

  return (
    <div className={cn("fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3 pointer-events-none", className)}>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900/90 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-2xl text-[10px] font-black uppercase tracking-widest text-white italic"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={current.animation}
        transition={{ 
          duration: state === 'WORKING' ? 2 : (state === 'IDLE' ? 3 : 0.5), 
          repeat: state === 'WORKING' || state === 'IDLE' ? Infinity : 0,
          ease: "easeInOut"
        }}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-500 ring-4 ring-white/10",
          current.color,
          current.glow
        )}
      >
        <Icon className={cn("w-6 h-6 text-white", state === 'WORKING' && "animate-spin")} />
      </motion.div>
      <div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mr-2">GENIE AGENT</div>
    </div>
  );
}
