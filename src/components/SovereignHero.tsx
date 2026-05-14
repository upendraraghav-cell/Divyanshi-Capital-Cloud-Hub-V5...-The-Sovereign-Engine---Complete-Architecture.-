import React, { useRef, useMemo, Component, ReactNode, ErrorInfo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { Zap, Brain, MessageSquare, Bot, ArrowRight, Shield, Activity, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL Canvas failed to load, swapping to fallback:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const FallbackCircuit = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
    <svg viewBox="0 0 400 400" className="w-full h-full max-w-[600px] max-h-[600px]">
      <defs>
        <linearGradient id="circGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#43a4ff" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="circGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#43a4ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Grid Ring */}
      <g stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none">
        <circle cx="200" cy="200" r="180" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="140" strokeDasharray="2 6" />
      </g>

      {/* Rotating Tech Rings */}
      <g>
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="0 200 200" 
          to="360 200 200" 
          dur="40s" 
          repeatCount="indefinite" 
        />
        <circle cx="200" cy="200" r="160" fill="none" stroke="url(#circGrad1)" strokeWidth="2" strokeDasharray="60 40 20 40" filter="url(#glow)" />
        <circle cx="200" cy="50" r="4" fill="#ea580c" filter="url(#glow)" />
        <circle cx="50" cy="200" r="3" fill="#43a4ff" />
      </g>

      <g>
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="360 200 200" 
          to="0 200 200" 
          dur="30s" 
          repeatCount="indefinite" 
        />
        <circle cx="200" cy="200" r="120" fill="none" stroke="url(#circGrad2)" strokeWidth="1.5" strokeDasharray="40 20 10 30" filter="url(#glow)" />
        <circle cx="200" cy="320" r="3" fill="#43a4ff" filter="url(#glow)" />
      </g>

      {/* Core */}
      <circle cx="200" cy="200" r="60" fill="rgba(234,88,12,0.05)" stroke="rgba(234,88,12,0.3)" strokeWidth="1">
        <animate attributeName="r" values="58;62;58" dur="4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
    
    <div className="absolute w-32 h-32 md:w-[12rem] md:h-[12rem] flex items-center justify-center">
      <Zap className="w-8 h-8 md:w-10 md:h-10 text-orange-500 drop-shadow-[0_0_15px_rgba(234,88,12,0.8)] animate-pulse" />
    </div>
  </div>
);

function CircuitBoard() {
  const ref = useRef<THREE.Points>(null);
  
  const count = 1200;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color1 = new THREE.Color("#ea580c"); // orange-600
    const color2 = new THREE.Color("#43a4ff"); // cyan-blue

    for (let i = 0; i < count; i++) {
        // Create a techy grid/cylinder shape instead of a sphere
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 10;
        const radius = 4 + Math.random() * 2;
        
        pos[i * 3] = radius * Math.cos(theta);
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = radius * Math.sin(theta);

        const mixedColor = color1.clone().lerp(color2, Math.random());
        cols[i * 3] = mixedColor.r;
        cols[i * 3 + 1] = mixedColor.g;
        cols[i * 3 + 2] = mixedColor.b;
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.1;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <group rotation={[0, 0, 0]}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

const TopNav = () => (
  <nav className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]">
        <Zap className="text-white w-5 h-5" />
      </div>
      <span className="font-black text-white tracking-tighter uppercase italic text-xl">DIVYANSHI <span className="text-orange-500">V3</span></span>
    </div>
    <div className="hidden lg:flex items-center gap-8 text-[11px] font-black tracking-[0.2em] uppercase text-slate-300">
      <span className="hover:text-orange-500 cursor-pointer transition-colors">Home</span>
      <span className="hover:text-orange-500 cursor-pointer transition-colors">Architecture</span>
      <span className="hover:text-orange-500 cursor-pointer transition-colors">Pricing</span>
      <span className="hover:text-orange-500 cursor-pointer transition-colors">Partners</span>
      <span className="hover:text-orange-500 cursor-pointer transition-colors">Contact</span>
    </div>
    <Link to="/login?layer=p1">
      <button className="px-8 py-3 bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20">
        Access System
      </button>
    </Link>
  </nav>
);

export default function SovereignHero() {
  return (
    <div className="min-h-screen bg-[#050B14] overflow-x-hidden pt-24 font-sans text-slate-50 relative selection:bg-orange-500/30 selection:text-orange-400">
      <TopNav />
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-orange-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[40rem] h-[40rem] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              SaaS Infrastructure V3 
            </div>
            
            <h1 className="text-6xl md:text-[5rem] lg:text-[6rem] font-black leading-[0.85] tracking-tighter uppercase italic">
              <span className="text-white">THE</span> <span className="text-orange-500">NEURAL</span><br/>
              <span className="text-white">BUSINESS OS.</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              Divyanshi Capital Cloud Hub is more than a CRM. It's a living architecture that syncs WhatsApp, Telegram, Sales Matrices, and autonomous AI into one P1 Master framework.
            </p>
            
            <Link to="/login?layer=p1" className="inline-block mt-4">
              <button className="group px-10 py-5 bg-white text-[#050B14] font-black rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform uppercase tracking-widest text-xs">
                Initiate Link
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[600px] w-full hidden lg:block"
          >
            {/* Embedded 3D Canvas with Fallback */}
            <div className="absolute inset-0">
               <CanvasErrorBoundary fallback={<FallbackCircuit />}>
                 <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
                    <fog attach="fog" args={["#050B14", 5, 20]} />
                    <ambientLight intensity={1} />
                    <pointLight position={[10, 10, 10]} intensity={2} color="#ea580c" />
                    <CircuitBoard />
                 </Canvas>
               </CanvasErrorBoundary>
            </div>

            {/* Performance Badge */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -left-12 p-6 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl flex items-center shadow-2xl"
            >
              <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mr-4 border border-green-500/30">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Matrix Efficiency</p>
                <p className="text-3xl font-black text-white italic">+24.8%</p>
              </div>
            </motion.div>
            
          </motion.div>

        </div>
      </div>

      {/* Modules - 3 Glass Cards */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 relative z-10">
        <div className="text-center mb-16">
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">Core <span className="text-orange-500">Architecture</span></h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { tag: "Operations Logic", title: "LAILA CORE", icon: Brain, desc: "Autonomous sales pipeline routing and document verification AI. Validates entries and auto-corrects discrepancies in the P1 registry." },
            { tag: "Conversation Node", title: "BULBHUL AI", icon: MessageSquare, desc: "Multilingual WA interactive agent. Handles 24/7 lead inquiries, captures context, and logs directly into your Google Sheets MIS." },
            { tag: "Financial Brain", title: "SARI V5", icon: Bot, desc: "The supreme financial intelligence unit. Capable of instant multi-policy analysis, payout calculations, and live chat with field RMs." }
          ].map((card, i) => (
             <Link key={i} to="/login?layer=p1" className="group">
               <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:bg-white/[0.06] hover:border-orange-500/30 transition-all h-full flex flex-col">
                 <div className="flex items-center justify-between mb-8">
                   <div className="w-14 h-14 rounded-2xl bg-orange-600/10 text-orange-500 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                     <card.icon className="w-6 h-6" />
                   </div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{card.tag}</span>
                 </div>
                 <h3 className="text-2xl font-black text-white italic tracking-tight mb-4 uppercase">{card.title}</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 flex-1">{card.desc}</p>
                 <div className="flex items-center text-[10px] font-black text-orange-500 uppercase tracking-widest">
                   Access Module <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                 </div>
               </div>
             </Link>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-32 relative z-10 border-t border-white/5 mt-20">
        <div className="text-center mb-20">
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">Neural <span className="text-orange-500">Bandwidth</span></h2>
           <p className="text-slate-400 mt-4 max-w-xl mx-auto font-medium">Select your enterprise link capacity. All tiers sync with the master P1 registry.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl flex flex-col hover:border-white/10 transition-all">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Starter Link</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-8">Personal Sandbox</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-white">₹500</span>
              <span className="text-slate-500 font-black ml-2 uppercase tracking-widest text-xs">/ MO</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <Shield className="w-4 h-4 text-slate-500" /> 1 Personal Bot
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <Users className="w-4 h-4 text-slate-500" /> Single User Node
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <Settings className="w-4 h-4 text-slate-500" /> Basic WA Bridge
              </li>
            </ul>
            <Link to="/login?layer=p1" className="w-full">
              <button className="w-full py-4 rounded-xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">
                Select Starter
              </button>
            </Link>
          </div>

          {/* Pro */}
          <div className="p-10 rounded-[2.5rem] bg-orange-600/5 border border-orange-500/30 backdrop-blur-xl flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-orange-600/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
              Most Popular
            </div>
            <h3 className="text-xl font-black text-orange-500 uppercase italic tracking-tight mb-2">Pro Matrix</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-8">Standard Enterprise</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-white">₹750</span>
              <span className="text-slate-500 font-black ml-2 uppercase tracking-widest text-xs">/ MO</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm text-slate-100 font-medium">
                <Activity className="w-4 h-4 text-orange-500" /> Full P1 Dashboard
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-100 font-medium">
                <Users className="w-4 h-4 text-orange-500" /> 1 Seat License
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-100 font-medium">
                <Bot className="w-4 h-4 text-orange-500" /> Bulbhul & Sari Logic
              </li>
            </ul>
            <Link to="/login?layer=p1" className="w-full">
              <button className="w-full py-4 rounded-xl bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-colors shadow-lg">
                Link Pro Matrix
              </button>
            </Link>
          </div>

          {/* Team */}
          <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl flex flex-col hover:border-white/10 transition-all">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Team Hub</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-8">Multi-Node Access</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-white">₹1000</span>
              <span className="text-slate-500 font-black ml-2 uppercase tracking-widest text-xs">/ MO</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <Users className="w-4 h-4 text-slate-500" /> 5 User Nodes
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <Shield className="w-4 h-4 text-slate-500" /> Role-based Security
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <Activity className="w-4 h-4 text-slate-500" /> Master MIS Access
              </li>
            </ul>
            <Link to="/login?layer=p1" className="w-full">
              <button className="w-full py-4 rounded-xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">
                Establish Hub
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#03060a] py-12 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded shrink-0 bg-orange-600 flex items-center justify-center">
                <Zap className="text-white w-4 h-4" />
             </div>
             <span className="font-black text-white italic tracking-tight uppercase">Divyanshi Capital V3</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[9px] font-black tracking-[0.2em] uppercase text-slate-500">
             <span className="text-slate-400">Powered Base:</span>
             <span>Google Cloud</span>
             <span>•</span>
             <span>Meta Business</span>
             <span>•</span>
             <span>Microsoft Azure</span>
          </div>
          <div className="text-[10px] font-bold text-slate-600">
            © 2026 SOVEREIGN OS. ALL RIGHTS SECURED.
          </div>
        </div>
      </footer>
    </div>
  );
}
