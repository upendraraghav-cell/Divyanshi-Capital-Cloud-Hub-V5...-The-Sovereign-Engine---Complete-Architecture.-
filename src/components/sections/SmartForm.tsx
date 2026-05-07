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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ActivityService } from '@/services/activityService';

export function SmartForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    entry_type: 'SALES_LEAD',
    source_name: 'INTERNAL_APP',
    emp_code: user?.empCode || user?.personalFileId || 'EMP001',
    sales_name: user?.name || user?.displayName || 'Mallik',
    client_name: '',
    mobile: '',
    email: '',
    city: '',
    loan_type: '',
    amount: '',
    preferred_bank: '',
    follow_up_date: '',
    follow_up_time: '10:00',
    reminder_type: 'CALL',
    employment_type: 'Salaried',
    status: 'PENDING',
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

    if (formData.follow_up_date) {
      const selectedDate = new Date(formData.follow_up_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        toast.error("Follow-up date must be in the future");
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
          form_name: formData.entry_type === 'STAFF_ENTRY' ? 'HR' : 'SALES',
          source: 'SMART_FORM_V3',
          timestamp: new Date().toISOString()
        })
      });
      
      const data = await res.json();
      if (data.ok) {
        // Log to Neural Activity Matrix
        const activityMsg = `Lead Matrix Latch: ${formData.client_name} - ${formData.loan_type || 'General'} via ${formData.sales_name}`;
        ActivityService.log('intelligence', activityMsg);

        toast.success(`${data.routingStatus}`);
        if (data.routingStatus === 'SMART_FORM_FLOW_ACTIVE') {
          toast.info("Bulbhul AI Advise: " + (data.advice?.substring(0, 100) || "Processing..."));
        }
        setFormData(prev => ({
          ...prev,
          client_name: '',
          mobile: '',
          email: '',
          amount: '',
          follow_up_date: '',
          follow_up_time: '10:00',
          reminder_type: 'CALL',
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
      client_name: "Rohan Bhatia",
      mobile: "9876543210",
      email: "rohan@example.com",
      city: "Delhi",
      loan_type: "Personal Loan",
      amount: "650000",
      preferred_bank: "HDFC",
      employment_type: "Salaried",
      status: "SEND TO LOGIN",
      remarks: "Smart form demo lead for P1 processing."
    });
    toast.info("Demo data loaded into matrix");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
           <Badge className="bg-orange-500/10 text-orange-500 border-none text-[8px] font-black uppercase mb-1 tracking-widest flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
             Neural Intake Engine V3.0
           </Badge>
           <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Smart Intake Matrix</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase">Bulbhul AI Verified</Badge>
            <Badge className="bg-sky-500/10 text-sky-500 border-none text-[8px] font-black uppercase">Self-Healing Active</Badge>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">P1 Master Bridge Protocol</p>
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
                <option value="STAFF_ENTRY">Staff Entry (HR)</option>
                <option value="SALES_LEAD">Sales Lead (MIS)</option>
                <option value="CLIENT_ENTRY">Client Entry</option>
                <option value="VISITOR_ENTRY">Visitor Entry</option>
                <option value="BANKER_ENTRY">Banker Entry</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Status</label>
              <select 
                className="w-full h-12 bg-black/20 border border-white/5 rounded-2xl px-4 text-xs text-white outline-none focus:border-orange-500/50 transition-all"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="PENDING">Pending</option>
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="SEND TO LOGIN">Send to Login (AI Advisor)</option>
                <option value="DOCUMENT_PENDING">Document Pending</option>
                <option value="REJECTED">Rejected</option>
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
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Loan Type (P1 Matrix)</label>
              <div className="relative">
                <select 
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-xs text-white outline-none focus:border-orange-500/50 transition-all appearance-none"
                  value={formData.loan_type}
                  onChange={(e) => setFormData({...formData, loan_type: e.target.value})}
                >
                  <option value="">Select Service</option>
                  <option value="Personal Loan">Personal Loan (PL)</option>
                  <option value="Business Loan">Business Loan (BL)</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Loan Against Peroperty">Loan Against Peroperty (LAP)</option>
                  <option value="Auto Loan">Auto Loan</option>
                  <option value="Education Loan">Education Loan</option>
                  <option value="Gold Loan">Gold Loan</option>
                  <option value="Working Capital">Working Capital</option>
                  <option value="Cash Credit (CC)">Cash Credit (CC)</option>
                  <option value="Commercial Vehicle Loan">Commercial Vehicle Loan</option>
                  <option value="Two Wheeler Loan">Two Wheeler Loan</option>
                  <option value="Mortgage Loan">Mortgage Loan</option>
                  <option value="Invoice Discounting">Invoice Discounting</option>
                  <option value="Construction Equipment Loan">Construction Equipment Loan</option>
                  <option value="professional">Professional Loan</option>
                </select>
                <Coins className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Preferred Banks (Comma Separated: e.g. HDFC, ICICI)</label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-xs text-white outline-none focus:border-orange-500/50 transition-all font-bold placeholder:text-slate-700"
                  placeholder="HDFC, ICICI, AXIS, SBI..."
                  value={formData.preferred_bank}
                  onChange={(e) => setFormData({...formData, preferred_bank: e.target.value})}
                />
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Follow-up Date & Time</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="date"
                    className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-xs text-white outline-none focus:border-orange-500/50 transition-all font-bold [color-scheme:dark]"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})}
                  />
                  <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <input 
                  type="time"
                  className="w-32 h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-4 text-xs text-white outline-none focus:border-orange-500/50 transition-all font-bold [color-scheme:dark]"
                  value={formData.follow_up_time}
                  onChange={(e) => setFormData({...formData, follow_up_time: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reminder Type</label>
              <select 
                className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-4 text-xs text-white outline-none focus:border-orange-500/50 transition-all appearance-none"
                value={formData.reminder_type}
                onChange={(e) => setFormData({...formData, reminder_type: e.target.value})}
              >
                <option value="CALL">Voice Call Reminder</option>
                <option value="WHATSAPP">WhatsApp Message</option>
                <option value="EMAIL">Email Notification</option>
                <option value="MEETING">Physical Meeting</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Required Amount *</label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-10 text-xs text-white outline-none focus:border-orange-500/50 transition-all font-black text-orange-500"
                  placeholder="Enter Loan Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
                <Coins className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
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
    </div>
  );
}
