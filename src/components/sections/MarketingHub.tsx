import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, 
  Target, 
  Users, 
  MessageSquare, 
  Mail, 
  PhoneCall, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  Smartphone,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const channels = [
  { 
    id: 'whatsapp', 
    name: 'WhatsApp API', 
    desc: 'Official WABA broadcasting & automation.', 
    icon: MessageSquare, 
    color: 'text-emerald-500', 
    status: 'Ready',
    leads: '150+',
    cost: '₹0.72/msg'
  },
  { 
    id: 'tele', 
    name: 'Cloud Telephony', 
    desc: 'AI IVR & automated call routing.', 
    icon: PhoneCall, 
    color: 'text-indigo-500', 
    status: 'Active',
    leads: '80%',
    cost: '₹0.40/min'
  },
  { 
    id: 'ads', 
    name: 'Meta Ads AI', 
    desc: 'Auto-optimized FB & IG lead ads.', 
    icon: Facebook, 
    color: 'text-blue-500', 
    status: 'Live',
    leads: '2.4k',
    cost: '₹45/lead'
  },
  { 
    id: 'google', 
    name: 'GMB & Search', 
    desc: 'Top rank on local Indian keywords.', 
    icon: Search, 
    color: 'text-rose-500', 
    status: 'Ready',
    leads: '1k+',
    cost: 'Organic'
  },
];

const suites = [
  {
    title: 'Lead Intake Master',
    tools: ['Justdial Sync', 'IndiaMART Push', 'WorkIndia Intake', 'Naukri Parser'],
    description: 'Instant lead sync from all major Indian aggregators.'
  },
  {
    title: 'Outreach Automation',
    tools: ['Auto-Dialer', 'Bulk SMS', 'Email Drip', 'RCS Messaging'],
    description: 'Automate the first 5 touchpoints with every lead.'
  },
  {
    title: 'Sales Intelligence',
    tools: ['Call Sentiment', 'Lead Scoring', 'Staff Tracking', 'Revenue MIS'],
    description: 'Deep analytics on team performance and ROI.'
  }
];

export function MarketingHub() {
  const [activeChannel, setActiveChannel] = useState(channels[0].id);

  const handleLaunch = (name: string) => {
    toast.success(`Broadcasting campaign launched for ${name}!`);
  };

  return (
    <div className="space-y-8 pb-20 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between px-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-pink-500/10 text-pink-500 border-pink-500/20 uppercase tracking-tighter text-[10px]">Marketing Node</Badge>
            <Badge variant="outline" className="text-slate-500 uppercase tracking-tighter text-[10px]">A-Z India Ready</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white italic">Campaign Center</h1>
          <p className="text-slate-400">Manage Indian-market marketing channels and automated outreach suites.</p>
        </div>
        <Button className="bg-[#43a4ff] hover:bg-[#43a4ff]/90 h-11 px-6 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-[#43a4ff]/20">
          <Zap className="w-4 h-4 mr-2" />
          Launch New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {channels.map((chan) => (
          <Card 
            key={chan.id} 
            className={cn(
              "premium-card transition-all cursor-pointer group hover:scale-[1.02]",
              activeChannel === chan.id ? "bg-white/5 border-[#43a4ff]/40 shadow-xl shadow-[#43a4ff]/10" : "bg-white/[0.02] border-white/5"
            )}
            onClick={() => setActiveChannel(chan.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl bg-white/5", chan.color)}>
                  <chan.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[9px] uppercase font-black bg-white/5 border-white/10">{chan.status}</Badge>
              </div>
              <h3 className="text-lg font-bold mb-1">{chan.name}</h3>
              <p className="text-[10px] text-slate-500 mb-4">{chan.desc}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Leads</p>
                  <p className="text-sm font-bold text-white">{chan.leads}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Cost</p>
                  <p className="text-sm font-bold text-white">{chan.cost}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        <div className="lg:col-span-8 space-y-6">
          <Card className="premium-card bg-[#0a131d]/60 border-white/5 overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold italic">Suite Orchestration</CardTitle>
                  <CardDescription>Automated workflows for different stages of the funnel.</CardDescription>
                </div>
                <div className="flex gap-2 p-1 bg-black/20 rounded-xl">
                  {['Campaign', 'Workflow', 'Logs'].map(t => (
                    <Button key={t} variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase">{t}</Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {suites.map((suite, idx) => (
                <div key={suite.title} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-white/10 italic">0{idx + 1}</span>
                    <h4 className="text-md font-bold text-white">{suite.title}</h4>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-lg">{suite.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {suite.tools.map(tool => (
                      <div key={tool} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 flex items-center gap-2 group hover:text-white hover:border-white/10 transition-all cursor-pointer">
                        <Zap className="w-3 h-3 text-amber-500/50 group-hover:text-amber-500" />
                        {tool}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="premium-card bg-emerald-500/[0.02] border-emerald-500/10">
            <CardHeader>
              <CardTitle className="text-sm font-bold italic flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Live Campaign Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-2">
              {[
                { time: '2m ago', type: 'WhatsApp', detail: 'Bulk campaign "Q2 Offers" sent to 1,200 leads.' },
                { time: '15m ago', type: 'Telephony', detail: 'AI dialer verification started for 45 new Justdial leads.' },
                { time: '1h ago', type: 'Ads AI', detail: 'Meta Ad Budget scaled up by 15% due to high conversion.' },
                { time: '3h ago', type: 'System', detail: 'New workflow "Mortgage Funnel" deployed for team.' },
              ].map((feed, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1 relative group hover:border-emerald-500/20 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">{feed.type}</span>
                    <span className="text-[8px] text-slate-600 font-bold">{feed.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">{feed.detail}</p>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-slate-500 hover:text-emerald-500">View Full Log</Button>
            </CardContent>
          </Card>

          <Card className="premium-card bg-orange-500/[0.02] border-orange-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" />
                Marketing KPIs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em]">Cost Per Lead</p>
                  <p className="text-xl font-bold">₹38.5</p>
                  <span className="text-[9px] text-emerald-500 font-bold">-12% vs last week</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em]">Conversion</p>
                  <p className="text-xl font-bold">14.2%</p>
                  <span className="text-[9px] text-emerald-500 font-bold">+2.4% boost</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Upgrade Modal / Call to Action */}
      <div className="px-4">
        <Card className="bg-gradient-to-r from-[#1f3550] to-[#0a131d] border-white/10 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-2xl font-bold italic">Scale Your Marketing with AI</h2>
              <p className="text-slate-400 max-w-md">Connect with our team to activate Premium AI Voice Calling and advanced Meta Ads automation nodes.</p>
            </div>
            <Button onClick={() => handleLaunch('Premium Suite')} className="bg-white text-black hover:bg-white/90 px-8 h-12 rounded-xl font-bold uppercase tracking-widest text-[11px]">
              Activate High-Scale Node
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
