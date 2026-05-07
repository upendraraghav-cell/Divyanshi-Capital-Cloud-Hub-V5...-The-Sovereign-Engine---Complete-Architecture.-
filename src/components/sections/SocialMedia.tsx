import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Target, 
  PenTool, 
  MessageSquare, 
  TrendingUp, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube,
  Sparkles,
  Zap,
  BarChart3,
  CheckCircle2,
  Settings2,
  Send,
  Tags,
  Calendar,
  Trash2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getSuperAGIResponse } from '@/lib/gemini';

const stats = [
  { label: 'Platforms', value: '5', icon: Share2, color: 'text-pink-500' },
  { label: 'Content Queue', value: 'Auto', icon: Zap, color: 'text-amber-500' },
  { label: 'Ad Engine', value: 'Ready', icon: TrendingUp, color: 'text-orange-500' },
  { label: 'Approval Mode', value: 'Semi', icon: CheckCircle2, color: 'text-emerald-500' },
];

export function SocialMedia() {
  const [activeTab, setActiveTab] = useState<'brand' | 'content' | 'ads' | 'reply'>('brand');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previews, setPreviews] = useState<any[]>([]);
  const [calendarEntries, setCalendarEntries] = useState([
    { id: '1', platform: 'Instagram', date: '2024-05-01', time: '10:00 AM', status: 'Draft', content: 'Top 5 Tips for Home Loan Approval in 2024. #DivyanshiCapital #HomeLoans' },
    { id: '2', platform: 'LinkedIn', date: '2024-05-02', time: '11:30 AM', status: 'Approved', content: 'Why Diversifying Your Investment Portfolio is Crucial. Read our latest blog.' },
    { id: '3', platform: 'Facebook', date: '2024-05-03', time: '02:00 PM', status: 'Draft', content: 'Don\'t miss our limited time offer on Business Loans!' },
  ]);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [enabledAddons, setEnabledAddons] = useState<Record<string, boolean>>({
    'Campaign Tracker': true,
    'Creative Brief AI': false,
    'Approval Queue': true,
    'Advanced Tagging': false
  });

  const toggleSelect = (id: string) => {
    setSelectedEntries(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'schedule' | 'approve' | 'delete') => {
    if (selectedEntries.length === 0) return;

    if (action === 'delete') {
      setCalendarEntries(prev => prev.filter(e => !selectedEntries.includes(e.id)));
      toast.success(`Deleted ${selectedEntries.length} entries`);
    } else {
      setCalendarEntries(prev => prev.map(e => 
        selectedEntries.includes(e.id) 
          ? { ...e, status: action === 'schedule' ? 'Scheduled' : 'Approved' }
          : e
      ));
      toast.success(`${action === 'schedule' ? 'Scheduled' : 'Approved'} ${selectedEntries.length} entries`);
    }
    setSelectedEntries([]);
  };

  const toggleAddon = (title: string) => {
    setEnabledAddons(prev => {
      const newState = !prev[title];
      toast.success(`${title} ${newState ? 'enabled' : 'disabled'}`);
      return { ...prev, [title]: newState };
    });
  };

  const addons = [
    { title: 'Campaign Tracker', desc: 'Track source-wise campaigns and attribution', badge: 'Important', icon: BarChart3 },
    { title: 'Creative Brief AI', desc: 'Generate Canva briefs based on brand voice', badge: 'Better', icon: PenTool },
    { title: 'Advanced Tagging', desc: 'Associate social leads with custom campaign tags for deep filtering', badge: 'Better', icon: Tags },
    { title: 'Approval Queue', desc: 'Safety gate for auto-mode publishing', badge: 'Safe', icon: CheckCircle2 },
  ];

  const handleAction = async (type: string) => {
    setIsGenerating(true);
    try {
      // Simulate/Trigger AI logic
      toast.info(`Genie is processing ${type} strategy...`);
      setTimeout(() => {
        const newPreview = {
          id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type,
          title: `${type === 'ads' ? 'Ad Copy' : type === 'content' ? 'Content Idea' : 'Reply'} Generated`,
          content: type === 'ads' 
            ? "Fast loan guidance. Simple process. Trusted support. Talk to our team today." 
            : type === 'content' 
            ? "3 daily ideas generated for loan tips, FAQ, and festival offer content."
            : "Thank you for your interest. Please share your city and required loan amount.",
        };
        setPreviews([newPreview, ...previews]);
        toast.success(`${type.toUpperCase()} module updated.`);
      }, 1500);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Social Media AI Center</h1>
          <p className="text-muted-foreground group flex items-center gap-2">
            Growth + lead generation engine <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter opacity-50">Sovereign V3</Badge>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="premium-card bg-white/[0.02] border-white/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
              <div className={cn("p-2 rounded-xl bg-white/5 border border-white/10", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="premium-card border-white/5 overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <div className="flex gap-2 p-1 bg-black/20 rounded-xl w-fit">
                {[
                  { id: 'brand', label: 'Brand Voice', icon: BarChart3 },
                  { id: 'content', label: 'Content Calendar', icon: PenTool },
                  { id: 'ads', label: 'Ads Manager', icon: TrendingUp },
                  { id: 'reply', label: 'Reply Manager', icon: MessageSquare },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "rounded-lg px-4 h-8 text-[11px] font-bold uppercase tracking-tight transition-all",
                      activeTab === tab.id 
                        ? "bg-[#ff5ea8]/10 text-[#ff5ea8] border border-[#ff5ea8]/20" 
                        : "text-slate-500 hover:text-white"
                    )}
                  >
                    <tab.icon className="w-3 h-3 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'brand' && (
                  <motion.div
                    key="brand"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Brand Tone</label>
                          <Select defaultValue="trusted">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select Tone" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                              <SelectItem value="trusted">Trusted + Premium</SelectItem>
                              <SelectItem value="warm">Professional + Warm</SelectItem>
                              <SelectItem value="growth">Aggressive Growth</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Main Promise</label>
                          <Input placeholder="e.g. Fast loan guidance" className="bg-white/5 border-white/10" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Target Audience</label>
                          <Input placeholder="e.g. Salaried, business owners" className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">CTA Style</label>
                          <Input placeholder="e.g. Apply Now" className="bg-white/5 border-white/10" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Brand Rules</label>
                      <Textarea placeholder="Always sound trustworthy..." className="bg-white/5 border-white/10 h-24" />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => handleAction('brand')} className="bg-[#ff5ea8] hover:bg-[#ff72b5] text-white font-bold uppercase tracking-widest text-[10px] px-8 rounded-xl h-10 shadow-lg shadow-pink-500/20">
                        Save Brand Voice
                      </Button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'content' && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Platform</label>
                          <Select defaultValue="instagram">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select Platform" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Post Frequency</label>
                          <Select defaultValue="daily">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select Frequency" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Campaign Goal</label>
                          <Textarea placeholder="Describe your goal..." className="bg-white/5 border-white/10 h-24" />
                        </div>
                        <div className="flex gap-3">
                          <Button onClick={() => handleAction('content')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] px-8 rounded-xl h-10 shadow-lg shadow-blue-500/20">
                            <Sparkles className="w-3.5 h-3.5 mr-2" />
                            Generate Calendar
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4 border-l border-white/5 pl-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Planned Content</h4>
                          {selectedEntries.length > 0 && (
                            <div className="flex gap-2 animate-in fade-in slide-in-from-right-2">
                              <Button 
                                onClick={() => handleBulkAction('approve')} 
                                size="sm" 
                                className="h-7 text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 px-2"
                              >
                                Approve All ({selectedEntries.length})
                              </Button>
                              <Button 
                                onClick={() => handleBulkAction('schedule')} 
                                size="sm" 
                                className="h-7 text-[9px] font-black uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 px-2"
                              >
                                Schedule All
                              </Button>
                              <Button 
                                onClick={() => handleBulkAction('delete')} 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {calendarEntries.map((entry) => (
                            <div 
                              key={entry.id} 
                              onClick={() => toggleSelect(entry.id)}
                              className={cn(
                                "p-3 rounded-xl border transition-all cursor-pointer relative group",
                                selectedEntries.includes(entry.id) 
                                  ? "bg-blue-500/5 border-blue-500/30" 
                                  : "bg-white/[0.02] border-white/5 hover:border-white/20"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "w-4 h-4 rounded border flex items-center justify-center transition-colors mt-0.5",
                                  selectedEntries.includes(entry.id) ? "bg-blue-500 border-blue-500" : "border-white/20"
                                )}>
                                  {selectedEntries.includes(entry.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                        entry.platform === 'Instagram' ? "bg-pink-500/10 text-pink-500" :
                                        entry.platform === 'LinkedIn' ? "bg-sky-500/10 text-sky-500" :
                                        "bg-blue-600/10 text-blue-500"
                                      )}>
                                        {entry.platform}
                                      </span>
                                      <Badge variant="outline" className={cn(
                                        "text-[8px] font-black uppercase px-1 h-3.5",
                                        entry.status === 'Approved' ? "border-emerald-500/50 text-emerald-500" :
                                        entry.status === 'Scheduled' ? "border-blue-500/50 text-blue-500" :
                                        "border-slate-500/50 text-slate-500"
                                      )}>
                                        {entry.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold">
                                      <Calendar className="w-2.5 h-2.5" />
                                      {entry.date}
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-slate-300 line-clamp-2 italic font-medium leading-relaxed">
                                    "{entry.content}"
                                  </p>
                                  <div className="flex items-center gap-1.5 pt-1 text-[9px] text-slate-600">
                                    <Clock className="w-2.5 h-2.5" />
                                    {entry.time}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'ads' && (
                  <motion.div
                    key="ads"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Ad Objective</label>
                          <Select defaultValue="leads">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select Objective" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                              <SelectItem value="leads">Lead Generation</SelectItem>
                              <SelectItem value="traffic">Traffic</SelectItem>
                              <SelectItem value="messages">Messages</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Daily Budget</label>
                          <Input placeholder="1000" className="bg-white/5 border-white/10" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Offer/Product</label>
                          <Input placeholder="Personal Loan" className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500">Lead Destination</label>
                          <Select defaultValue="form">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select Destination" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                              <SelectItem value="form">WebApp Smart Form</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              <SelectItem value="calling">Calling Queue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handleAction('ads')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-[10px] px-8 rounded-xl h-10">
                      Generate Ad Set
                    </Button>
                  </motion.div>
                )}

                {activeTab === 'reply' && (
                  <motion.div
                    key="reply"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Reply Mode</label>
                        <Select defaultValue="semi">
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select Mode" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10">
                            <SelectItem value="draft">Draft Only</SelectItem>
                            <SelectItem value="semi">Semi Auto</SelectItem>
                            <SelectItem value="auto">Auto Reply</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Escalate To</label>
                        <Input placeholder="Sales Team" className="bg-white/5 border-white/10" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Reply Style</label>
                      <Textarea placeholder="Polite, fast, trust-building..." className="bg-white/5 border-white/10 h-24" />
                    </div>
                    <Button onClick={() => handleAction('reply')} className="bg-purple-500 hover:bg-purple-600 text-white font-bold uppercase tracking-widest text-[10px] px-8 rounded-xl h-10">
                      Save Reply Rules
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="premium-card border-white/5 bg-white/[0.01]">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-tight flex items-center gap-2 italic">
                <Sparkles className="w-4 h-4 text-pink-500" />
                AI Social Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {previews.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <Zap className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No active previews</p>
                    <p className="text-[10px] text-slate-600 mt-1">Configure brand rules or generate a calendar to start.</p>
                  </div>
                ) : (
                  previews.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-[#ff5ea8]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black uppercase text-[#ff5ea8] tracking-widest">{item.type}</span>
                        <Badge variant="outline" className="text-[8px] opacity-50 px-1 h-4">PREVIEW</Badge>
                      </div>
                      <p className="text-xs font-bold text-white mb-1">{item.title}</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed italic">"{item.content}"</p>
                      <Button variant="ghost" size="sm" className="w-full mt-4 h-7 text-[9px] font-black uppercase tracking-widest hover:bg-[#ff5ea8]/10 hover:text-[#ff5ea8] border border-white/5 rounded-lg">
                        Add to Queue
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="h-px bg-white/5 my-6" />

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Module Add-ons</h4>
                {addons.map((addon) => (
                  <div 
                    key={addon.title} 
                    className={cn(
                      "flex flex-col gap-1 p-3 rounded-xl border transition-all duration-300",
                      enabledAddons[addon.title] 
                        ? "bg-white/5 border-white/10 shadow-lg shadow-black/20" 
                        : "bg-black/20 border-white/5 opacity-60"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-lg bg-white/5",
                          enabledAddons[addon.title] ? "text-pink-500" : "text-slate-500"
                        )}>
                          <addon.icon className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-bold">{addon.title}</span>
                      </div>
                      <Switch 
                        checked={enabledAddons[addon.title]} 
                        onCheckedChange={() => toggleAddon(addon.title)}
                        className="scale-75"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-slate-500 max-w-[70%]">{addon.desc}</span>
                      <Badge variant="outline" className="text-[8px] font-bold italic border-slate-700 text-slate-400">{addon.badge}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
