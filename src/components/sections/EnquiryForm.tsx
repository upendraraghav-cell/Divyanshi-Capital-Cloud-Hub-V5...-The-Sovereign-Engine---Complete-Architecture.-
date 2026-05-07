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
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ActivityService } from '@/services/activityService';

export function EnquiryForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    entry_type: 'STAFF_ENTRY',
    source_name: 'INTERNAL_APP',
    emp_code: user?.empCode || '',
    sales_name: user?.name || '',
    client_name: '',
    mobile: '',
    email: '',
    city: '',
    loan_type: '',
    amount: '',
    preferred_bank: '',
    employment_type: '',
    remarks: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name.trim()) {
      toast.error("Client Name is required");
      return;
    }
    if (!formData.mobile) {
      toast.error("Mobile Number is required");
      return;
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch('/api/webhooks/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'SMART_FORM_V3',
          timestamp: new Date().toISOString()
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        // Log to Neural Activity Matrix
        const activityMsg = `Lead Matrix Latch: ${formData.client_name} via ${formData.sales_name}`;
        ActivityService.log('intelligence', activityMsg);

        toast.success(`Lead Synced! ID: ${data.syncId}`);
        setFormData(prev => ({
          ...prev,
          client_name: '',
          mobile: '',
          email: '',
          amount: '',
          remarks: ''
        }));
      }
    } catch (e) {
      toast.error("Sync Failure with Neural Matrix");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setFormData({
      ...formData,
      client_name: "Amit Malhotra",
      mobile: "9812345678",
      email: "amit.m@gmail.com",
      city: "Delhi",
      loan_type: "Personal Loan",
      amount: "750000",
      preferred_bank: "HDFC",
      employment_type: "Salaried",
      remarks: "Urgent personal loan for medical emergency."
    });
    toast.info("Demo data loaded into matrix");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
           <Badge className="bg-orange-500/10 text-orange-500 border-none text-[8px] font-black uppercase mb-1 tracking-widest">
             Neural Intake Engine V3.0
           </Badge>
           <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Smart Intake Matrix</h1>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase">Bulbhul AI Verified</Badge>
          <Badge className="bg-sky-500/10 text-sky-500 border-none text-[8px] font-black uppercase">GAS Bridge Active</Badge>
        </div>
      </div>

      <Card className="bg-slate-900 border-white/5 overflow-hidden">
        <div className="bg-gradient-to-br from-[#1f3550] to-[#0a131d] p-6 border-b border-white/5">
           <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
             <div className="space-y-1">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Master Lead Capture</p>
               <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Divyanshi Capital Universal Form</h2>
             </div>
             <Button variant="outline" onClick={fillDemo} className="bg-white/5 border-white/10 text-white rounded-xl h-10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Autofill Matrix
             </Button>
           </div>
        </div>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entry Type</label>
              <select 
                className="w-full h-12 bg-black/20 border border-white/5 rounded-2xl px-4 text-xs text-white outline-none focus:border-orange-500/50 transition-all"
                value={formData.entry_type}
                onChange={(e) => setFormData({...formData, entry_type: e.target.value})}
              >
                <option value="STAFF_ENTRY">Staff Entry</option>
                <option value="SALES_LEAD">Sales Lead</option>
                <option value="CLIENT_ENTRY">Client Entry</option>
                <option value="VISITOR_ENTRY">Visitor Entry</option>
                <option value="BANKER_ENTRY">Banker Entry</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Source Agent</label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full h-12 bg-black/20 border border-white/5 rounded-2xl px-10 text-xs text-white outline-none font-bold"
                  value={`${formData.sales_name} (${formData.emp_code})`}
                  disabled
                />
                <Briefcase className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name *</label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-xs text-white outline-none focus:border-orange-500/50 transition-all"
                  placeholder="Enter client name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number *</label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-xs text-white outline-none focus:border-orange-500/50 transition-all"
                  placeholder="10 digit mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                />
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email"
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-xs text-white outline-none focus:border-orange-500/50 transition-all hover:bg-white/[0.05]"
                  placeholder="e.g. client@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">City / Location</label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-xs text-white outline-none focus:border-orange-500/50 transition-all"
                  placeholder="e.g. Delhi NCR"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Loan Type</label>
              <div className="relative">
                <select 
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-xs text-white outline-none focus:border-orange-500/50 transition-all appearance-none"
                  value={formData.loan_type}
                  onChange={(e) => setFormData({...formData, loan_type: e.target.value})}
                >
                  <option value="">Select Service</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="LAP">Loan Against Property</option>
                </select>
                <Coins className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Required Amount</label>
              <input 
                type="text"
                className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-4 text-xs text-white outline-none focus:border-orange-500/50 transition-all"
                placeholder="e.g. 500000"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Preferred Bank</label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-xs text-white outline-none focus:border-orange-500/50 transition-all font-bold"
                  placeholder="HDFC / ICICI / Axis"
                  value={formData.preferred_bank}
                  onChange={(e) => setFormData({...formData, preferred_bank: e.target.value})}
                />
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Case Remarks / Bulbhul Instructions</label>
              <textarea 
                className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-orange-500/50 transition-all resize-none"
                placeholder="Enter client profile notes for Bulbhul AI summary..."
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-orange-500/20 group"
              >
                {loading ? "Routing through Neural Bridge..." : "Submit Entry to Matrix"}
                {!loading && <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
               <History className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-black text-white uppercase italic">Real-time Buffer</p>
               <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Status: Ready</p>
            </div>
         </div>
         <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
               <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-black text-white uppercase italic">Verified Assets</p>
               <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Status: Active</p>
            </div>
         </div>
         <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
               <Clock className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-black text-white uppercase italic">Latency Check</p>
               <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">120ms Sync Speed</p>
            </div>
         </div>
      </div>
    </div>
  );
}
