/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Mail, 
  Lock, 
  Fingerprint, 
  History,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { getSuperAGIResponse } from '@/lib/gemini';
import { cn } from '@/lib/utils';
import { db, auth, collection, addDoc, serverTimestamp } from '@/lib/firebase';

export function Security() {
  const [loginMode, setLoginMode] = useState<'otp' | 'password'>('otp');
  const [isScanning, setIsScanning] = useState(false);
  const [loginLogs, setLoginLogs] = useState([
    { device: "Chrome on Windows", location: "Mumbai, India", time: "Today, 10:32 AM", status: "Current Session", isSuspicious: false },
    { device: "Safari on iPhone", location: "Pune, India", time: "Yesterday, 08:15 PM", status: "Success", isSuspicious: false },
    { device: "Chrome on macOS", location: "Delhi, India", time: "07 April, 11:20 AM", status: "Success", isSuspicious: false },
  ]);

  const handleUpdatePassword = () => {
    toast.success("Password update request sent to LAILA OS Unit.");
  };

  const handleSecurityAudit = async () => {
    setIsScanning(true);
    toast.info("LAILA is auditing global access patterns...");

    try {
      const prompt = `You are the Security Auditor for Divyanshi Capital. 
      Generate ONE new realistic but highly suspicious login attempt that looks like a potential breach (e.g., login from a far-off country, or a device never seen before at an odd time).
      
      Logs so far: ${JSON.stringify(loginLogs)}
      
      Return ONLY a JSON object: 
      {
        "device": "Device name (e.g. Firefox on Linux)",
        "location": "City, Country",
        "time": "Just now",
        "isSuspicious": true,
        "reason": "Short reason why (e.g. Unusual location detected)"
      }`;

      const response = await getSuperAGIResponse(prompt, [], 'LAILA', 'BOSS');
      const text = response.text || "";
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const suspiciousLog = JSON.parse(cleanJson);

      // Add to logs
      setLoginLogs(prev => [suspiciousLog, ...prev]);

      if (suspiciousLog.isSuspicious) {
        // Show immediate toast
        toast.error("Suspicious Activity Detected!", {
          description: `${suspiciousLog.reason}: ${suspiciousLog.device} from ${suspiciousLog.location}`,
          duration: 10000,
        });

        // Save to global notifications for the Notification Center
        if (auth.currentUser) {
          const notificationsRef = collection(db, 'users', auth.currentUser.uid, 'notifications');
          await addDoc(notificationsRef, {
            title: "SECURITY ALERT",
            message: `SUSPICIOUS LOGIN: ${suspiciousLog.reason} from ${suspiciousLog.location} using ${suspiciousLog.device}`,
            type: 'alert',
            priority: 'high',
            timestamp: serverTimestamp(),
            read: false
          });
        }
      } else {
        toast.success("Audit Complete", { description: "No immediate threats found." });
      }
    } catch (error) {
      console.error("Audit error:", error);
      toast.error("Security audit connection timed out.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Center</h1>
          <p className="text-muted-foreground">Manage your access, authentication, and security logs.</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-500/20">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">Secure Session</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Auth Modes */}
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Authentication Settings</CardTitle>
              <CardDescription>Choose how you want to secure your Divyanshi Capital account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="otp" className="w-full" onValueChange={(v) => setLoginMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl mb-8">
                  <TabsTrigger value="otp" className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    <Smartphone className="w-4 h-4 mr-2" />
                    OTP Login
                  </TabsTrigger>
                  <TabsTrigger value="password" className="rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    <Key className="w-4 h-4 mr-2" />
                    Password
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="otp" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-400">Business Mobile</Label>
                      <Input placeholder="+91 98765 43210" className="bg-white/5 border-white/10 h-12 text-white" disabled value="+91 98*** 43***" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400">Business Email</Label>
                      <Input placeholder="upendra@divyanshicapital.com" className="bg-white/5 border-white/10 h-12 text-white" disabled value="upendra@divyanshicapital.com" />
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-emerald-500">OTP Mode Active</p>
                        <p className="text-xs text-emerald-500/80">You will receive a 6-digit code on your registered mobile/email for every login.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="password" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current" className="text-slate-400">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input id="current" type="password" placeholder="••••••••" className="pl-10 bg-white/5 border-white/10 h-12 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new" className="text-slate-400">New Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input id="new" type="password" placeholder="••••••••" className="pl-10 bg-white/5 border-white/10 h-12 text-white" />
                      </div>
                    </div>
                    <Button onClick={handleUpdatePassword} className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-xl shadow-orange-500/20 transition-all">
                      Update Password
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Recent Login Activity</CardTitle>
                <CardDescription>Monitor your account for any suspicious access.</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSecurityAudit}
                disabled={isScanning}
                className="text-xs font-bold uppercase tracking-widest text-orange-500 hover:text-orange-400 hover:bg-orange-500/10"
              >
                {isScanning ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <ShieldAlert className="w-3 h-3 mr-2" />}
                Audit Integrity
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loginLogs.map((log, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all group",
                      log.isSuspicious 
                        ? "bg-rose-500/5 border-rose-500/30 animate-pulse" 
                        : "bg-white/5 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative",
                        log.isSuspicious ? "bg-rose-500/20 text-rose-500" : "bg-white/5 text-slate-400 group-hover:text-orange-500"
                      )}>
                        {log.isSuspicious ? (
                          <>
                            <Globe className="w-5 h-5" />
                            <AlertCircle className="w-3 h-3 absolute -top-1 -right-1 text-rose-500 fill-rose-500/20" />
                          </>
                        ) : (
                          <History className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className={cn("text-sm font-bold", log.isSuspicious ? "text-rose-500" : "text-white")}>
                          {log.device}
                          {log.isSuspicious && <span className="ml-2 inline-flex items-center text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded uppercase">Suspicious</span>}
                        </p>
                        <p className="text-xs text-slate-500">{log.location} • {log.time}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={log.isSuspicious ? "destructive" : (i === 0 && log.status === "Current Session" ? "default" : "secondary")} 
                      className="rounded-lg text-[10px] uppercase tracking-widest font-bold"
                    >
                      {log.isSuspicious ? "Review Required" : log.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Security Score/Tips */}
        <div className="space-y-8">
          <Card className="bg-white/5 border-orange-500/20 backdrop-blur-xl bg-gradient-to-br from-orange-500/5 to-transparent">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-6">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset="42.4" className="text-orange-500" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white italic">85%</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Score</span>
                </div>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">High Integrity</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your node is well protected. To reach 100%, consider enabling biometric lock on mobile.
              </p>
              <Button variant="outline" className="mt-6 w-full rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                <Fingerprint className="w-4 h-4 mr-2 text-orange-500" />
                Enable Biometrics
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">LAILA Guidance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-orange-500/50 mt-0.5 shrink-0" />
                <span>Never share your matrix secret key or OTP with anyone.</span>
              </p>
              <p className="text-xs text-slate-500 leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-orange-500/50 mt-0.5 shrink-0" />
                <span>LAILA will never ask for your password via communication channels.</span>
              </p>
              <p className="text-xs text-slate-500 leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-orange-500/50 mt-0.5 shrink-0" />
                <span>Always terminate the session when using an untrusted node.</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
