/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Ghost, ShieldCheck, Zap, Activity, Radio, AlertCircle, CheckCircle2, History, Target, TrendingUp, Users, MessageSquare, FileSearch, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { db, auth, doc, onSnapshot, updateDoc, setDoc, collection, query, orderBy, limit, addDoc, serverTimestamp } from '@/lib/firebase';
import { toast } from 'sonner';

const MODES = [
  { id: 'Assist', icon: ShieldCheck, description: 'AI Assist: Real-time business guidance.', color: 'text-emerald-400' },
  { id: 'Shadow', icon: Ghost, description: 'Audit Shadow: Background system checks.', color: 'text-purple-400' },
  { id: 'Delegated', icon: Zap, description: 'SaaS Pro: Automated lead & data analysis.', color: 'text-amber-400' },
  { id: 'Safe', icon: Radio, description: 'Policy Guard: Checks against business rules.', color: 'text-blue-400' },
];

export function AvatarDashboard() {
  const [settings, setSettings] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const settingsRef = doc(db, 'users', auth.currentUser.uid, 'avatar', 'settings');
    const actionsRef = collection(db, 'users', auth.currentUser.uid, 'avatar', 'actions');
    const actionsQuery = query(actionsRef, orderBy('timestamp', 'desc'), limit(10));
    const approvalsRef = collection(db, 'users', auth.currentUser.uid, 'avatar', 'approvals');

    const unsubSettings = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      } else {
        setDoc(settingsRef, {
          mode: 'Assist',
          autoResponseEnabled: false,
          personalityTraits: ['Professional', 'Analytical', 'Efficient', 'User-Focused'],
          monthlyTarget: 5000000,
          currentRevenue: 1240000
        }, { merge: true }).catch(() => {});
      }
      setIsLoading(false);
    });

    const unsubActions = onSnapshot(actionsQuery, (snapshot) => {
      setActions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubApprovals = onSnapshot(approvalsRef, (snapshot) => {
      setPendingApprovals(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubSettings();
      unsubActions();
      unsubApprovals();
    };
  }, []);

  const changeMode = async (mode: string) => {
    if (!auth.currentUser) return;
    try {
      const settingsRef = doc(db, 'users', auth.currentUser.uid, 'avatar', 'settings');
      await updateDoc(settingsRef, { mode });
      toast.success(`LAILA switched to ${mode} mode`);
    } catch (error) {
      toast.error("Failed to switch mode");
    }
  };

  const handleApproval = async (id: string, approved: boolean) => {
    if (!auth.currentUser) return;
    try {
      const approvalRef = doc(db, 'users', auth.currentUser.uid, 'avatar', 'approvals', id);
      const actionsRef = collection(db, 'users', auth.currentUser.uid, 'avatar', 'actions');
      const approval = pendingApprovals.find(a => a.id === id);

      if (approved) {
        await addDoc(actionsRef, {
          type: 'Node Auth',
          summary: `Boss approved: ${approval.summary}`,
          timestamp: serverTimestamp(),
          status: 'completed'
        });
        toast.success("LAILA: Integration finalized, Boss!");
      } else {
        toast.info("LAILA: Integration deferred.");
      }
      
      await setDoc(approvalRef, { status: approved ? 'approved' : 'rejected' }, { merge: true });
    } catch (error) {
      console.error(error);
    }
  };

  const auditPolicy = async () => {
    if (!auth.currentUser) return;
    toast.info("LAILA is auditing latest QDN enterprise nodes...");
    
    setTimeout(async () => {
      const approvalsRef = collection(db, 'users', auth.currentUser!.uid, 'avatar', 'approvals');
      await addDoc(approvalsRef, {
        type: 'Node Update',
        summary: 'Stripe has released a new optimization webhook. Should I sync all QDN payment nodes? BOSS?',
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      toast.success("LAILA found a node optimization. Check 'Boss Approvals'.");
    }, 1500);
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground italic">LAILA is syncing with QDN Enterprise Matrix...</div>;

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6 text-left">
        {/* Business Header */}
        <div className="glass-panel border-[#43a4ff]/20 p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-[#43a4ff]/5 border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#43a4ff] flex items-center gap-2">
              <Scale className="w-3 h-3" />
              SaaS Advisor Desk
            </h4>
            <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/50 text-[9px] px-2 py-0">
              System Optimized
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold text-white tracking-tighter italic uppercase">LAILA SaaS Engine</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">v4.0.2 Active</span>
            </div>
            
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              Currently monitoring operational flow across all business nodes to ensure maximum ROI and conversion alignment.
            </p>
          </div>
        </div>

        {/* Master Confirmation Loop */}
        {pendingApprovals.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
              <Users className="w-3 h-3 animate-bounce" />
              Boss, Operational Directive Needed
            </h4>
            {pendingApprovals.filter(a => !a.status || a.status === 'pending').map((approval) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel border-amber-500/30 p-4 rounded-2xl bg-amber-500/5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-500 uppercase">{approval.type}</Badge>
                  <span className="text-[9px] text-muted-foreground ml-auto uppercase tracking-tighter">Node Optimization Req</span>
                </div>
                <p className="text-[11px] text-white leading-relaxed font-bold tracking-tight italic">"{approval.summary}"</p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold h-8 text-[11px]"
                    onClick={() => handleApproval(approval.id, true)}
                  >
                    Confirm Node
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl border-amber-500/30 text-amber-500 hover:bg-amber-500/10 h-8 text-[11px]"
                    onClick={() => handleApproval(approval.id, false)}
                  >
                    Defer Node
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Operational Modes */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#39CCCC] flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Advisor Protocol
            </h4>
            <div className="flex gap-2">
              <Button 
                size="xs" 
                variant="outline" 
                className="h-6 text-[9px] bg-white/5 border-[#39CCCC]/20 hover:bg-[#39CCCC]/10 text-[#39CCCC] font-bold"
                onClick={auditPolicy}
              >
                Audit Policies
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map((mode) => (
              <Button
                key={mode.id}
                variant={settings?.mode === mode.id ? 'secondary' : 'outline'}
                className={`h-auto py-3 px-4 flex flex-col items-start gap-1 glass-panel border-white/5 transition-all ${
                  settings?.mode === mode.id ? 'bg-white/10 ring-1 ring-[#39CCCC]/40 scale-[1.02]' : 'hover:bg-white/5'
                }`}
                onClick={() => changeMode(mode.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <mode.icon className={`w-4 h-4 ${mode.color}`} />
                  <span className="font-bold text-xs">{mode.id}</span>
                  {settings?.mode === mode.id && <div className="ml-auto w-1.5 h-1.5 bg-[#39CCCC] rounded-full animate-ping" />}
                </div>
                <span className="text-[10px] text-muted-foreground text-left leading-tight">{mode.description}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Personality traits */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#43a4ff] mb-4 flex items-center gap-2">
            <Scale className="w-3 h-3" />
            AGI Personality
          </h4>
          <div className="flex flex-wrap gap-2 text-left">
            {['Professional', 'Analytical', 'Efficient', 'User-Focused', 'ROI-Oriented', 'Scalable'].map(trait => (
              <Badge 
                key={trait} 
                variant={settings?.personalityTraits?.includes(trait) ? 'default' : 'outline'}
                className={`cursor-pointer transition-all text-[10px] py-1 ${
                  settings?.personalityTraits?.includes(trait) ? 'bg-[#43a4ff]/20 text-[#43a4ff] border-[#43a4ff]/50' : 'bg-white/5 border-white/10'
                }`}
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Continuity Log */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <History className="w-3 h-3" />
            Enterprise Operational Log
          </h4>
          <div className="space-y-3">
            {actions.length === 0 ? (
              <div className="text-[10px] italic text-muted-foreground bg-white/5 border border-dashed border-white/10 p-4 rounded-xl text-center">
                No advisory operations recorded yet.
              </div>
            ) : (
              actions.map((action, i) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel border-white/5 p-3 rounded-xl flex gap-3 items-start"
                >
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    action.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-white">{action.type}</span>
                      <span className="text-[9px] text-muted-foreground uppercase">{action.status}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{action.summary}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
