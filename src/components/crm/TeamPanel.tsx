import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Mail, Phone, MessageSquare, Star, ArrowRight, CalendarClock } from 'lucide-react';
import { FollowUpDialog } from './FollowUpDialog';
import { gasService } from '@/services/gasService';

const teamData = [
  { section: 'Sales Team', color: 'bg-blue-500', members: [
    { name: 'Khushboo', role: 'Sales Manager', email: 'khushboo@divyanshicapital.com', online: true },
    { name: 'Upendra Raghav', role: 'Strategic Head', email: 'upendra.raghav@divyanshicapital.com', online: true },
  ]},
  { section: 'HR Matrix', color: 'bg-purple-500', members: [
    { name: 'HR Desk', role: 'Recruitment', email: 'hr@divyanshicapital.com', online: false },
  ]},
  { section: 'Management Core', color: 'bg-orange-500', members: [
    { name: 'Sovereign MD', role: 'Executive', email: 'md@divyanshicapital.com', online: true },
  ]}
];

export const TeamPanel: React.FC = () => {
  const [followUpTarget, setFollowUpTarget] = useState<{name: string, email: string, role: string} | null>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await gasService.getTeam();
        if (response.ok && response.data) {
          setTeam(response.data);
        }
      } catch (e) {
        console.error("Team Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Group team members by role category
  const categories = [
    { name: 'Management', roles: ['Managing Director', 'Founder', 'MD', 'CFO', 'Partner Management', 'Boss'] },
    { name: 'Sales Core', roles: ['Sales Manager', 'Coordinator Head', 'Sales', 'Platinum', 'Partners'] },
    { name: 'Operations', roles: ['HR', 'Coordinator', 'Management'] },
  ];

  const groupedTeam = categories.map(cat => ({
    section: cat.name,
    color: cat.name === 'Management' ? 'bg-orange-500' : cat.name === 'Sales Core' ? 'bg-blue-500' : 'bg-purple-500',
    members: team.filter(m => cat.roles.includes(m.role))
  })).filter(g => g.members.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic">Sovereign Alliance</h2>
          <p className="text-sm text-slate-500 font-mono">PEOPLE_MATRIX_V4.0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {groupedTeam.length > 0 ? (
          groupedTeam.map((group, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-10 rounded-full ${group.color}`}></div>
                <h3 className="text-lg font-bold text-slate-200">{group.section}</h3>
                <div className="flex-1 border-b border-slate-800"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.members.map((member, j) => (
                  <motion.div 
                    key={j}
                    whileHover={{ y: -5 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative group"
                  >
                    <div className="absolute top-6 right-6">
                      <div className={`w-2.5 h-2.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}></div>
                    </div>

                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-xl font-bold text-orange-400 mb-6 border border-slate-700">
                      {member.name?.charAt(0) || 'U'}
                    </div>

                    <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">{member.role}</p>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button className="flex-1 p-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all">
                          <Mail size={16} className="mx-auto" />
                        </button>
                        <button className="flex-1 p-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 rounded-xl transition-all">
                          <MessageSquare size={16} className="mx-auto" />
                        </button>
                        <button className="flex-1 p-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-blue-400 rounded-xl transition-all">
                          <Phone size={16} className="mx-auto" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => setFollowUpTarget({ name: member.name, email: member.email, role: member.role })}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/10"
                      >
                        <CalendarClock size={16} />
                        Set Follow-Up
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
            <Users size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-mono uppercase text-xs tracking-widest">No Node Detected in Matrix Registry</p>
          </div>
        )}
      </div>

      <FollowUpDialog 
        isOpen={!!followUpTarget}
        onClose={() => setFollowUpTarget(null)}
        target={followUpTarget}
      />
    </div>
  );
};
