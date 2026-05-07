/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from '../crm/Sidebar';
import { Header } from './Header';
import { Dashboard } from '../crm/Dashboard';
import { SmartForm } from '../crm/SmartForm';
import { Inbox } from '../crm/Inbox';
import { BusinessCards } from '../crm/BusinessCards';
import { WhatsAppActions } from '../crm/WhatsAppActions';
import { SecurityPanel } from '../crm/SecurityPanel';
import { TeamPanel } from '../crm/TeamPanel';
import { LoanOS } from '../sections/LoanOS';
import { UserSettings } from '../sections/UserSettings';
import { V3Dashboard } from '../admin/V3Dashboard';
import { V2Dashboard } from '../admin/V2Dashboard';
import { SariIntelligence } from '../sections/SariIntelligence';
import { WhatsAppCampaigns } from '../sections/WhatsAppCampaigns';
import { VoiceDesk } from '../sections/VoiceDesk';
import { AvatarControl } from '../sections/AvatarControl';
import { Integrations } from '../sections/Integrations';
import { AutonomousCore } from '../sections/AutonomousCore';
import { GenieAssistant } from '../crm/GenieAssistant';
import { NotificationPopup } from '../crm/NotificationPopup';
import { GenieOrb } from '../ai/GenieOrb';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { FirebaseUser, auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

interface LayoutProps {
  user: FirebaseUser | null;
}

export function Layout({ user }: LayoutProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload(); // Hard refresh to clear all buffers
      toast.success("Identity Detached: Safe termination confirmed.");
    } catch (error) {
      toast.error("Process error during termination.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'smart-form': return <SmartForm user={user} />;
      case 'loanos': return <LoanOS user={user} />;
      case 'inbox': return <Inbox />;
      case 'cards': return <BusinessCards />;
      case 'whatsapp': return <WhatsAppActions />;
      case 'security': return <SecurityPanel />;
      case 'team': return <TeamPanel />;
      case 'autonomous': return <AutonomousCore user={user} />;
      case 'v3-engine': return <V3Dashboard />;
      case 'v2-controller': return <V2Dashboard />;
      case 'sari-intelligence': return <SariIntelligence />;
      case 'whatsapp-campaigns': return <WhatsAppCampaigns />;
      case 'voice-desk': return <VoiceDesk />;
      case 'avatar-control': return <AvatarControl />;
      case 'integrations': return <Integrations />;
      case 'settings': return <UserSettings user={user} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50 selection:bg-orange-500/30 selection:text-orange-500">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
      />
      
      {/* Main Execution Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-64">
        <Header user={user} setActiveTab={setActiveTab} title={activeTab} />
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Floating System Elements */}
      <GenieAssistant />
      <NotificationPopup />
      <GenieOrb state="IDLE" message="System Sovereign V3 Layer Active" />
      
      {/* BULBUL Chat Trigger */}
      <div className="fixed bottom-28 right-8 z-[90]">
         <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('whatsapp')}
            className="w-14 h-14 rounded-2xl bg-orange-600 text-white shadow-2xl flex items-center justify-center border border-white/20 pointer-events-auto"
         >
            <MessageSquare className="w-6 h-6" />
         </motion.button>
      </div>

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.05)_0%,transparent_50%)] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}
