import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Contact, 
  Send, 
  UserPlus, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  MoreHorizontal, 
  CalendarClock 
} from 'lucide-react';
import { FollowUpDialog } from './FollowUpDialog';
import { gasService } from '@/services/gasService';

const contactData = [
  { name: 'Sumit Kumar', role: 'Premium Partner', city: 'Delhi', mobile: '9876543210', email: 'sumit@partner.com', initial: 'S' },
  { name: 'Anjali Sharma', role: 'DSA Lead', city: 'Mumbai', mobile: '8765432109', email: 'anjali@dsa.com', initial: 'A' },
  { name: 'Vikram Singh', role: 'HDFC RM', city: 'Gurgaon', mobile: '7654321098', email: 'vikram@hdfc.com', initial: 'V' },
  { name: 'Priya Verma', role: 'Candidate', city: 'Noida', mobile: '6543210987', email: 'priya@career.com', initial: 'P' },
];

export const BusinessCards: React.FC = () => {
  const [followUpTarget, setFollowUpTarget] = useState<{name: string, email: string, role: string} | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await gasService.getTeam();
        if (response.ok && response.data) {
          setContacts(response.data);
        }
      } catch (e) {
        console.error("Team Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Intelligence Registry</h2>
          <p className="text-xs text-slate-500 font-mono">CONTACT_GRID_V4.LATEST</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {contacts.map((contact, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden"
          >
            {/* The Actual Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative z-10 transition-all group-hover:border-orange-500/50 group-hover:bg-slate-900/80 shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-orange-900/30">
                  {contact.name?.charAt(0) || 'U'}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-950 text-slate-500 hover:text-white rounded-lg">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-xl font-bold text-white tracking-tight">{contact.name}</h3>
                <p className="text-xs font-mono text-orange-500 uppercase tracking-widest leading-none">{contact.role}</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-400">
                  <Phone size={14} className="text-slate-600" />
                  <span className="text-xs font-mono tracking-tighter">{contact.mobile || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail size={14} className="text-slate-600" />
                  <span className="text-xs truncate">{contact.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin size={14} className="text-slate-600" />
                  <span className="text-xs">{contact.city || 'India'}, IN</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800 mb-3">
                <button className="flex items-center justify-center gap-2 py-2.5 bg-slate-950 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-xl transition-all border border-slate-800 group-hover:border-slate-700">
                  <Contact size={14} />
                  Save Contact
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl transition-all shadow-lg shadow-emerald-900/10">
                  <Send size={14} />
                  Forward WA
                </button>
              </div>

              <button 
                onClick={() => setFollowUpTarget({ name: contact.name, email: contact.email, role: contact.role })}
                className="w-full flex items-center justify-center gap-2 py-3 bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/20 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
              >
                <CalendarClock size={16} />
                Set Follow-Up
              </button>
            </div>

            {/* Decorative BG element */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-all"></div>
          </motion.div>
        ))}
      </div>

      <FollowUpDialog 
        isOpen={!!followUpTarget}
        onClose={() => setFollowUpTarget(null)}
        target={followUpTarget}
      />
    </div>
  );
};
