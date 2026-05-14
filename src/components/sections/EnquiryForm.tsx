import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  Sparkles, 
  User, 
  Smartphone, 
  Mail,
  MapPin, 
  Building2, 
  Coins, 
  Briefcase,
  History,
  CheckCircle2,
  Clock,
  Zap,
  Globe,
  Database,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSovereignStore } from '@/lib/useSovereignStore';

export function EnquiryForm() {
  const { user, addTelemetry } = useSovereignStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    entry_type: 'STAFF_ENTRY',
    source_name: 'SOVEREIGN_HUB_V5',
    emp_code: user?.empCode || '',
    sales_name: user?.name || '',
    client_name: '',
    mother_name: '',
    mobile: '',
    email: '',
    city: '',
    loan_type: 'Personal Loan',
    amount: '',
    preferred_bank: '',
    employment_type: 'Salaried',
    remarks: '',
    rm_mobile: '',
    follow_up_date: '',
    pan_status: 'NOT_UPLOADED',
    mandatory_doc: ''
  });

  const loanTypes = [
    "Personal Loan", "Business Loan", "Home Loan", "Loan Against Property (LAP)", 
    "Auto Loan", "Education Loan", "Gold Loan", "Working Capital", 
    "Cash Credit (CC)", "Commercial Vehicle Loan", "Two Wheeler Loan", 
    "Consumer Durable Loan", "Loan Against Securities", "Mortgage Loan", 
    "Invoice Discounting", "Lease Rental Discounting (LRD)", 
    "Supply Chain Finance", "Construction Equipment Loan", 
    "Professional", "Other"
  ];

  const mandatoryDocs = [
    { id: 'pan', label: 'PAN Card (Mandatory)', required: true },
    { id: 'aadhaar', label: 'Aadhaar Card' },
    { id: 'salary', label: 'Last 3m Salary Slip' },
    { id: 'bank', label: '6m Bank Statement' },
    { id: 'itr', label: '2yr ITR/Form 16' },
    { id: 'kyc', label: 'KYC / Address Proof' }
  ];

  const [docsUploaded, setDocsUploaded] = useState<string[]>([]);

  const toggleDoc = (id: string) => {
    setDocsUploaded(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
    if (id === 'pan') {
      setFormData(prev => ({ ...prev, pan_status: prev.pan_status === 'UPLOADED' ? 'NOT_UPLOADED' : 'UPLOADED' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name.trim()) {
      toast.error("Client Identity Required.");
      return;
    }
    if (!formData.mobile || formData.mobile.length < 10) {
      toast.error("Valid Neural Link (Mobile) Required.");
      return;
    }
    if (!docsUploaded.includes('pan')) {
      toast.error("Critical: PAN Card is MANDATORY for P1 Master Protocol.");
      return;
    }

    setLoading(true);
    addTelemetry(`Initiating Neural Sync V5 for: ${formData.client_name}`);
    
    try {
      const res = await fetch('/api/webhooks/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          docs: docsUploaded,
          source: 'SOVEREIGN_CORE_V5',
          timestamp: new Date().toISOString(),
          auto_actions: ['SEND_WELCOME_MAIL', 'TRIGGER_TAT_WATCHDOG', 'ACTIVATE_BULBHUL_AVATAR']
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        addTelemetry(`Matrix Latch SUCCESS: ${data.syncId} | Welcome Mail Queued.`);
        toast.success(`Matrix Latch Established! SyncID: ${data.syncId}`);
        
        setFormData(prev => ({
          ...prev,
          client_name: '',
          mother_name: '',
          mobile: '',
          email: '',
          amount: '',
          remarks: '',
          follow_up_date: ''
        }));
        setDocsUploaded([]);
      }
    } catch (e) {
      addTelemetry('Sync CRITICAL_FAILURE: Neural link severed.');
      toast.error("Neural Matrix Connection Severed.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setFormData({
      ...formData,
      client_name: "Amit Malhotra",
      mother_name: "Suman Malhotra",
      mobile: "9812345678",
      email: "amit.m@gmail.com",
      city: "Delhi",
      loan_type: "Personal Loan",
      amount: "750000",
      rm_mobile: "9988776655",
      preferred_bank: "HDFC",
      employment_type: "Salaried",
      remarks: "Urgent personal loan for expansion. Matrix profile: HIGH_INTENT."
    });
    addTelemetry('Demo Matrix Data Injected: AMIT_MALHOTRA_NODE_01');
    toast.info("Neural Buffer Loaded with Demo Data.");
  };

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-6xl mx-auto pb-32 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
           <div className="flex items-center gap-2">
              <Badge className="bg-cyan-500/10 text-cyan-400 border-white/5 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                P1 MASTER PROTOCOL ACTIVE
              </Badge>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Smart Intake Matrix</h1>
           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Autonomous Data Ingestion Layer V5.0</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden xl:flex flex-col items-end">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SARI Verification</div>
              <div className="text-xs font-black text-emerald-500 uppercase tracking-tighter">AUTHENTICATED</div>
           </div>
           <button 
             onClick={fillDemo}
             className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 group"
           >
             <Zap size={14} className="text-cyan-400 group-hover:scale-125 transition-transform" />
             Matrix Autofill
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2">
          <Card className="bg-[#0A193D]/40 border-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-white/5 bg-white/5">
               <div className="flex items-center gap-4">
                  <div className="p-4 rounded-3xl bg-cyan-500 text-black shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)]">
                     <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Universal Entry Node</h2>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Cross-system registry bridge initialized.</p>
                  </div>
               </div>
            </div>

            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">LATCH_TYPE</label>
                  <Select 
                    value={formData.entry_type} 
                    onValueChange={(val) => handleSelectChange('entry_type', val)}
                  >
                    <SelectTrigger className="h-14 bg-black/20 border-white/5 rounded-2xl px-6 text-xs text-white font-bold tracking-tight">
                      <SelectValue placeholder="Select Entry Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A193D] border-white/10 text-white rounded-2xl">
                      <SelectItem value="STAFF_ENTRY">Staff Protocol</SelectItem>
                      <SelectItem value="SALES_LEAD">Sales Vector</SelectItem>
                      <SelectItem value="CLIENT_ENTRY">Client Portal</SelectItem>
                      <SelectItem value="VISITOR_ENTRY">Visitor Beacon</SelectItem>
                      <SelectItem value="BANKER_ENTRY">Banker Node</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 opacity-60 grayscale hover:grayscale-0 transition-all">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">SOURCE_AGENT</label>
                  <div className="relative">
                    <Input 
                      type="text"
                      className="h-14 bg-black/40 border-white/5 rounded-2xl pl-12 text-xs text-white font-bold cursor-not-allowed"
                      value={`${formData.sales_name} (${formData.emp_code})`}
                      disabled
                    />
                    <Briefcase className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">CLIENT_ID_NAME *</label>
                  <div className="relative group">
                    <Input 
                      className="h-14 bg-white/[0.03] border-white/10 focus:border-cyan-500/50 rounded-2xl pl-12 text-xs text-white font-bold transition-all"
                      placeholder="Identified customer name"
                      value={formData.client_name}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                    />
                    <User className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">KYC_MOTHER_NAME *</label>
                  <div className="relative group">
                    <Input 
                      className="h-14 bg-white/[0.03] border-white/10 focus:border-cyan-500/50 rounded-2xl pl-12 text-xs text-white font-bold transition-all"
                      placeholder="Mother's name for grid verification"
                      value={formData.mother_name}
                      onChange={(e) => setFormData({...formData, mother_name: e.target.value})}
                    />
                    <Globe className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">PRIMARY_NEURAL_LINK *</label>
                  <div className="relative group">
                    <Input 
                      className="h-14 bg-white/[0.03] border-white/10 focus:border-cyan-500/50 rounded-2xl pl-12 text-xs text-white font-bold tracking-tighter transition-all"
                      placeholder="10 digit mobile cluster"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    />
                    <Smartphone className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">DIGITAL_MAIL_NODE</label>
                  <div className="relative group">
                    <Input 
                      type="email"
                      className="h-14 bg-white/[0.03] border-white/10 focus:border-cyan-500/50 rounded-2xl pl-12 text-xs text-white font-bold transition-all"
                      placeholder="client.identity@network.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">LOAN_VECTOR_TYPE</label>
                  <Select 
                    value={formData.loan_type} 
                    onValueChange={(val) => handleSelectChange('loan_type', val)}
                  >
                    <SelectTrigger className="h-14 bg-white/[0.03] border-white/10 rounded-2xl px-12 text-xs text-white font-bold">
                       <SelectValue placeholder="Select Loan Tier" />
                       <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <Coins className="w-5 h-5 text-slate-500" />
                       </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A193D] border-white/10 text-white rounded-2xl max-h-[300px]">
                      {loanTypes.map((type) => (
                        <SelectItem key={type} value={type} className="focus:bg-cyan-500 focus:text-black transition-colors">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">REQUIRED_CAPITAL</label>
                  <div className="relative group">
                    <Input 
                      className="h-14 bg-white/[0.03] border-white/10 focus:border-cyan-500/50 rounded-2xl pl-12 text-xs text-white font-black transition-all"
                      placeholder="e.g. 5000000"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500 group-focus-within:text-cyan-400">₹</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">ASSIGNED_RM_MOBILE</label>
                  <div className="relative group">
                    <Input 
                      className="h-14 bg-white/[0.03] border-white/10 focus:border-cyan-500/50 rounded-2xl pl-12 text-xs text-white font-bold transition-all"
                      placeholder="RM Mobile for SMS alerts"
                      value={formData.rm_mobile}
                      onChange={(e) => setFormData({...formData, rm_mobile: e.target.value})}
                    />
                    <Smartphone className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">RECALL_TARGET (FOLLOW-UP)</label>
                  <div className="relative group">
                    <Input 
                      type="date"
                      className="h-14 bg-white/[0.03] border-white/10 focus:border-cyan-500/50 rounded-2xl pl-12 text-xs text-white font-bold transition-all [color-scheme:dark]"
                      value={formData.follow_up_date}
                      onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})}
                    />
                    <Clock className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      SUBMISSION_CREDENTIALS (DOCS)
                    </label>
                    <span className="text-[8px] font-black text-emerald-500 uppercase italic">Neural Latch Protocols Active</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {mandatoryDocs.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => toggleDoc(doc.id)}
                        className={cn(
                          "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center group/doc relative overflow-hidden",
                          docsUploaded.includes(doc.id) 
                            ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)]" 
                            : "bg-white/[0.02] border-white/5 hover:border-white/20"
                        )}
                      >
                         {docsUploaded.includes(doc.id) && (
                           <div className="absolute top-0 right-0 p-1">
                             <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                           </div>
                         )}
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          docsUploaded.includes(doc.id) ? "bg-emerald-500 text-black scale-110" : "bg-white/5 text-slate-500"
                        )}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-tight leading-tight",
                          docsUploaded.includes(doc.id) ? "text-emerald-500" : "text-slate-500"
                        )}>
                          {doc.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-500 italic mt-2">
                    * PAN Card validation is <b>MANDATORY</b> for registry entry. Remaining docs can be processed by Bulbhul AI later.
                  </p>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">REMARKS_AND_AI_INSTRUCTIONS</label>
                  <textarea 
                    className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-xs text-white font-bold outline-none focus:border-cyan-500/50 transition-all resize-none custom-scrollbar"
                    placeholder="Provide additional context for Bulbhul AI synthesis..."
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 pt-6">
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit" 
                    disabled={loading}
                    className="w-full h-20 bg-cyan-500 text-[#06112C] font-black uppercase text-sm tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-cyan-500/20 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {loading ? "INITIALIZING NEURAL BRIDGE..." : "Commit Lead to Matrix"}
                      {!loading && <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> }
                    </span>
                  </motion.button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel Info */}
        <div className="space-y-8">
           <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                    <Database size={20} />
                 </div>
                 <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">P1 Registry Stats</h3>
              </div>
              <div className="space-y-4">
                 {[
                   { label: 'Master Sync', val: 'Synchronized', color: 'text-green-500' },
                   { label: 'Neural Buffer', val: 'Ready', color: 'text-cyan-400' },
                   { label: 'SARI Response', val: '42ms', color: 'text-gold-500' },
                   { label: 'Queue Status', val: 'NOMINAL', color: 'text-white' }
                 ].map(stat => (
                   <div key={stat.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 grow">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                      <span className={cn("text-[10px] font-black uppercase", stat.color)}>{stat.val}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-cyan-500 to-indigo-600 space-y-6 group">
              <div className="flex items-center gap-4 text-[#06112C]">
                 <Sparkles size={24} />
                 <h3 className="text-lg font-black italic tracking-tighter uppercase">Intelligent Dispatch</h3>
              </div>
              <p className="text-xs text-white/80 font-bold leading-relaxed">
                By committing this entry, the Sovereign Engine will automatically provision a 
                Google Drive folder, update the central MIS, and alert the manager via the 
                SARI Command Center.
              </p>
              <div className="pt-2">
                 <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="h-full bg-white" 
                    />
                 </div>
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                 <History size={18} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Active</span>
              </div>
              <div className="p-6 rounded-3xl bg-black/40 border border-white/5 font-mono text-[9px] text-slate-400 space-y-2">
                 <div className="flex justify-between"><span>LATCH_INITIALIZED</span><span className="text-cyan-500">OK</span></div>
                 <div className="flex justify-between"><span>P1_MD_VERIFY</span><span className="text-cyan-500">OK</span></div>
                 <div className="flex justify-between"><span>GRID_MAPPING</span><span className="text-gold-500">PENDING</span></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
