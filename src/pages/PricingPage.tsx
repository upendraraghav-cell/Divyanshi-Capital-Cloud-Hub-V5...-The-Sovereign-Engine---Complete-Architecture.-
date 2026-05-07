/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Shield, Crown, Sparkles, MessageSquare, Target, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const pricingPlans = [
  {
    id: 'starter',
    name: 'STARTER',
    price: 500,
    tagline: 'Start your AI workspace',
    features: [
      '1 User Node',
      '5 Strategic Dashboards',
      '1 Project Workspace',
      'Basic CRM (Leads + Follow-ups)',
      'Google Sheets Real-time Sync',
      'BULBUL Chat Bot (Client-facing)',
      'Email Notification Layer',
      '500 AI Commands/month',
      'Branded Company Subdomain'
    ],
    icon: Zap,
    color: 'from-blue-500 to-indigo-600',
    btnText: 'Start Free Trial'
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 1500,
    tagline: 'Scale your business with AI',
    popular: true,
    features: [
      'Up to 10 User Nodes',
      'Unlimited Dashboards',
      '3 Project Workspaces',
      'Full CRM + HR + Sales Modules',
      'WhatsApp API Integration',
      'SARI AI Strategic Bot',
      'BULBUL + GENIE Agent Suite',
      'TAT Engine (SLA Monitoring)',
      'RBAC Role Management',
      '5,000 AI Commands/month',
      'Custom BULBUL Avatar'
    ],
    icon: Shield,
    color: 'from-orange-500 to-rose-600',
    btnText: 'Start Pro Trial'
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    price: 3500,
    tagline: 'Your sovereign AI operating system',
    features: [
      'Unlimited User Nodes',
      'Unlimited Workspaces',
      'V3 Sovereign Engine Access',
      'V2 Controller & Repair Layer',
      'Full 4-Agent Suite (SARI+LAILA+GENIE+BULBUL)',
      'Full Brand White-labeling',
      'Tenant Isolation Security',
      'Auto-Escalation Engine',
      'LAILA Self-Healing Control',
      'Custom API + Webhooks',
      'Dedicated Strategy Manager'
    ],
    icon: Crown,
    color: 'from-purple-600 to-blue-600',
    btnText: 'Contact MD Office'
  }
];

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050508] text-white py-32 px-6 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-orange-500/10 blur-[100px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-white/5 text-orange-500 border border-orange-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
              MALLIK SYSTEM PRICING PROTOCOL
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
              Choose Your <br />
              <span className="text-orange-500">Neural</span> Payload.
            </h1>
            <p className="text-slate-400 text-xl font-medium italic max-w-2xl mx-auto mb-10">
              Deploy the world's first AI Business OS. Choose the capacity your empire needs.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={cn("text-xs font-black uppercase tracking-widest transition-colors", !isYearly ? "text-white" : "text-slate-500")}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="w-16 h-8 bg-slate-900 border border-white/10 rounded-full relative p-1 transition-all"
              >
                <motion.div 
                  animate={{ x: isYearly ? 32 : 0 }}
                  className="w-6 h-6 bg-orange-500 rounded-full"
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-black uppercase tracking-widest transition-colors", isYearly ? "text-white" : "text-slate-500")}>Yearly</span>
                <Badge className="bg-emerald-500/20 text-emerald-500 border-none text-[8px] font-black uppercase px-2 py-0.5">2 Months Free</Badge>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={cn(
                "p-10 rounded-[48px] border bg-slate-900/50 backdrop-blur-3xl flex flex-col transition-all relative overflow-hidden group",
                plan.popular ? "border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.1)]" : "border-white/5"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-widest py-1 px-10 rotate-45 translate-x-[35px] translate-y-[20px]">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-10 relative z-10">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center p-3 mb-8 bg-gradient-to-br shadow-xl", plan.color)}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">{plan.name}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">{plan.tagline}</p>
                
                <div className="flex items-baseline gap-2 mt-8">
                  <span className="text-6xl font-black text-white italic">
                    ₹{isYearly ? (plan.price * 10).toLocaleString() : plan.price.toLocaleString()}
                  </span>
                  <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">
                    {isYearly ? '/ YEAR' : '/ MONTH'}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-12 relative z-10">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="text-sm font-bold text-slate-300 italic">{feat}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => navigate('/signup', { state: { plan: plan.id } })}
                className={cn(
                  "h-16 w-full rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all active:scale-95",
                  plan.popular 
                    ? "bg-orange-600 hover:bg-orange-500 text-white" 
                    : "bg-white text-black hover:bg-slate-200"
                )}
              >
                {plan.btnText}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Decorative Gradient Overlay */}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity", plan.color)} />
            </motion.div>
          ))}
        </div>

        {/* Comparison CTA */}
        <div className="mt-40 text-center">
           <div className="inline-flex items-center gap-6 p-2 pr-6 bg-slate-900/50 border border-white/5 rounded-full backdrop-blur-xl">
             <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
             </div>
             <p className="text-xs font-black uppercase tracking-widest text-slate-300 italic">
               Need a custom sovereign architecture? <span className="text-orange-500 cursor-pointer">Inquire Private Access</span>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
