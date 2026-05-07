import { Users as UsersIcon, Briefcase, Shield, Star, MoreVertical, Mail, Phone, Sparkles, CheckCircle2, AlertCircle, Clock, Plus, Bot, Link2, Ghost, Database, Fingerprint } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getSuperAGIResponse } from '@/lib/gemini';
import { db, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, doc, handleFirestoreError, OperationType, auth, getDoc, setDoc } from '@/lib/firebase';
import { ALL_EMPLOYEES, Employee } from '@/data/staff';

export function Users() {
  const [isAiAssigning, setIsAiAssigning] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [authUsers, setAuthUsers] = useState<any[]>([]);
  const [isImplementing, setIsImplementing] = useState<string | null>(null);

  // Filter for Divyanshi Capital Loan OS (P1 Master)
  const masterEmployees = ALL_EMPLOYEES; // Show all from the list provided by user

  useEffect(() => {
    // Fetch live users from Firestore to find unassigned nodes
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAuthUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleSmartAssign = async () => {
    setIsAiAssigning(true);
    try {
      const context = masterEmployees.map(e => `${e.name} (${e.role})`).join(', ');
      const prompt = `Based on these employees: ${context}, pick the best 'Project Leader' for a new P1 Master Registry expansion. Return JSON: {"name": "Name", "reason": "Reason"}`;
      const res = await getSuperAGIResponse(prompt, [], 'LAILA', 'BOSS');
      const textRes = (res as any).text();
      const data = JSON.parse(textRes.replace(/```json|```/g, '').trim());
      const emp = masterEmployees.find(e => e.name === data.name) || masterEmployees[0];
      setSuggestion({ ...emp, aiReason: data.reason });
    } catch (e) {
      console.error("LAILA Error:", e);
      toast.error("LAILA connection stuttered. Using default mapping.");
      setSuggestion({ ...masterEmployees[0], aiReason: "Optimized for high-availability." });
    } finally {
      setIsAiAssigning(false);
    }
  };

  const implementRegistryId = async (user: any) => {
    setIsImplementing(user.id);
    try {
      const generatedId = `NEW-${user.role.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await updateDoc(doc(db, 'users', user.id), {
        personalFileId: generatedId,
        status: 'ACTIVE_REGISTRY'
      });
      toast.success(`Registry ID ${generatedId} provisioned for ${user.displayName}`);
    } catch (error) {
      toast.error("Failed to provision Registry ID");
    } finally {
      setIsImplementing(null);
    }
  };

  // Find users who logged in but are NOT in the pre-defined staff list (GUEST-NODE)
  const unregisteredUsers = authUsers.filter(u => 
    u.personalFileId === 'GUEST-NODE' || 
    !masterEmployees.some(e => e.email === u.email)
  );

  return (
    <div className="space-y-8 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Personnel Registry</h2>
          <div className="flex items-center gap-2 mt-1">
            <Database className="w-3 h-3 text-orange-500" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">P1 Master Node Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSmartAssign} 
            disabled={isAiAssigning}
            className="bg-[#43a4ff]/10 text-[#43a4ff] border border-[#43a4ff]/20 hover:bg-[#43a4ff] hover:text-white rounded-xl font-black uppercase text-[10px] tracking-widest px-6 h-11"
          >
            {isAiAssigning ? "Analyzing Matrix..." : "LAILA Smart Assign"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {suggestion && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="bg-[#43a4ff]/5 border-[#43a4ff]/20 p-6 rounded-2xl mb-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Bot className="w-16 h-16 text-[#43a4ff]" />
              </div>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-[#43a4ff]/20 flex items-center justify-center text-3xl font-black text-[#43a4ff] shadow-2xl">
                   {suggestion.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#43a4ff] animate-pulse" />
                    <span className="text-[10px] font-black text-[#43a4ff] uppercase tracking-[0.3em]">Neural Bridge Recommendation</span>
                  </div>
                  <h3 className="text-2xl font-black text-white italic">{suggestion.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className="bg-[#43a4ff]/10 text-[#43a4ff] border-none text-[10px] font-black">{suggestion.role}</Badge>
                    <span className="text-xs text-slate-400 font-medium">| {suggestion.aiReason}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSuggestion(null)} className="text-slate-500 hover:text-white transition-colors">Dismiss</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unregistered Nodes Section */}
      {unregisteredUsers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Ghost className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-black uppercase text-rose-500 tracking-[0.2em]">Unidentified Neural Nodes (Needs Implementation)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unregisteredUsers.map(user => (
              <Card key={user.id} className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-2xl group hover:border-rose-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-black text-rose-500 italic">
                      {user.displayName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{user.displayName}</h4>
                      <p className="text-[9px] text-slate-500 font-mono">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-rose-500/10">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-rose-500 uppercase">Registry Status</span>
                      <span className="text-[10px] font-bold text-white uppercase italic">ORPHAN_NODE</span>
                   </div>
                   <Button 
                    size="sm"
                    onClick={() => implementRegistryId(user)}
                    disabled={isImplementing === user.id}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-black uppercase text-[9px] tracking-widest h-8 rounded-lg"
                   >
                     {isImplementing === user.id ? "Syncing..." : "Implement ID"}
                   </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Master Registry Section */}
      <section className="space-y-4 pt-8 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-black uppercase text-blue-400 tracking-[0.2em]">P1 Master Personnel Registry</h3>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Index Count: {masterEmployees.length}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {masterEmployees.map((emp) => (
            <Card key={emp.empCode} className="bg-white/5 border-white/10 p-6 rounded-2xl hover:border-[#43a4ff]/50 transition-all cursor-pointer group relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-3">
                 <Fingerprint className="w-4 h-4 text-slate-800 group-hover:text-blue-500 transition-all group-hover:scale-125" />
              </div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-lg font-black text-[#43a4ff] shadow-xl group-hover:bg-[#43a4ff] group-hover:text-white transition-all transform group-hover:rotate-6">
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-black text-lg text-white group-hover:text-[#43a4ff] transition-colors italic uppercase tracking-tighter">{emp.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-slate-950 text-slate-400 text-[8px] font-black uppercase border border-white/5">{emp.empCode}</Badge>
                    <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-slate-500">
                   <span>Department</span>
                   <span className="text-white italic">{emp.department || 'Operations'}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-slate-500">
                   <span>Neural Protcol Role</span>
                   <Badge className="bg-blue-500/10 text-blue-500 border-none text-[8px] h-4 py-0 font-black">{emp.role}</Badge>
                </div>
                <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between group-hover:border-[#43a4ff]/30 transition-all">
                   <div className="flex items-center gap-2">
                     <Link2 className="w-3 h-3 text-slate-600" />
                     <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Registry ID</span>
                   </div>
                   <span className="text-blue-400 font-mono text-[11px] font-black bg-blue-400/5 px-2 py-0.5 rounded border border-blue-400/10">{emp.personalFileId}</span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-2">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Connectivity Status</span>
                   <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Stable Matrix Link</span>
                 </div>
                 <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500" 
                    />
                 </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

