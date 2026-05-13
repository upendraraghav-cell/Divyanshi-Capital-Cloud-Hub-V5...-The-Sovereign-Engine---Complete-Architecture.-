import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Send, User, Phone, Mail, MapPin, Building, IndianRupee, FileText, Plus, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { gasService } from '@/services/gasService';
import { toast } from 'sonner';

export const SmartForm: React.FC<{ user?: any }> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState('SALES'); // SALES, HR, VISITOR

  const [formData, setFormData] = useState({
    client_name: '',
    mother_name: '',
    mobile: '',
    email: user?.email || '',
    city: '',
    loan_type: 'Personal Loan',
    bank: 'HDFC',
    amount: '',
    task_category: 'New Lead',
    rm_mail: user?.email || '',
    docs_link: '',
    remarks: '',
    referral_id: user?.personalFileId || '',
    hr_status: 'PENDING'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const toastId = toast.loading("Syncing with Neural Matrix...");
    
    try {
      const { mobile, ...rest } = formData;
      const response = await gasService.createWebLead({
        ...rest,
        client_mobile: mobile,
        emp_code: user?.userName || localStorage.getItem('mallik_emp_code') || '',
        source: 'GENIE_CRM_V4'
      });

      if (response.ok) {
        toast.success(`Payload Secure: Lead ${response.lid || ''} synchronized with HQ.`, { id: toastId });
        setFormData({
          client_name: '',
          mother_name: '',
          mobile: '',
          email: user?.email || '',
          city: '',
          loan_type: 'Personal Loan',
          bank: 'HDFC',
          amount: '',
          task_category: 'New Lead',
          rm_mail: user?.email || '',
          docs_link: '',
          remarks: '',
          referral_id: user?.personalFileId || '',
          hr_status: 'PENDING'
        });
      } else {
        toast.error("Bridge Failure: " + (response.error || "Unauthorized access. Invalid API Key."), { id: toastId });
      }
    } catch (err) {
      toast.error("Neural Fracture detected.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sovereign Data Entry</h2>
          <p className="text-sm text-slate-500 font-mono">GENIE_FORM_ENGINE_V4.0</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          {['SALES', 'HR', 'GUEST'].map((type) => (
            <button
              key={type}
              onClick={() => setFormType(type)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                formType === type ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Group 1: Identity */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-slate-800 pb-2">Client Identity</h3>
            
            <div className="space-y-4">
              <div className="relative group">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 z-10 transition-colors" />
                <Input 
                  required
                  name="client_name"
                  placeholder="Full Legal Name"
                  className="h-12 bg-slate-950 border-slate-800 rounded-xl pl-10 text-sm text-slate-200 placeholder:text-slate-700"
                  value={formData.client_name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 z-10 transition-colors" />
                <Input 
                  required
                  name="mother_name"
                  placeholder="Mother's Name (Bank Unique ID)"
                  className="h-12 bg-slate-950 border-slate-800 rounded-xl pl-10 text-sm text-slate-200 placeholder:text-slate-700"
                  value={formData.mother_name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 z-10 transition-colors" />
                <Input 
                  required
                  name="mobile"
                  placeholder="Validated Mobile (10 Digits)"
                  className="h-12 bg-slate-950 border-slate-800 rounded-xl pl-10 text-sm text-slate-200 placeholder:text-slate-700 font-mono"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 z-10 transition-colors" />
                <Input 
                  name="email"
                  placeholder="Primary Email Address"
                  className="h-12 bg-slate-950 border-slate-800 rounded-xl pl-10 text-sm text-slate-200 placeholder:text-slate-700"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 z-10 transition-colors" />
                <Input 
                  name="city"
                  placeholder="Serving City"
                  className="h-12 bg-slate-950 border-slate-800 rounded-xl pl-10 text-sm text-slate-200 placeholder:text-slate-700"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Group 2: Product Intelligence */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-slate-800 pb-2">Business Intelligence</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-600 ml-2">Loan Type</label>
                  <Select 
                    value={formData.loan_type} 
                    onValueChange={(val) => handleSelectChange('loan_type', val)}
                  >
                    <SelectTrigger className="h-12 bg-slate-950 border-slate-800 rounded-xl px-4 text-sm text-slate-200 w-full">
                      <SelectValue placeholder="Select Loan Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                      <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                      <SelectItem value="Business Loan">Business Loan</SelectItem>
                      <SelectItem value="Home Loan">Home Loan</SelectItem>
                      <SelectItem value="LAP (Loan Against Property)">LAP (Loan Against Property)</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Car Loan">Car Loan</SelectItem>
                      <SelectItem value="Education Loan">Education Loan</SelectItem>
                      <SelectItem value="Gold Loan">Gold Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-600 ml-2">Preferred Bank</label>
                  <Select 
                    value={formData.bank} 
                    onValueChange={(val) => handleSelectChange('bank', val)}
                  >
                    <SelectTrigger className="h-12 bg-slate-950 border-slate-800 rounded-xl px-4 text-sm text-slate-200 w-full">
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                      <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                      <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                      <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                      <SelectItem value="Kotak Mahindra">Kotak Mahindra</SelectItem>
                      <SelectItem value="SBI">SBI</SelectItem>
                      <SelectItem value="IDFC First">IDFC First</SelectItem>
                      <SelectItem value="Standard Chartered">Standard Chartered</SelectItem>
                      <SelectItem value="IndusInd Bank">IndusInd Bank</SelectItem>
                      <SelectItem value="Bajaj Finserv">Bajaj Finserv</SelectItem>
                      <SelectItem value="Tata Capital">Tata Capital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="relative group">
                <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 z-10 transition-colors" />
                <Input 
                  required
                  name="amount"
                  placeholder="Required Amount"
                  className="h-12 bg-slate-950 border-slate-800 rounded-xl pl-10 text-sm text-slate-200 placeholder:text-slate-700 font-mono"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 z-10 transition-colors" />
                <Input 
                  name="rm_mail"
                  placeholder="Relationship Manager ID"
                  className="h-12 bg-slate-950 border-slate-800 rounded-xl pl-10 text-sm text-slate-200 placeholder:text-slate-700"
                  value={formData.rm_mail}
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 z-10 transition-colors" />
                <Input 
                  name="docs_link"
                  placeholder="Master Doc Link (G-Drive/P1)"
                  className="h-12 bg-slate-950 border-slate-800 rounded-xl pl-10 text-sm text-slate-200 placeholder:text-slate-700"
                  value={formData.docs_link}
                  onChange={handleChange}
                />
              </div>

              {formType === 'HR' && (
                <div className="relative group">
                  <Plus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 z-10 transition-colors" />
                  <Input 
                    name="resume_link"
                    placeholder="Resume Matrix Link"
                    className="h-12 bg-slate-950 border-slate-800 rounded-xl pl-10 text-sm text-slate-200 placeholder:text-slate-700"
                    value={(formData as any).resume_link || ''}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-600 ml-2">Strategic Remarks</label>
            <textarea 
              name="remarks"
              rows={3}
              placeholder="Case Intelligence, profile notes, or pended documents..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all resize-none"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-900/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
            Synchronize Payload
          </button>
          
          <button 
            type="button"
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all flex items-center justify-center gap-3"
          >
            <Save size={20} />
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
};
