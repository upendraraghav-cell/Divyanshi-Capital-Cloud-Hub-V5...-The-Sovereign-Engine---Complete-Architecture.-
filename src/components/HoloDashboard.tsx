import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Users, Target, TrendingUp, Cpu, 
  Zap, Bell, Shield, Terminal, Orbit, Database, Brain
} from 'lucide-react';
import { useSovereignStore } from '@/lib/useSovereignStore';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

const DATA = [
  { name: '08:00', value: 400 },
  { name: '10:00', value: 3000 },
  { name: '12:00', value: 2000 },
  { name: '14:00', value: 2780 },
  { name: '16:00', value: 1890 },
  { name: '18:00', value: 2390 },
  { name: '20:00', value: 3490 },
];

function HoloCard3D({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <Float speed={5} rotationIntensity={2} floatIntensity={1}>
          <mesh scale={2.5}>
            <sphereGeometry args={[1, 32, 32]} />
            <MeshDistortMaterial
              color={color}
              speed={2}
              distort={0.3}
              radius={1}
              wireframe
              transparent
              opacity={0.1}
            />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}

const KPICard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden"
  >
    <HoloCard3D color={color === 'cyan' ? '#06b6d4' : (color === 'gold' ? '#d97706' : '#8b5cf6')} />
    
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-8">
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${color === 'cyan' ? 'text-cyan-400' : (color === 'gold' ? 'text-gold-500' : 'text-purple-500')} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${trend > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% Delta
        </div>
      </div>
      
      <div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</div>
        <div className="text-4xl font-black text-white tracking-tighter mb-2">{value}</div>
        <div className="text-xs text-slate-400 font-medium">{sub}</div>
      </div>
    </div>
  </motion.div>
);

export default function HoloDashboard() {
  const { lailaTelemery, matrixStatus } = useSovereignStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="p-6 md:p-12 space-y-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tighter">SOVEREIGN MISSION CONTROL</h2>
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Core: DC_OS_V5_STABLE</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#06112C]" />
          </div>
          <div className="px-6 py-3 rounded-2xl bg-cyan-500 text-black font-black text-xs tracking-widest flex items-center gap-3">
             <Shield size={16} />
             SOVEREIGN IDENTITY VERIFIED
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <KPICard 
          title="Active Lead Matrix" 
          value="2,481" 
          sub="Synchronized with P1 Master"
          icon={Target}
          color="cyan"
          trend={12.5}
        />
        <KPICard 
          title="Neural Conversions" 
          value="₹54.2L" 
          sub="MD Authorized Revenue"
          icon={TrendingUp}
          color="gold"
          trend={24.8}
        />
        <KPICard 
          title="System Threads" 
          value="342" 
          sub="Autonomous Agent Clusters"
          icon={Cpu}
          color="purple"
          trend={-2.1}
        />
        <KPICard 
          title="Registry Uptime" 
          value="99.99%" 
          sub="SARI Link Stability"
          icon={Activity}
          color="cyan"
          trend={0.1}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Visualization */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                  <Orbit size={20} />
               </div>
               <div>
                  <h3 className="text-lg font-black text-white">Neural Traffic Analysis</h3>
                  <p className="text-xs text-slate-500 font-medium tracking-tight">Real-time packet synthesis across SaaS V3 clusters</p>
               </div>
             </div>
             <div className="flex gap-2">
               <button className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-[10px] font-black uppercase">Live</button>
               <button className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-[10px] font-black uppercase">Archive</button>
             </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#06b6d4" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Laila Intelligence Feed */}
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl flex flex-col">
           <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                  <Brain size={20} />
               </div>
               <div>
                  <h3 className="text-lg font-black text-white">LAILA Telemetry</h3>
                  <p className="text-xs text-slate-500 font-medium tracking-tight">Autonomous Link Status</p>
               </div>
           </div>

           <div className="flex-grow space-y-4 overflow-auto max-h-[350px] pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {lailaTelemery.map((log, i) => (
                  <motion.div 
                    key={`tel-log-${i}`} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-[10px] space-y-1 group"
                  >
                    <div className="flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                      <span className="text-cyan-400 font-black tracking-widest uppercase">System Log V2.4</span>
                      <span className="text-slate-500">[{i}]</span>
                    </div>
                    <div className="text-slate-300 italic">{log}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>

           <div className="mt-8 pt-8 border-top border-white/5">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-slate-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SARI Neural Bridge</span>
                </div>
                <div className="text-[10px] font-black text-green-500 uppercase tracking-widest">Stable</div>
             </div>
             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '84%' }}
                  className="h-full bg-cyan-500" 
                />
             </div>
           </div>
        </div>
      </div>

      {/* Sub-system Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl flex items-center gap-8 group">
           <div className="w-24 h-24 rounded-[2rem] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:rotate-[360deg] transition-transform duration-1000">
              <Database size={40} />
           </div>
           <div className="space-y-2">
              <h4 className="text-xl font-black text-white leading-none">P1 Master Linked</h4>
              <p className="text-sm text-slate-500 font-medium">Auto-onboarding protocol active. All employee matrices synchronized with Google Hub.</p>
              <div className="pt-2">
                 <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    Access Registry <Zap size={12} />
                 </button>
              </div>
           </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl flex items-center gap-8 group">
           <div className="w-24 h-24 rounded-[2rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:rotate-[360deg] transition-transform duration-1000">
              <Users size={40} />
           </div>
           <div className="space-y-2">
              <h4 className="text-xl font-black text-white leading-none">LAILA Controller V2</h4>
              <p className="text-sm text-slate-500 font-medium">Telegram routing active. Automated lead follow-up and Telegram group provisioning functional.</p>
              <div className="pt-2">
                 <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    Manage Agents <Zap size={12} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
