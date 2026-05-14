import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { useSovereignStore } from '@/lib/useSovereignStore';

// SOVEREIGN COMPONENTS
import SovereignHero from './components/SovereignHero';
import Pricing from './components/Pricing';
import HoloDashboard from './components/HoloDashboard';
import Layout from './components/layout/Layout';

// Pages
import { AICenter } from './components/sections/AICenter';
import { EnquiryForm } from './components/sections/EnquiryForm';
import { LoanOS } from './components/sections/LoanOS';
import { MISReport } from './components/sections/MISReport';
import { UserSettings } from './components/sections/UserSettings';
import { WhatsAppTools } from './components/sections/WhatsAppTools';
import { IdentityManager } from './components/sections/IdentityManager';
import { MailInbox } from './components/sections/MailInbox';
import { TelegramAutomation } from './components/sections/TelegramAutomation';
import { SocialMedia } from './components/sections/SocialMedia';
import { WhatsAppCampaigns } from './components/sections/WhatsAppCampaigns';
import { Workspace } from './components/sections/Workspace';
import { GoogleHub } from './components/sections/GoogleHub';
import { GenieDashboard } from './components/sections/GenieDashboard';

import { MallikShowcase } from './components/sections/MallikShowcase';

const ScrollToProject = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppRoutes() {
  const { user, setUser, addTelemetry } = useSovereignStore();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const layer = query.get('layer') || (location.pathname.startsWith('/p1') ? 'p1' : (location.pathname.startsWith('/v2') ? 'v2' : 'v3'));

  const handleLogin = () => {
    const mockUser: any = {
      id: "MALLIK_ROOT_01",
      name: "Upendra Raghav",
      email: "upendra.raghav@divyanshicapital.com",
      role: "Managing Director",
      empCode: "DC-001",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Upendra"
    };
    setUser(mockUser);
    localStorage.setItem('dc_sovereign_user', JSON.stringify(mockUser));
    toast.success("Sovereign Link Established. Welcome, Master.");
    addTelemetry("Identity Matrix Sync Success: Node DC-001 connected.");
  };

  // Session Recovery
  useEffect(() => {
    const saved = localStorage.getItem('dc_sovereign_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        addTelemetry("Neural Link Recovered. Identity Verified.");
      } catch (e) {
        localStorage.removeItem('dc_sovereign_user');
      }
    }
  }, [setUser, addTelemetry]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* V3 SaaS Layer - Default Landing */}
        <Route path="/" element={<SovereignHero />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Mallik System Marketing Page */}
        <Route path="/mallik" element={<MallikShowcase />} />

        {/* V2 Layer - LAILA Controller */}
        <Route path="/v2" element={
          user ? (
            <Layout>
              <AICenter user={user} />
            </Layout>
          ) : <Navigate to="/login?layer=v2" />
        } />

        {/* P1 Layer - Loan Automation Execution */}
        <Route path="/p1" element={
          user ? (
            <Layout>
              <HoloDashboard />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />
        
        <Route path="/p1/enquiry" element={
          user ? (
            <Layout title="Enquiry Matrix">
              <EnquiryForm />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/p1/loanos" element={
          user ? (
            <Layout title="Neural Loan OS">
              <LoanOS user={user} />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/p1/mis" element={
          user ? (
            <Layout title="Master MIS Hub">
              <MISReport />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/p1/whatsapp" element={
          user ? (
            <Layout title="WA Intelligence">
              <WhatsAppTools />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/p1/users" element={
          user ? (
            <Layout title="Identity Registry">
              <IdentityManager />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/p1/mail" element={
          user ? (
            <Layout title="Sovereign Mail Hub">
              <MailInbox />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/p1/telegram" element={
          user ? (
            <Layout title="Telegram Automation">
              <TelegramAutomation />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/p1/social" element={
          user ? (
            <Layout title="Social Intelligence">
              <SocialMedia />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/p1/whatsapp-campaigns" element={
          user ? (
            <Layout title="WA Mass Campaigns">
              <WhatsAppCampaigns />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/p1/workspace" element={
          user ? (
            <Layout title="Neural Workspace">
              <Workspace user={user} />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/p1/google" element={
          user ? (
            <Layout title="Google Sovereign Hub">
              <GoogleHub />
            </Layout>
          ) : <Navigate to="/login?layer=p1" />
        } />

        <Route path="/genie" element={
          user ? (
            <Layout title="Genie CRM Console">
              <GenieDashboard user={user} />
            </Layout>
          ) : <Navigate to="/login" />
        } />

        {/* Common Auth & Settings */}
        <Route path="/login" element={
          user ? <Navigate to={layer === 'v3' ? "/" : (layer === 'v2' ? "/v2" : "/p1")} /> : (
            <div className="min-h-screen bg-[#06112C] flex items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="w-full max-w-md p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl text-center space-y-8"
               >
                  <div className="w-20 h-20 bg-cyan-500 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]">
                     <Shield className="text-[#06112C] w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Identity Verify</h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Accessing Sovereign Layer {layer.toUpperCase()}</p>
                  </div>
                  <button 
                    onClick={handleLogin}
                    className="w-full h-16 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-105 transition-all text-xs"
                  >
                    Establish Link
                  </button>
               </motion.div>
            </div>
          )
        } />

        <Route path="/settings" element={
          user ? (
            <Layout title="System Config">
              <UserSettings user={user} />
            </Layout>
          ) : <Navigate to="/login" />
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

import { Shield } from 'lucide-react';

export default function App() {
  return (
    <>
      <ScrollToProject />
      <AppRoutes />
      <Toaster position="top-right" richColors theme="dark" />
    </>
  );
}
