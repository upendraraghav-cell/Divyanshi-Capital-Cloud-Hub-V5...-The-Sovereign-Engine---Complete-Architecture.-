import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Send, User, Phone, Mail, MapPin, Building, IndianRupee, FileText, Plus, ChevronDown } from 'lucide-react';
import { gasService } from '@/services/gasService';
import { toast } from 'sonner';

export const SmartForm: React.FC<{ user?: any }> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState('SALES'); // SALES, HR, VISITOR

  const [formData, setFormData] = useState({
    client_name: '',
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
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  required
                  name="client_name"
                  placeholder="Full Legal Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  required
                  name="mobile"
                  placeholder="Validated Mobile (10 Digits)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  name="email"
                  placeholder="Primary Email Address"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all"
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  name="city"
                  placeholder="Serving City"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all"
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
                  <div className="relative">
                    <select 
                      name="loan_type"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-10 text-sm text-slate-200 appearance-none focus:outline-none focus:border-orange-500/50 transition-all"
                      onChange={handleChange}
                    >
                      <option>Personal Loan</option>
                      <option>Business Loan</option>
                      <option>Home Loan</option>
                      <option>LAP (Loan Against Property)</option>
                      <option>Credit Card</option>
                      <option>Car Loan</option>
                      <option>Education Loan</option>
                      <option>Gold Loan</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-600 ml-2">Preferred Bank</label>
                  <div className="relative">
                    <select 
                      name="bank"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-10 text-sm text-slate-200 appearance-none focus:outline-none focus:border-orange-500/50 transition-all"
                      onChange={handleChange}
                    >
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra</option>
                      <option>SBI</option>
                      <option>IDFC First</option>
                      <option>Standard Chartered</option>
                      <option>IndusInd Bank</option>
                      <option>Bajaj Finserv</option>
                      <option>Tata Capital</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="relative group">
                <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  required
                  name="amount"
                  placeholder="Required Amount"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  name="rm_mail"
                  placeholder="Relationship Manager ID"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all"
                  onChange={handleChange}
                />
              </div>

              <div className="relative group">
                <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  name="docs_link"
                  placeholder="Master Doc Link (G-Drive/P1)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all"
                  onChange={handleChange}
                />
              </div>

              {formType === 'HR' && (
                <div className="relative group">
                  <Plus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    name="resume_link"
                    placeholder="Resume Matrix Link"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 transition-all font-mono"
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
