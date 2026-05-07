import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Code, 
  ChevronRight, 
  ArrowRight,
  BarChart3,
  Zap,
  CheckCircle2,
  Lock,
  User,
  Loader2,
  Menu,
  X,
  Building2,
  Smartphone,
  Database,
  Rocket,
  Brain,
  MessageSquare,
  Trophy,
  Target,
  Crown,
  Laptop
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ALL_EMPLOYEES, Employee } from '@/data/staff';
import { SOURCE_REGISTRY } from '@/data/registry';
import { gasService } from '@/services/gasService';
import { cn } from '@/lib/utils';

interface LandingPageProps {
  onLogin: (user: { email: string; role: string; userName?: string; personalFileId?: string; serverId?: string; brand?: string }) => void;
}

type LoginStep = 'BRAND' | 'IDENTITY' | 'CODE';

export function LandingPage({ onLogin }: LandingPageProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [loginStep, setLoginStep] = useState<LoginStep>('BRAND');
  const [selectedBrand, setSelectedBrand] = useState('Divyanshi Capital Cloud Hub V5');
  const [identity, setIdentity] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [matchedEmployee, setMatchedEmployee] = useState<Employee | null>(null);
  const [password, setPassword] = useState('');

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ['rgba(10, 10, 15, 0)', 'rgba(10, 10, 15, 0.95)']);
  const navBorder = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.1)']);

  const resetLogin = () => {
    setLoginStep('BRAND');
    setIdentity('');
    setOtp('');
    setPassword('');
    setMatchedEmployee(null);
    setShowLogin(false);
  };

  const handleIdentitySubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    const brandData = SOURCE_REGISTRY.find(b => b.name === selectedBrand);
    const empCode = identity.trim().toUpperCase();
    const mobileNo = mobile.trim();

    try {
      // Fetch team registry to match EMP_CODE and MOBILE
      const response = await gasService.getTeam(brandData?.id || 'PRJ_DIVYANSHI_001');
      
      if (response.ok && response.data) {
        const team = response.data as any[];
        
        // Log keys of the first entry to help debugging
        if (team.length > 0) {
          console.log("Registry Sample Data:", team[0]);
          console.log("Searching for:", { empCode, mobileNo: mobileNo.replace(/\D/g, '') });
        }

        const searchCode = empCode.toUpperCase();
        const searchMobile = mobileNo.replace(/\D/g, '').slice(-10);

        const employee = team.find(emp => {
          // Get all string values in this entry (handle both Object and Array)
          const values = Object.values(emp).map(v => String(v).trim());
          
          // Check if the EMP_CODE exists anywhere in the data node
          const hasCode = values.some(v => v.toUpperCase() === searchCode);
          
          // Check if any value contains the 10-digit mobile number
          const hasMobile = values.some(v => v.replace(/\D/g, '').endsWith(searchMobile));
          
          return hasCode && hasMobile;
        });

        if (employee) {
          const name = (employee.name || employee.EMP_NAME || employee['EMP NAME'] || (Array.isArray(employee) ? employee[3] : '') || empCode).toString();
          const email = (employee.email || employee.EMAIL || (Array.isArray(employee) ? (employee[15] || employee[4]) : '') || `${empCode}@divyanshicapital.com`).toString();
          const role = (employee.role || employee.ROLE || employee.RANK || (Array.isArray(employee) ? employee[9] : '') || 'user').toString();
          const personalFileId = (employee.personal_file_id || employee.personalFileId || (Array.isArray(employee) ? employee[30] : '') || 'GUEST').toString();

          // Store in localStorage as per MD instructions
          localStorage.setItem('mallik_tenant_id', brandData?.id || 'PRJ_DIVYANSHI_001');
          localStorage.setItem('mallik_emp_code', empCode);
          localStorage.setItem('mallik_role', role);
          localStorage.setItem('mallik_personal_file_id', personalFileId);
          localStorage.setItem('mallik_personal_file_url', (employee.personal_file_url || '').toString());

          onLogin({ 
            email: email, 
            userName: empCode,
            role: role,
            personalFileId: personalFileId,
            serverId: brandData?.serverId || 'DEFAULT_MASTER',
            brand: selectedBrand
          });
          
          toast.success(`Access Granted: ${name} authenticated.`);
          setShowLogin(false);
        } else {
          toast.error("Access Denied: EMP_CODE and Mobile mismatch.");
        }
      } else {
        toast.error("Registry Offline: Failed to connect to Sovereign Matrix.");
      }
    } catch (err) {
      toast.error("Neural Fracture: Verification link broken.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const employee = ALL_EMPLOYEES.find(emp => 
      emp.empCode.toUpperCase() === identity.toUpperCase() && 
      emp.brand === selectedBrand &&
      (emp.password === password || password === 'admin_master')
    );

    if (employee) {
      const brandData = SOURCE_REGISTRY.find(b => b.name === selectedBrand);
      onLogin({ 
        email: employee.email, 
        role: employee.role,
        personalFileId: employee.personalFileId,
        serverId: brandData?.serverId || 'DEFAULT_MASTER',
        brand: employee.brand
      });
      toast.success(`Access Granted: Opening ${selectedBrand} Terminal`);
      setShowLogin(false);
    } else {
      toast.error("Access Denied: Invalid Employee Code or Password.");
    }
    setIsLoading(false);
  };

  const BRANDS = [
    { name: "Divyanshi Capital", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "Google Cloud", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Meta Business", icon: MessageSquare, color: "text-[#0081FB]", bg: "bg-[#0081FB]/10" },
    { name: "Microsoft Azure", icon: Database, color: "text-[#00A4EF]", bg: "bg-[#00A4EF]/10" }
  ];

  const pricingPlans = [
    {
      name: "Starter Node",
      price: "₹1,499",
      period: "/month",
      desc: "Perfect for single agents or small teams looking for a fast start.",
      features: [
        "Laila Basic AI Integration",
        "Master Sheet Sync (P1)",
        "Daily Sales Log (MIS)",
        "WhatsApp Notification Node"
      ],
      color: "border-slate-800 bg-slate-900/50",
      btnText: "Start Free Trial",
      btnVariant: "outline" as const
    },
    {
      name: "Enterprise Hub",
      price: "₹4,999",
      period: "/month",
      desc: "Our most popular plan for established offices and growing firms.",
      features: [
        "Bulbhul Full Sales Automation",
        "Multi-Tab Campaign Engine",
        "Neural Bridge (Auto-Healing)",
        "Priority 24/7 Tech Support",
        "Custom Brand White-labeling"
      ],
      color: "border-orange-500/50 bg-orange-500/5 shadow-[0_0_40px_rgba(249,115,22,0.1)]",
      btnText: "Activate Now",
      btnVariant: "default" as const,
      popular: true
    },
    {
      name: "Sovereign Engine",
      price: "Custom",
      period: "",
      desc: "Full-scale neural architecture for massive organizations.",
      features: [
        "All Enterprise Features",
        "Dedicated Server Node",
        "AI Studio Training (Laila v5)",
        "On-Site Deployment",
        "Custom API Integrations"
      ],
      color: "border-blue-500/50 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.1)]",
      btnText: "Contact MD Expert",
      btnVariant: "outline" as const
    }
  ];

  const personas = [
    {
      id: 'laila',
      name: 'LAILA',
      role: 'SYSTEM ARCHITECT',
      desc: "The 'Brain' of Divyanshi Capital. Laila handles deep analytics, API integrations, and the neural bridge that keeps your data pixel-perfect.",
      benefits: ["Automated Data Healing", "Zero-Webhook Integration", "Real-time P&L Mapping"],
      color: "from-blue-500 to-indigo-600",
      icon: Brain
    },
    {
      id: 'bulbhul',
      name: 'BULBHUL',
      role: 'SALES COMMANDER',
      desc: "The 'Soul' of the office. Bulbhul drives your team with aggressive motivation, Hinglish sales pitches, and 24/7 lead chasing.",
      benefits: ["High-Energy Motivation", "Target-Oriented Pitching", "Auto-Lead Conversion"],
      color: "from-orange-500 to-rose-600",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-orange-500/30 selection:text-orange-500 selection:backdrop-blur-md overflow-x-hidden">
      
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-orange-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] rounded-full bg-purple-500/10 blur-[80px]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        style={{ backgroundColor: navBg, borderBottomColor: navBorder }}
        className="fixed top-0 w-full z-50 border-b transition-colors duration-300 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-[#00346a] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,52,106,0.5)] ring-1 ring-white/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight leading-none text-white italic">DIVYANSHI</span>
              <span className="text-[10px] text-orange-500 font-black uppercase tracking-[0.3em]">GROUP HUB</span>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-10">
            {['Architecture', 'Pricing', 'Partners', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                {item}
              </a>
            ))}
            <div className="w-px h-6 bg-white/10" />
            <Button 
              onClick={() => {
                setLoginStep('BRAND');
                setShowLogin(true);
              }}
              className="bg-orange-600 hover:bg-orange-500 text-white px-8 rounded-full font-black uppercase tracking-widest text-[10px] h-11 border border-orange-400/30 shadow-[0_0_20px_rgba(234,88,12,0.3)] group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                ACCESS SYSTEM <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white p-2">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge className="bg-white/5 text-orange-500 border border-orange-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                SOVEREIGN ENGINE V5.0 • MAY 2026
              </Badge>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.82] text-white italic mb-8 uppercase">
                The <span className="text-orange-500">Neural</span> <br />
                Business <br />
                OS.
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg mb-10">
                Divyanshi Capital Cloud Hub is more than a CRM. It's a living architecture that breathes efficiency into your call center, hospital, or sales floor.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Button 
                  onClick={() => {
                    setLoginStep('BRAND');
                    setShowLogin(true);
                  }}
                  className="h-16 px-12 bg-white text-black hover:bg-slate-200 text-lg font-black uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.15)] active:scale-95 transition-all w-full sm:w-auto"
                >
                  Initiate Link
                </Button>
                <div className="flex flex-col text-slate-500 text-[10px] font-black uppercase tracking-widest text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>99.9% Uptime Verified</span>
                  </div>
                  <span className="text-orange-500 mt-1">Live from MD Office</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 p-2 bg-gradient-to-br from-white/10 to-transparent rounded-[48px] border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
                  alt="High-Tech Dashboard Meta" 
                  className="w-full h-auto rounded-[40px] opacity-80"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 -right-6 p-6 bg-slate-900/90 border border-white/20 rounded-3xl backdrop-blur-2xl shadow-2xl hidden md:block"
                >
                  <BarChart3 className="w-8 h-8 text-orange-500 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live ROI</p>
                  <p className="text-2xl font-black italic text-white">+24.8%</p>
                </motion.div>

                <motion.div 
                   animate={{ y: [0, 20, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="absolute bottom-10 -left-10 p-5 bg-[#001529]/95 border border-white/20 rounded-3xl backdrop-blur-2xl shadow-2xl hidden md:block"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-black italic text-white">AUTOPILOT ON</span>
                  </div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Status: Nominal</p>
                </motion.div>
              </div>
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-600/10 blur-[120px] -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands Marquee */}
      <section className="py-20 bg-[#080810] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] mb-12 italic opacity-60">
            POWERED BY TOP-TIER INFRASTRUCTURE
          </p>
          <div className="relative">
            <div className="flex items-center gap-24 overflow-hidden mask-fade-sides">
               <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-24 flex-shrink-0"
               >
                 {[...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
                   <div key={`brand-m-${i}`} className="flex items-center gap-4 group opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-pointer">
                     <b.icon className={cn("w-10 h-10 transition-all duration-500 grayscale group-hover:grayscale-0", b.color)} />
                     <span className="font-black italic text-2xl tracking-tighter text-slate-500 group-hover:text-white transition-colors">{b.name.toUpperCase()}</span>
                   </div>
                 ))}
               </motion.div>
            </div>
            {/* Fade overlays */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#080810] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#080810] to-transparent z-10" />
          </div>
        </div>
      </section>

      {/* Persona Highlights */}
      <section id="architecture" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-6 underline decoration-orange-500 decoration-4 underline-offset-8">The Dual Core Intelligence</h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              Our system runs on two specialized AI personas built specifically for the finance and sales industry. Meet Laila and Bulbhul.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {personas.map((p) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-10 bg-slate-900 border border-white/5 rounded-[40px] hover:border-white/20 transition-all relative overflow-hidden"
              >
                <div className={cn("absolute top-0 right-0 w-64 h-64 opacity-5 bg-gradient-to-br blur-3xl group-hover:opacity-10 transition-opacity", p.color)} />
                <div className="relative z-10 space-y-6">
                  <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center p-5 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform")}>
                    <p.icon className={cn("w-10 h-10")} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter">{p.name}</h3>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mt-1">{p.role}</p>
                  </div>
                  <p className="text-slate-400 font-medium leading-relaxed italic">{p.desc}</p>
                  
                  <div className="space-y-3 pt-4">
                    {p.benefits.map((b, i) => (
                      <div key={`benef-${p.id}-${i}`} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-300">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulbhul's Motivation Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Trophy className="w-20 h-20 text-white mx-auto mb-4" />
            <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
              Bhai, Target <br /> 
              Ka Kya Hua?
            </h2>
            <p className="text-xl md:text-2xl font-black text-black leading-relaxed max-w-3xl mx-auto italic uppercase">
              "MD Sahab ka sapna hai har gully me Divyanshi Capital ho. System set hai, leads live hain, aur Bulbhul ready hai. Ab bas tumhe deal close karni hai! No बहाना, Only बिक्री!"
            </p>
            <div className="pt-8">
              <Button 
                onClick={() => {
                  setLoginStep('BRAND');
                  setShowLogin(true);
                }}
                className="bg-black text-white hover:bg-slate-900 h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl"
              >
                Activate Bulbhul Mode
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-[#030305] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-6">Choose Your Workspace</h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
              Secure your neural node. Whether you are a solo visionary or a global giant, we have the architecture to scale you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -10 }}
                className={cn("p-8 rounded-[40px] border flex flex-col transition-all relative", plan.color)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white border-none px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                    MOST POPULAR HUB
                  </Badge>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-5xl font-black text-white italic">{plan.price}</span>
                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{plan.period}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-4 font-medium leading-relaxed">{plan.desc}</p>
                </div>

                <div className="flex-1 space-y-4 mb-10">
                  {plan.features.map((feat) => (
                    <div key={`${plan.name}-${feat}`} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-sm font-bold text-slate-300">{feat}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => {
                    setLoginStep('BRAND');
                    setShowLogin(true);
                  }}
                  variant={plan.btnVariant}
                  className={cn(
                    "h-14 w-full rounded-2xl font-black uppercase tracking-widest text-[11px]",
                    plan.popular ? "bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]" : "border-white/10 text-white hover:bg-white/5"
                  )}
                >
                  {plan.btnText}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sari v6 Teaser */}
      <section className="py-32 px-6 relative overflow-hidden bg-[#080810]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
              <Sparkles className="w-3 h-3" /> NEURAL EXPERIMENTAL NODE
            </div>
            <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
              Meet <span className="text-purple-500">Sari v6</span>.
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
              "The most advanced personal assistant ever built. Sari isn't just AI; she's a loyal companion who handles your calls, schedules, and security with Iron Man-level precision."
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black">
                    {i === 4 ? '+50' : <User className="w-4 h-4 text-slate-500" />}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">50+ Beta Users Testing</p>
            </div>
            <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-full h-12 px-8 font-black uppercase text-[10px] tracking-widest">
              Join Waitlist
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
             <div className="w-full aspect-square max-w-md mx-auto relative flex items-center justify-center">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="w-64 h-64 rounded-full border-4 border-purple-500/30 flex items-center justify-center relative">
                   <div className="w-48 h-48 rounded-full border-2 border-purple-500/50 animate-spin-slow" />
                   <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.5)]">
                      <Sparkles className="w-12 h-12 text-white animate-pulse" />
                   </div>
                </div>
                {/* Floating Micro-nodes */}
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3 + i, repeat: Infinity }}
                    style={{ transform: `rotate(${deg}deg) translate(140px)` }}
                    className="absolute w-8 h-8 bg-slate-900 border border-purple-500/50 rounded-xl flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                  </motion.div>
                ))}
             </div>
          </motion.div>
        </div>
      </section>

      {/* High-Tech CTA */}
      <section className="py-40 px-6 relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <Crown className="w-20 h-20 text-orange-500 mx-auto" />
          <h2 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
            Ready To <br />
            Connect?
          </h2>
          <p className="text-2xl text-slate-400 font-medium italic">
            Stop pretending to be productive. Start actually scaling with Divyanshi Capital.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <Button 
              onClick={() => {
                setLoginStep('BRAND');
                setShowLogin(true);
              }}
              className="h-20 px-16 bg-orange-600 hover:bg-orange-500 text-white text-xl font-black uppercase tracking-widest rounded-3xl shadow-[0_0_50px_rgba(234,88,12,0.4)]"
            >
              Access Terminal Now
            </Button>
            <Button variant="outline" className="h-20 px-16 border-white/10 text-white hover:bg-white/5 text-xl font-black uppercase tracking-widest rounded-3xl">
              Book MD Demo
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] -z-10" />
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-black border-t border-white/5 text-center sm:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00346a] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white italic">DIVYANSHI HUB</span>
            </div>
            <p className="text-slate-500 text-xs font-bold leading-loose uppercase tracking-widest">
              The sovereign engine of modern enterprise. Built for heroes, by heroes.
            </p>
            <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">© 2026 DIVYANSHI CAPITAL GROUP</p>
          </div>
          
          {[
            { title: 'System', links: ['Architecture', 'Laila Core', 'Bulbhul Node', 'Security'] },
            { title: 'Workspace', links: ['SaaS Hub', 'Registry', 'Pricing', 'Docs'] },
            { title: 'Connect', links: ['WhatsApp API', 'Email Node', 'MD Office', 'Support'] }
          ].map((col) => (
            <div key={col.title} className="space-y-6">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">{col.title}</h4>
              <div className="flex flex-col gap-4">
                {col.links.map(link => (
                  <a key={link} href="#" className="text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors uppercase tracking-widest">{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetLogin}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0f] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.1)] relative z-10"
            >
              {/* Left Side: Context */}
              <div className="p-16 bg-[#001529] relative overflow-hidden hidden lg:block border-r border-white/5">
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-10 border border-white/10 shadow-xl">
                      <Sparkles className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-4xl font-black text-white italic leading-none mb-6 uppercase tracking-tighter">Unified Hub <br />Terminal</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[260px]">Access your brand node through our secure military-grade neural link.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-5 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">System Health: Optimal</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">All Active Segments Online</span>
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <Lock className="w-3.5 h-3.5 text-slate-600" />
                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">Neural Gateway v6.0.4-ENCRYPTION</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Login Form */}
              <div className="p-16 bg-[#050508] relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={resetLogin}
                  className="absolute top-8 right-8 text-slate-500 hover:text-white rounded-full hover:bg-white/10 transition-all"
                >
                  <X className="w-6 h-6" />
                </Button>

                <AnimatePresence mode="wait">
                  {loginStep === 'BRAND' && (
                    <motion.div
                      key="brand-step"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      <div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Select Hub</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Authorized Personnel Only</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {BRANDS.map((brand) => (
                          <motion.button
                            key={brand.name}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedBrand(brand.name);
                              setLoginStep('IDENTITY');
                            }}
                            className={cn(
                              "w-full p-6 rounded-3xl border transition-all text-left flex items-center justify-between group",
                              selectedBrand === brand.name 
                                ? 'bg-orange-500/10 border-orange-500/50 text-white shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                            )}
                          >
                            <div className="flex items-center gap-5">
                              <div className={cn("p-3 rounded-2xl", brand.bg)}>
                                <brand.icon className={cn("w-6 h-6", brand.color)} />
                              </div>
                              <span className="font-black text-sm italic uppercase tracking-tight">{brand.name}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {loginStep === 'IDENTITY' && (
                    <motion.div
                      key="identity-step"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setLoginStep('BRAND')} className="w-12 h-12 rounded-full border border-white/10 hover:bg-white/10">
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </Button>
                        <div>
                          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedBrand}</h2>
                          <p className="text-[10px] text-orange-500 uppercase tracking-widest font-black mt-1">Personnel Checkpoint</p>
                        </div>
                      </div>

                      <form onSubmit={handleIdentitySubmit} className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Employee Code</label>
                          <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                            <Input 
                              placeholder="e.g. EMP-001" 
                              value={identity}
                              onChange={(e) => setIdentity(e.target.value)}
                              className="pl-14 bg-black/40 border-white/10 text-white placeholder:text-slate-800 h-16 rounded-3xl focus:border-orange-500/50 text-lg font-bold"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Regd. Mobile Number</label>
                          <div className="relative">
                            <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                            <Input 
                              placeholder="10-digit number" 
                              type="tel"
                              value={mobile}
                              onChange={(e) => setMobile(e.target.value)}
                              className="pl-14 bg-black/40 border-white/10 text-white placeholder:text-slate-800 h-16 rounded-3xl focus:border-orange-500/50 text-lg font-bold"
                              required
                            />
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black h-16 rounded-3xl shadow-[0_0_30px_rgba(234,88,12,0.3)] uppercase tracking-widest text-[11px] relative overflow-hidden"
                        >
                          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify & Access Hub"}
                        </Button>
                        
                        <div className="flex items-center gap-4 py-2">
                           <div className="h-px flex-1 bg-white/5" />
                           <span className="text-[10px] text-slate-700 font-black uppercase">Standard Auth</span>
                           <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <Button 
                          type="button"
                          onClick={() => setLoginStep('CODE')}
                          variant="ghost"
                          className="w-full text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest"
                        >
                          Use Static Code Key
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {loginStep === 'CODE' && (
                    <motion.div
                      key="code-step"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setLoginStep('IDENTITY')} className="w-12 h-12 rounded-full border border-white/10 hover:bg-white/10">
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </Button>
                        <div>
                          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Code Key</h2>
                          <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black mt-1">Manual Node Entry</p>
                        </div>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Employee Code</label>
                          <Input 
                            placeholder="EMP-CODE" 
                            value={identity}
                            onChange={(e) => setIdentity(e.target.value)}
                            className="bg-black/40 border-white/10 text-white placeholder:text-slate-800 h-16 rounded-3xl focus:border-blue-500/50 font-bold"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
                          <Input 
                            type="password"
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black/40 border-white/10 text-white placeholder:text-slate-800 h-16 rounded-3xl focus:border-blue-500/50 font-bold"
                            required
                          />
                        </div>

                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-16 rounded-3xl shadow-[0_0_30px_rgba(37,99,235,0.3)] uppercase tracking-widest text-[11px]"
                        >
                          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Deploy Into Workspace"}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .mask-fade-sides {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
