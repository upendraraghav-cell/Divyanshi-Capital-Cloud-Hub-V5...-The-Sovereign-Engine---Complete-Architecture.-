import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Key, Smartphone, Lock, RefreshCw, LogOut, Mail, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';

export const SecurityPanel: React.FC = () => {
  const [authMode, setAuthMode] = useState<'OTP' | 'PASSWORD'>('OTP');

  const handleModeToggle = () => {
    setAuthMode(authMode === 'OTP' ? 'PASSWORD' : 'OTP');
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-orange-500/10 rounded-full mb-4">
          <ShieldCheck size={48} className="text-orange-500" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter italic">Sovereign Vault</h2>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-2 px-12">Encryption Level: MIL-SPEC AES-256 NEURAL CORE</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-center p-1 bg-slate-950 rounded-2xl border border-slate-800 w-fit mx-auto mb-10">
          <button 
            onClick={() => setAuthMode('OTP')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${authMode === 'OTP' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            OTP Protocol
          </button>
          <button 
            onClick={() => setAuthMode('PASSWORD')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${authMode === 'PASSWORD' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Sovereign Key
          </button>
        </div>

        {authMode === 'OTP' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-600 ml-4">Authorized Mobile</label>
              <div className="relative group">
                <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  placeholder="+91-XXXXX-XXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                />
              </div>
            </div>
            
            <button className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-900/40 transition-all flex items-center justify-center gap-3">
              Generate Neural OTP
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-600 ml-4">Corporate Key (Password)</label>
              <div className="relative group">
                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>
            
            <button className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-900/40 transition-all">
              Initialize Secure Session
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
            <RefreshCw size={14} />
            Reset Encryption
          </button>
          <button className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-red-400 transition-colors">
            <LogOut size={14} />
            Kill Session
          </button>
        </div>

        {/* Decorative mask */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-600/5 rounded-full blur-[80px] pointer-events-none"></div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
          <Fingerprint className="text-orange-500 mb-3" size={24} />
          <h4 className="text-white font-bold text-sm mb-1">MFA Status</h4>
          <p className="text-slate-500 text-[10px] leading-relaxed">Multi-Factor Authentication is currently enforced for all high-value transactions.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
          <Lock className="text-orange-500 mb-3" size={24} />
          <h4 className="text-white font-bold text-sm mb-1">Audit Log</h4>
          <p className="text-slate-500 text-[10px] leading-relaxed">Your last secure login was from IP: 49.36.81.XXX on May 1st, 18:24 UTC.</p>
        </div>
      </div>
    </div>
  );
};
