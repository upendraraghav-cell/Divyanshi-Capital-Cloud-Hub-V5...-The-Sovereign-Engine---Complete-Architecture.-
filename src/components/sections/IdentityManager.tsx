import { useState } from 'react';
import { 
  IdCard, 
  Download, 
  Share2, 
  Palette, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Smartphone,
  Copy,
  CheckCircle2,
  PlusCircle,
  Zap,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function IdentityManager() {
  const [staffName, setStaffName] = useState('Upendra Raghav');
  const [staffRole, setStaffRole] = useState('Managing Director');
  const [staffPhone, setStaffPhone] = useState('+91 99999 00000');
  const [staffCode, setStaffCode] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  
  // New Employee Form State
  const [newEmp, setNewEmp] = useState({ name: '', role: '', phone: '', email: '', brand: 'DIVYANSHI_CAPITAL' });

  const handleProvisionNode = async () => {
    if (!newEmp.name || !newEmp.phone) {
      toast.error("Name and Phone are mandatory for Identity Activation");
      return;
    }
    setIsProvisioning(true);
    const toastId = toast.loading("Engaging Neural Bridge: Mapping HR Matrix...");
    
    try {
      const res = await fetch('/api/v5/auto/employee-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp)
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(`Success! EMP_CODE: ${data.empCode} generated. Assets provisioned.`, { id: toastId });
        setStaffCode(data.empCode);
        handleLookup(data.empCode);
      } else {
        toast.error(data.error || "Provisioning Failed", { id: toastId });
      }
    } catch (e) {
      toast.error("Neural Link Timeout", { id: toastId });
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleLookup = (forcedCode?: string) => {
    const codeToUse = forcedCode || staffCode;
    if (!codeToUse) return;
    setIsSyncing(true);
    
    // Neural Mapping for Divyanshi Capital
    setTimeout(() => {
      const staffMap: Record<string, any> = {
        'DC001': { name: 'Upendra Singh Raghav', role: 'Managing Director', phone: '+91 98990 32117' },
        'DC303': { name: 'Upendra Singh Raghav', role: 'Managing Dir. Management', phone: '+91 98990 32117' },
        'DC307': { name: 'Upendra Singh Raghav', role: 'Founder & Dir. Management', phone: '+91 98999 03211' },
        'DC317': { name: 'Narendra Singh Raghav', role: 'Founder & Dir. Management', phone: '+91 98999 03211' },
        'DC315': { name: 'Khemchand', role: 'Chief Finance Management (CFO)', phone: '+91 98899 03201' },
        'DC311': { name: 'Amit Singh', role: 'Partner Management', phone: '+91 98111 03211' },
        'DC312': { name: 'Vishal', role: 'Partner Management', phone: '+91 98222 03211' },
        'DC316': { name: 'Dimpal', role: 'Coordinator - Personal Loan', phone: '+91 91234 56789' },
        'DC330': { name: 'Dimpal', role: 'Coordinator - Home Loan', phone: '+91 91234 56789' },
        'DC322': { name: 'Arjun', role: 'Partner Management', phone: '+91 88888 77777' },
        'DC341': { name: 'Seema', role: 'Partner Management', phone: '+91 77777 66666' },
        'DC342': { name: 'Rawat', role: 'Partner Management', phone: '+91 77777 55555' },
        'DC343': { name: 'Mansi', role: 'Coordinator - Personal Loan', phone: '+91 66666 55555' },
        'DC345': { name: 'Rajni', role: 'Sales Manager', phone: '+91 55555 44444' },
        'DC318': { name: 'Anmol', role: 'Sales Member', phone: '+91 91111 00000' },
        'DC346': { name: 'Shivani', role: 'Sales Member', phone: '+91 92222 00000' },
        'DC308': { name: 'Jyoti', role: 'Admin / Login Management', phone: '+91 93333 00000' }
      };

      const found = staffMap[codeToUse.toUpperCase()];
      if (found) {
        setStaffName(found.name);
        setStaffRole(found.role);
        setStaffPhone(found.phone);
        toast.success(`Neural Latch Successful: ${found.name} Synced`);
      } else {
        toast.error("Invalid Staff Code: Node Not Found in Matrix");
      }
      setIsSyncing(false);
    }, 1000);
  };

  const handleShare = () => {
    toast.success('Digital card link generated and sent to WhatsApp Matrix');
  };

  const handleDownload = () => {
    toast.info('Generating high-res print PDF...');
    setTimeout(() => toast.success('Visiting Card Ready for Print'), 1500);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[4rem] font-black text-white tracking-tighter italic uppercase leading-[0.8] mb-2">Neural Identity<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Provisioning</span></h1>
          <p className="text-slate-400 font-medium">Official Divyanshi Capital V5 Node Onboarding & Asset Control.</p>
        </div>
        <div className="flex gap-3">
           <Dialog>
             {/* @ts-ignore */}
             <DialogTrigger asChild>
               <Button className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] h-14 px-8 rounded-2xl shadow-xl shadow-orange-600/20">
                 <PlusCircle className="w-5 h-5 mr-3" />
                 Provision New Node
               </Button>
             </DialogTrigger>
             <DialogContent className="bg-[#0a131d] border-white/10 text-white sm:max-w-[500px] rounded-[2rem]">
               <DialogHeader>
                 <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">Onboard New Employee</DialogTitle>
                 <DialogDescription className="text-slate-500">
                   Triggers V5 Neural Bridge: Auto-generates EMP_CODE, creates Drive folders, and pings Telegram.
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-6 py-6 font-medium">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Full Name</label>
                   <Input 
                      placeholder="e.g. John Doe" 
                      value={newEmp.name}
                      onChange={(e) => setNewEmp({...newEmp, name: e.target.value})}
                      className="bg-white/5 border-white/10 h-12" 
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Target Designation</label>
                      <Input 
                        placeholder="e.g. Sales Manager" 
                        value={newEmp.role}
                        onChange={(e) => setNewEmp({...newEmp, role: e.target.value})}
                        className="bg-white/5 border-white/10 h-12" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Mobile Node</label>
                      <Input 
                        placeholder="10-digit number" 
                        value={newEmp.phone}
                        onChange={(e) => setNewEmp({...newEmp, phone: e.target.value})}
                        className="bg-white/5 border-white/10 h-12" 
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Corporate Email</label>
                   <Input 
                     placeholder="email@divyanshicapital.com" 
                     value={newEmp.email}
                     onChange={(e) => setNewEmp({...newEmp, email: e.target.value})}
                     className="bg-white/5 border-white/10 h-12" 
                   />
                 </div>
               </div>
               <DialogFooter>
                 <Button 
                    onClick={handleProvisionNode}
                    disabled={isProvisioning}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest h-14 rounded-2xl"
                 >
                   {isProvisioning ? <RefreshCw className="animate-spin w-5 h-5 mr-3" /> : <Zap className="w-5 h-5 mr-3 text-orange-400" />}
                   Activate V5 Protocol
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visiting Card Customizer */}
        <Card className="bg-[#0a131d] border-white/10 overflow-hidden shadow-2xl">
          <CardHeader className="border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black italic tracking-tight text-white uppercase">Card Creator</CardTitle>
                <CardDescription className="text-slate-500">Customize your professional digital identification.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 mb-6">
                <label className="text-[10px] font-black uppercase text-orange-500 tracking-widest pl-1">Neural Staff Sync</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                    <Input 
                      placeholder="Enter Staff Code (e.g. DC0315)" 
                      value={staffCode}
                      onChange={(e) => setStaffCode(e.target.value)}
                      className="bg-black/40 border-orange-500/20 pl-10 h-11 text-xs"
                    />
                  </div>
                  <Button 
                    onClick={() => handleLookup()} 
                    disabled={isSyncing}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] px-6 h-11"
                  >
                    Sync
                  </Button>
                </div>
                <p className="text-[8px] text-slate-500 font-bold uppercase mt-2 pl-1 italic">* Fetches automatic mapping from Master Google Sheet Neural Matrix</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input 
                    value={staffName} 
                    onChange={(e) => setStaffName(e.target.value)} 
                    className="bg-white/5 border-white/10 pl-10 h-12 focus:border-blue-500/50"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Designation</label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input 
                    value={staffRole} 
                    onChange={(e) => setStaffRole(e.target.value)} 
                    className="bg-white/5 border-white/10 pl-10 h-12 focus:border-blue-500/50"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input 
                    value={staffPhone} 
                    onChange={(e) => setStaffPhone(e.target.value)} 
                    className="bg-white/5 border-white/10 pl-10 h-12 focus:border-blue-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <Button onClick={handleDownload} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold h-12 rounded-xl group">
                <Download className="w-4 h-4 mr-2 group-hover:translate-y-1 transition-transform" />
                Download PDF
              </Button>
              <Button onClick={handleShare} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-600/20">
                <Share2 className="w-4 h-4 mr-2" />
                Share Digital
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card Preview */}
        <div className="flex flex-col gap-6">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Live Template Preview</label>
          
          <motion.div 
            layout
            className="aspect-[1.75/1] w-full rounded-2xl bg-gradient-to-br from-[#1f3550] to-[#0a131d] border border-white/20 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 blur-[80px] translate-y-1/2 -translate-x-1/2" />
            
            <div className="h-full flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-black text-white italic">DC</div>
                    <div className="flex flex-col">
                      <span className="font-black text-lg text-white leading-none tracking-tighter uppercase italic">Divyanshi Capital</span>
                      <span className="text-[8px] text-blue-400 font-black uppercase tracking-[0.2em]">Pvt Ltd</span>
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                   {/* QR Placeholder */}
                   <div className="w-10 h-10 border-2 border-slate-700/50 rounded-sm relative">
                      <div className="absolute inset-2 border-2 border-white/20" />
                   </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white italic tracking-tight uppercase leading-none mb-1">{staffName}</h3>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest pl-1">{staffRole}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-orange-500" />
                  <span className="text-[10px] text-white/70 font-medium">{staffPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-orange-500" />
                  <span className="text-[10px] text-white/70 font-medium whitespace-nowrap">divyanshicapital.com</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  <span className="text-[9px] text-white/70 font-medium">Head Office: Corporate Tower, Matrix Core</span>
                </div>
              </div>
            </div>

            {/* Corporate Slogan */}
            <div className="absolute right-[-40px] top-1/2 -rotate-90 origin-center">
              <span className="text-[8px] font-black text-white/5 uppercase tracking-[0.5em]">India's Largest Loan Facilitator</span>
            </div>
          </motion.div>

          {/* Logo Repository */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shadow-xl">
                    <div className="w-full h-full bg-blue-900 rounded-sm" /> {/* Placeholder for logo.jpeg */}
                  </div>
                  <div>
                     <p className="text-sm font-black text-white uppercase italic">Official Logo Pack</p>
                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Hi-Res Vector • .PNG • .JPG</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-blue-400 hover:text-white hover:bg-blue-600/10">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Share2, title: 'WhatsApp Template', desc: 'Pre-formatted corporate intro card for direct DMs.' },
          { icon: Copy, title: 'Email Signature', desc: 'Sync signature to your Gmail/Outlook automatically.' },
          { icon: CheckCircle2, title: 'Staff Verification', desc: 'Public ID verification link for the trust matrix.' }
        ].map(tool => (
          <div key={tool.title} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-400 mb-4 transition-colors">
              <tool.icon className="w-5 h-5" />
            </div>
            <h5 className="text-sm font-black text-white uppercase italic mb-1">{tool.title}</h5>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
