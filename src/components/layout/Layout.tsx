/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar } from '../crm/Sidebar';
import { Header } from './Header';
import { useSovereignStore } from '@/lib/useSovereignStore';
import { GenieAssistant } from '../crm/GenieAssistant';
import { NotificationPopup } from '../crm/NotificationPopup';
import { GenieOrb } from '../ai/GenieOrb';
import { motion } from 'motion/react';
import { MessageSquare, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, setUser, addTelemetry } = useSovereignStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dc_sovereign_user');
    toast.success("Identity Detached: Safe termination confirmed.");
    addTelemetry("Matrix Session Closed. Identity Disconnected.");
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#06112C] text-slate-50 selection:bg-cyan-500/30 selection:text-cyan-400">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab="dashboard" // This is now handled by URL, but keeping for compatibility
        setActiveTab={() => {}}
        user={user as any} 
        onLogout={handleLogout}
      />
      
      {/* Main Execution Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-64 relative">
        {/* Top Header */}
        <Header user={user as any} setActiveTab={() => {}} title={title || "SOVEREIGN_OS"} />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="max-w-full mx-auto min-h-full">
            {children}
          </div>
        </main>

        {/* Global Ambient Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.03)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Floating System Elements */}
      <GenieAssistant />
      <NotificationPopup />
      <GenieOrb state="IDLE" message="Sovereign Neural Core Active" />
      
      {/* Terminate Session Trigger */}
      <div className="fixed bottom-8 right-8 z-[100]">
         <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 shadow-2xl flex items-center justify-center backdrop-blur-xl hover:bg-red-500 hover:text-white transition-all group"
            title="Terminate Matrix Session"
          >
            <LogOut size={18} />
         </motion.button>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none z-0" />
    </div>
  );
}
