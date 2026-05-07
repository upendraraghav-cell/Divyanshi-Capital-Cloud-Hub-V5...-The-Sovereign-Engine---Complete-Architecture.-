import React from 'react';
import { motion } from 'motion/react';
import { Search, Bell, Command, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold tracking-tight text-white capitalize">{title.replace('-', ' ')}</h2>
        <div className="h-4 w-px bg-slate-800 mx-2 hidden md:block"></div>
        <p className="text-xs text-slate-500 font-mono hidden md:block">GENIE_CORE_V4_ACTIVE</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden lg:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            className="bg-slate-900 border border-slate-800 rounded-full py-1.5 pl-10 pr-12 text-xs text-slate-300 w-64 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <Command size={10} className="text-slate-600" />
            <span className="text-[10px] text-slate-600 font-bold">K</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-full transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 border-2 border-slate-950 rounded-full"></span>
          </button>
          
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-full transition-all">
            <Moon size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
