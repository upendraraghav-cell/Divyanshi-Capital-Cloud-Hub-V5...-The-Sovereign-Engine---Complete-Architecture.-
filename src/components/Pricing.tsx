import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Rocket, Shield, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const TIERS = [
  {
    name: 'Starter',
    price: '₹500',
    frequency: '/mo',
    description: 'Personal AI node for independent advisors.',
    features: [
      '1 Bulbhul Assistant',
      'Personal P1 Registry',
      'WhatsApp Integration',
      'Basic Insights',
      'Manual Sync'
    ],
    icon: Zap,
    color: 'slate',
    button: 'Begin Voyage'
  },
  {
    name: 'Pro',
    price: '₹750',
    frequency: '/mo',
    description: 'The preferred choice for growing enterprises.',
    features: [
      'Everything in Starter',
      'Holographic Dashboard',
      'Email Alerts',
      '24/7 Monitoring',
      'Laila Auto-Fix (Basic)',
      '1 Team User'
    ],
    icon: Rocket,
    color: 'cyan',
    button: 'Ascend to Pro',
    popular: true
  },
  {
    name: 'Team',
    price: '₹1000',
    frequency: '/mo',
    description: 'Full neural connectivity for your squad.',
    features: [
      'Everything in Pro',
      '5 Team Users',
      'Telegram Orchestrator',
      'WhatsApp Campaigns',
      'Full API Access',
      'Shared Matrix'
    ],
    icon: Shield,
    color: 'gold',
    button: 'Command Team'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    frequency: '',
    description: 'Infinite scalability. Custom neural clusters.',
    features: [
      'White-label Sovereign Hub',
      'V3 Multi-tenant Core',
      'Unlimited Users',
      'Dedicated SARI Node',
      'On-prem Deployment',
      '24/7 War Room Support'
    ],
    icon: Crown,
    color: 'indigo',
    button: 'Contact MD'
  }
];

export default function Pricing() {
  const handleCheckout = (tier: string) => {
    if (tier === 'Enterprise') {
      window.location.href = `mailto:upendra.raghav@divyanshicapital.com?subject=Enterprise Inquiry: Sovereign Hub V5`;
      return;
    }
    
    toast.loading(`Initializing Secure Checkout for ${tier} Tier...`);
    
    // Simulate Razorpay/Stripe redirection
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${tier} node successfully calibrated. Redirecting to payment matrix...`);
      // In production: const stripe = await loadStripe(VITE_STRIPE_KEY); ...
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#06112C] py-24 px-6 relative overflow-hidden">
      {/* Background Glows (Optimized) */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-gold-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-black tracking-widest uppercase"
          >
            <Sparkles size={14} />
            Matrix Subscription Plans
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-gold-500">POWER LEVEL</span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 font-medium">
            Select the neural bandwidth your business requires. All tiers include 
            P1 Master Registry integration as standard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TIERS.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl
                           flex flex-col h-full transform-gpu transition-all duration-500 hover:-translate-y-2
                           ${tier.popular ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/10' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-black text-[10px] font-black rounded-full tracking-widest uppercase">
                    MOST CALIBRATED
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 
                                group-hover:scale-110 transition-transform duration-500
                                ${tier.color === 'cyan' ? 'text-cyan-400' : tier.color === 'gold' ? 'text-gold-500' : 'text-slate-400'}`}>
                  <Icon size={28} />
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{tier.price}</span>
                    <span className="text-slate-500 text-sm font-bold">{tier.frequency}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-3 font-medium min-h-[40px]">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {tier.features.map(feature => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-1 w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-cyan-400" />
                      </div>
                      <span className="text-slate-300 text-xs font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleCheckout(tier.name)}
                  className={`w-full py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all duration-300
                             ${tier.color === 'cyan' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : tier.color === 'gold' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {tier.button}
                </button>
              </motion.div>
            );
          })}
        </div>
        
        {/* ADDON FEATURES SECTION */}
        <div className="mt-24 mb-12 text-center">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Optional Neural Matrix Addons</h3>
            <p className="text-slate-500 mt-2">Enhance your Sovereign Cloud Core</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
                { title: "Real-Time CIBIL Engine", desc: "API bridge to check CIBIL scores directly within Loan OS (+₹500/mo)" },
                { title: "Sovereign E-Sign Matrix", desc: "Automate Document signing with Aadhar verification integration (+₹800/mo)" },
                { title: "Banking OCR Pipeline", desc: "Auto-parse bank statements (PDFs) to analyze income flows (+₹1000/mo)" }
            ].map((addon, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer">
                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wide mb-2">{addon.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{addon.desc}</p>
                </div>
            ))}
        </div>

        <div className="mt-12 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-2">
             <h4 className="text-2xl font-black text-white leading-none">Need a Custom Neural Cluster?</h4>
             <p className="text-slate-400 text-sm font-medium">Connect directly with our MD for complex enterprise deployments and white-labeling.</p>
           </div>
           <button 
             onClick={() => handleCheckout('Enterprise')}
             className="px-10 py-5 bg-white text-black font-black rounded-2xl tracking-widest uppercase hover:scale-105 transition-transform whitespace-nowrap"
           >
             ESTABLISH SECURE LINK
           </button>
        </div>
      </div>
    </div>
  );
}
