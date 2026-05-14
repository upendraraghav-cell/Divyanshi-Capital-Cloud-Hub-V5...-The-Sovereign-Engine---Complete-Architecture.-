import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Shield, Brain, Workflow, BarChart4, Network, Terminal, Diamond } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayerProps {
  title: string;
  description: string;
  icon: any;
  image: string;
  isRight: boolean;
  progress: any; // Scroll progress for this specific section
  index: number;
  total: number;
}

const Layer = ({ title, description, icon: Icon, image, isRight, progress, index, total }: LayerProps) => {
  // Parallax and fade effects based on section scroll progress
  
  // Fade in text as it enters, fade out as it leaves
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.3, 0.7, 1], [50, 0, 0, -50]);
  
  // Parallax the image slightly
  const imageScale = useTransform(progress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const imageOpacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  
  // Subtle rotation for a premium feel
  const imageRotate = useTransform(progress, [0, 1], [-2, 2]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative px-6 md:px-24">
      <div className={cn(
        "max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10",
        isRight && "md:flex-row-reverse"
      )}>
        
        {/* Text Content */}
        <motion.div 
          style={{ opacity, y }}
          className={cn(
            "flex flex-col justify-center",
            isRight ? "md:order-2 md:pl-12" : "md:order-1 md:pr-12"
          )}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-500 text-[10px] font-black tracking-[0.3em] uppercase w-fit mb-8 backdrop-blur-md">
            <Icon size={14} className="animate-pulse" />
            Layer {index + 1} of {total}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.85] mb-6">
            {title.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {i === title.split(' ').length - 1 ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">{word}</span> : word}
                {i !== title.split(' ').length - 1 && ' '}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
            {description}
          </p>
          
          <div className="mt-10 flex items-center gap-2">
             <div className="flex -space-x-1">
               <div className="w-2 h-2 rounded-full bg-orange-500" />
               <div className="w-2 h-2 rounded-full bg-orange-500/50" />
               <div className="w-2 h-2 rounded-full bg-orange-500/20" />
             </div>
             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-2">Sub-System Initiated</span>
          </div>
        </motion.div>

        {/* Visual Content */}
        <motion.div 
          style={{ opacity: imageOpacity, scale: imageScale, rotate: imageRotate }}
          className={cn(
            "relative h-[400px] lg:h-[600px] w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl",
            isRight ? "md:order-1" : "md:order-2"
          )}
        >
          {/* Glassmorphism Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#06112C]/40 via-transparent to-[#06112C]/80 mix-blend-overlay" />
          <div className="absolute inset-0 z-20 shadow-[inset_0_0_100px_rgba(6,17,44,0.8)]" />
          
          <img 
            src={image} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-50"
          />
        </motion.div>
      </div>
    </div>
  );
};

export function MallikShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate smooth progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const layers = [
    {
      title: "Command Layer",
      description: "The apex control interface. A luxurious, precision-crafted dashboard offering total visibility over the enterprise matrix. Dark premium aesthetics meet instantaneous data access.",
      icon: Terminal,
      image: "https://images.unsplash.com/photo-1620503374956-c942862f0372?q=80&w=2000&auto=format&fit=crop"
    },
    {
      title: "AI Neural Core",
      description: "A glowing neural network of sovereign intelligence. Bulbhul and LAILA coalesce, processing natural language, intent, and complex logic streams in real-time.",
      icon: Brain,
      image: "https://images.unsplash.com/photo-1635830625698-3b9bd74671ca?q=80&w=2000&auto=format&fit=crop"
    },
    {
      title: "Automation Engine",
      description: "Interlocking digital gears and frictionless pathways. The workflow layer automates lead routing, document verification, and follow-ups with silent, relentless precision.",
      icon: Workflow,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"
    },
    {
      title: "MIS Analytics",
      description: "Elegant holographic visualizations extracting truth from noise. Instantaneous financial reporting, performance matrices, and dynamic forecasting rendered in gold and navy.",
      icon: BarChart4,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"
    },
    {
      title: "Integration Mesh",
      description: "The connective tissue tying WhatsApp, Google Cloud, Meta, and banking APIs into a single cohesive organism. Seamless synchronization across all platforms.",
      icon: Network,
      image: "https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=2000&auto=format&fit=crop"
    },
    {
      title: "Sovereign Vault",
      description: "Military-grade data control and role-based access limits. The security layer acts as an unbreakable vault, ensuring absolute data integrity and privacy.",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-[#03060a] min-h-screen text-slate-50 selection:bg-orange-500/30 selection:text-orange-400 font-sans">
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-orange-600 origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />

      {/* Hero Intro */}
      <div className="h-screen w-full flex flex-col items-center justify-center relative sticky top-0 bg-[#03060a] z-0 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.1)_0%,rgba(3,6,10,1)_70%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center relative z-10"
        >
          <div className="w-16 h-16 mx-auto mb-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center transform rotate-45 shadow-[0_0_50px_rgba(234,88,12,0.4)]">
            <Diamond className="w-8 h-8 text-white -rotate-45" />
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase italic leading-[0.85]">
             THE MALLIK<br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-[0_0_30px_rgba(234,88,12,0.3)]">
               SYSTEM
             </span>
          </h1>
          <p className="mt-8 text-slate-400 font-medium uppercase tracking-[0.4em] text-xs md:text-sm">
            Scroll To Initiate Architecture
          </p>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-24 bg-gradient-to-b from-orange-500 to-transparent mx-auto mt-12"
          />
        </motion.div>
      </div>

      {/* Parallax Content Layers */}
      <div ref={containerRef} className="relative z-10 bg-[#03060a] h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {layers.map((layer, index) => {
            const start = index / layers.length;
            const end = (index + 1) / layers.length;
            
            // Map the global scroll progress to a local 0-1 for this section
            const sectionProgress = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0, 0.5, 0.5, 1]);

            return (
              <div key={index} className="absolute inset-0 pointer-events-none">
                 <div className="pointer-events-auto h-full w-full">
                   <Layer 
                     {...layer} 
                     isRight={index % 2 !== 0} 
                     progress={sectionProgress}
                     index={index}
                     total={layers.length}
                   />
                 </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Assembly Reveal */}
      <div className="min-h-[150vh] relative bg-black flex flex-col items-center justify-center px-6 overflow-hidden z-20">
        <div className="absolute inset-0">
           <img 
             src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop" 
             alt="Final Assembly"
             className="w-full h-full object-cover opacity-20 filter contrast-150 grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-200px" }}
          transition={{ duration: 1.5 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <Diamond className="w-16 h-16 text-orange-500 mx-auto mb-8 animate-pulse" />
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-8 leading-tight">
             Absolute <br/> <span className="text-orange-500">Sovereignty</span>
          </h2>
          <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
            The Mallik System stands assembled. A frictionless synthesis of human ambition and autonomous intelligence. Your enterprise, running flawlessly.
          </p>
          <button className="px-12 py-5 bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-orange-500 transition-all shadow-[0_0_40px_rgba(234,88,12,0.4)]">
             Begin Integration
          </button>
        </motion.div>
      </div>

    </div>
  );
}
