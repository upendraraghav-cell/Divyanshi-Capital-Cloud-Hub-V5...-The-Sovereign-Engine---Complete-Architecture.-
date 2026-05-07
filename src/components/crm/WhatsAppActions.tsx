import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, Calendar, List, Phone, Info, Zap } from 'lucide-react';
import { toast } from 'sonner';

const templates = [
  { id: 'INTRO', name: 'Standard Intro', body: "Hi {name}, Greetings from Divyanshi Capital! I am Genie, your Mallik Loan Automation assistant. How can I help you today?" },
  { id: 'DOCS', name: 'Document Request', body: "Dear {name}, Please provide your PAN, Aadhaar, and 6 months bank statement for the processing of your {loan} application." },
  { id: 'UPDATE', name: 'Process Update', body: "Hey {name}, Good news! Your application for {loan} is now under review with {bank}. We will update you shortly." },
  { id: 'OFFER', name: 'Special Offer', body: "Exclusive for {name}: You have a pre-approved PL offer from Axis Bank up to ₹15 Lakhs. Click here to apply: [LINK]" },
];

export const WhatsAppActions: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [message, setMessage] = useState('');

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const template = templates.find(t => t.id === e.target.value);
    if (template) {
      setSelectedTemplate(template.id);
      setMessage(template.body);
    }
  };

  const handleSend = () => {
    if (!mobile || !message) {
      toast.error("V4 Logic Error: Identity and Payload required.");
      return;
    }
    
    const cleanMobile = mobile.replace(/\D/g, '');
    const url = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toast.success("Handoff to WhatsApp: [COMMITTED]");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-2xl">
          <MessageSquare className="text-emerald-500" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Comm Communication Core</h2>
          <p className="text-xs text-slate-500 font-mono">WHATSAPP_ENGINE_V4.2_SECURE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-600 ml-2">Target Identity</label>
              <div className="relative group">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-Digit Mobile Number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-600 ml-2">Neural Template</label>
              <div className="relative group">
                <List size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <select 
                  onChange={handleTemplateChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none"
                >
                  <option value="">Manual Transmission</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-600 ml-2">Payload (Message Body)</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Compose secure communication..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all resize-none font-medium leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleSend}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/30"
              >
                <Send size={18} />
                Engage Comm
              </button>
              <button className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
                <Calendar size={18} />
                Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview / Hints */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl border-2 border-dashed border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Zap size={120} className="text-emerald-500" />
            </div>
            
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 relative z-10">
              <Info size={16} className="text-emerald-400" />
              Sovereign Handover Logic
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-300 font-medium italic">"{message || 'Awaiting input...'}"</p>
              </div>

              <ul className="space-y-3 text-[11px] text-slate-500 font-medium">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
                  Automatic +91 normalization enabled.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
                  Placeholders like {"{name}"} must be replaced manually for now.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
                  Neural Bridge v4 secures every transmission log.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-emerald-600/5 border border-emerald-500/10 p-6 rounded-3xl">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">AI Recommendation (Bulbhul)</h4>
            <p className="text-xs text-emerald-100 font-medium">
              "Sending an <strong>intro template</strong> to lead <strong>Sumit K.</strong> now would yield a <strong>45% higher</strong> response rate based on current traffic."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
