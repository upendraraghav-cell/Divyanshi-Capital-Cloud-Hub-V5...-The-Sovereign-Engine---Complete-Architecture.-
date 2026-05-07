/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Package, 
  Briefcase, 
  ChevronRight, 
  ArrowLeft, 
  CreditCard,
  Rocket,
  CheckCircle2,
  Sparkles,
  Zap,
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

type OnboardingStep = 'COMPANY' | 'PLAN' | 'TEMPLATE' | 'PROVISIONING';

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPlan = location.state?.plan || 'starter';

  const [step, setStep] = useState<OnboardingStep>('COMPANY');
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    email: '',
    password: '',
    plan: initialPlan,
    template: 'loan'
  });

  const industries = [
    { id: 'loan', name: 'Loan & Finance', icon: CreditCard, desc: 'Optimized for lending and credit ops.' },
    { id: 'hr', name: 'HR & Recruiting', icon: Briefcase, desc: 'Process people and talent cycles.' },
    { id: 'sales', name: 'Sales & Real Estate', icon: Layout, desc: 'Track leads and property assets.' },
    { id: 'agency', name: 'Marketing Agency', icon: Zap, desc: 'Campaign and client management.' }
  ];

  const handleNext = () => {
    if (step === 'COMPANY') {
      if (!formData.companyName || !formData.email || !formData.password) {
        toast.error("Required fields: Identity data missing.");
        return;
      }
      setStep('PLAN');
    } else if (step === 'PLAN') {
      setStep('TEMPLATE');
    } else if (step === 'TEMPLATE') {
      startProvisioning();
    }
  };

  const startProvisioning = async () => {
    setStep('PROVISIONING');
    // Simulate V3 Engine processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    toast.success(`${formData.companyName} Matrix Successfully Provisioned.`);
    setTimeout(() => {
      navigate('/workspace/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-600/5 blur-[150px]" />
      </div>

      {/* Nav */}
      <nav className="h-20 flex items-center justify-between px-10 relative z-20">
         <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl italic uppercase tracking-tighter">MALLIK <span className="text-orange-500">SYSTEM</span></span>
        </div>
        <Button variant="ghost" onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white">
          Return to Terminal
        </Button>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0f] border border-white/5 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(234,88,12,0.05)]">
          {/* Left Column: Context */}
          <div className="p-16 bg-gradient-to-br from-slate-900 to-[#050508] relative hidden lg:block">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <Badge className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-10">
                  SaaS Onboarding Flow
                </Badge>
                <h1 className="text-5xl font-black italic uppercase leading-none tracking-tighter mb-8">
                  Deploy Your <br />
                  <span className="text-orange-600">Enterprise</span> <br />
                  Workspace.
                </h1>
                <p className="text-slate-400 font-medium italic leading-relaxed">
                  Join the elite businesses running on Mallik System. Your sovereign AI OS starts here.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'Identity Verified', desc: 'Secure neural authentication.' },
                  { title: 'Global Sync', desc: 'Real-time database linking.' },
                  { title: 'Agent Ready', desc: 'SARI + BULBUL auto-configured.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase italic">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="p-10 lg:p-20 relative flex flex-col justify-center">
             <AnimatePresence mode="wait">
               {step === 'COMPANY' && (
                 <motion.div
                   key="company-step"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-10"
                 >
                   <div>
                     <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Company Registry</h2>
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Step 1 of 3: Core Identity</p>
                   </div>

                   <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Company Name</label>
                       <Input 
                        placeholder="e.g., Divyanshi Capital" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-orange-500 font-bold"
                       />
                     </div>
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Admin Email</label>
                       <Input 
                        type="email"
                        placeholder="you@company.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-orange-500 font-bold"
                       />
                     </div>
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Security Access Key</label>
                       <Input 
                        type="password"
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-orange-500 font-bold"
                       />
                     </div>
                     <Button type="submit" className="w-full h-16 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest flex items-center justify-center rounded-2xl">
                        Proceed to Plan Selection <ChevronRight className="w-5 h-5 ml-2" />
                     </Button>
                   </form>
                 </motion.div>
               )}

               {step === 'PLAN' && (
                 <motion.div
                   key="plan-step"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-10"
                 >
                   <button onClick={() => setStep('COMPANY')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">
                      <ArrowLeft className="w-4 h-4" /> Go Back
                   </button>
                   <div>
                     <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Select Capacity</h2>
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Step 2 of 3: Neural Plan</p>
                   </div>

                   <div className="space-y-4">
                      {['starter', 'pro', 'enterprise'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setFormData({...formData, plan: p})}
                          className={cn(
                            "w-full p-6 rounded-3xl border flex items-center justify-between transition-all group",
                            formData.plan === p 
                              ? "bg-orange-500/10 border-orange-500 text-white" 
                              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <Package className={cn("w-6 h-6", formData.plan === p ? "text-orange-500" : "text-slate-600")} />
                            <div className="text-left">
                              <p className="font-black italic uppercase tracking-tighter">{p}</p>
                              <p className="text-[10px] font-bold text-slate-500">Plan Status Node</p>
                            </div>
                          </div>
                          {formData.plan === p && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
                        </button>
                      ))}
                   </div>

                   <Button onClick={handleNext} className="w-full h-16 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest rounded-2xl">
                      Next: Workspace Template
                   </Button>
                 </motion.div>
               )}

               {step === 'TEMPLATE' && (
                 <motion.div
                   key="template-step"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-10"
                 >
                    <button onClick={() => setStep('PLAN')} className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">
                      <ArrowLeft className="w-4 h-4" /> Go Back
                   </button>
                   <div>
                     <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Industry Matrix</h2>
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Step 3 of 3: Workspace Template</p>
                   </div>

                   <div className="grid grid-cols-1 gap-4">
                      {industries.map((ind) => (
                        <Card 
                          key={ind.id}
                          onClick={() => setFormData({...formData, template: ind.id})}
                          className={cn(
                            "cursor-pointer transition-all border-white/10 overflow-hidden relative group",
                            formData.template === ind.id ? "bg-blue-600/10 ring-2 ring-blue-500 scale-[1.02]" : "bg-white/5 hover:bg-white/[0.08]"
                          )}
                        >
                          <CardContent className="p-6 flex items-center gap-6">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", formData.template === ind.id ? "bg-blue-600 text-white" : "bg-white/10 text-slate-400 group-hover:text-white")}>
                               <ind.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                               <h4 className="font-black italic uppercase tracking-tighter text-white">{ind.name}</h4>
                               <p className="text-[10px] text-slate-500 uppercase font-bold">{ind.desc}</p>
                            </div>
                            {formData.template === ind.id && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                          </CardContent>
                        </Card>
                      ))}
                   </div>

                   <Button onClick={handleNext} className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                      Execute System Synthesis
                   </Button>
                 </motion.div>
               )}

               {step === 'PROVISIONING' && (
                 <motion.div
                   key="provisioning-step"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center space-y-10"
                 >
                    <div className="relative w-32 h-32 mx-auto">
                       <div className="absolute inset-0 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />
                       <Rocket className="w-32 h-32 text-orange-500 animate-bounce" />
                    </div>
                    <div>
                       <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Synthesizing...</h2>
                       <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-4">V3 Sovereign Engine is Provisioning your Node.</p>
                    </div>
                    <div className="space-y-2 max-w-xs mx-auto">
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2.8 }}
                            className="h-full bg-orange-500"
                          />
                       </div>
                       <div className="flex items-center justify-between text-[8px] font-black text-slate-700 uppercase tracking-widest">
                          <span>Firestore Core</span>
                          <span>Audit Matrix</span>
                          <span>Bulbul AI</span>
                       </div>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      <footer className="h-16 flex items-center justify-center p-4 relative z-20">
         <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest">© 2026 DIVYANSHI CAPITAL GROUP • MALLIK SOVEREIGN ENGINE</p>
      </footer>
    </div>
  );
}
