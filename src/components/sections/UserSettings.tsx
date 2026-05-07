/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  User, 
  Camera, 
  Shield, 
  Building2, 
  Mail, 
  CheckCircle2, 
  Loader2,
  Trash2,
  UploadCloud
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { db, storage, ref, uploadBytes, getDownloadURL, doc, updateDoc, FirebaseUser } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface UserSettingsProps {
  user: any;
}

export function UserSettings({ user }: UserSettingsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'Boss'}`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error("Format error: Only neural imagery (images) allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Payload too large: Max capacity 2MB.");
      return;
    }

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `profiles/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update Firestore profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL
      });

      setPhotoURL(downloadURL);
      toast.success("Identity visual updated in the cloud matrix.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Link failure: Could not transmit identity asset.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = async () => {
    try {
      setIsUploading(true);
      // Logic for removing photo - generally set to default or null
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        photoURL: null
      });
      setPhotoURL(`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'Boss'}`);
      toast.success("Profile imagery detached.");
    } catch (error) {
      toast.error("Detach failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight italic uppercase">User Protocol Settings</h1>
        <p className="text-slate-400">Configure your neural identity and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Identity Card */}
        <Card className="lg:col-span-2 bg-[#0a131d] border-white/10 overflow-hidden shadow-2xl">
          <CardHeader className="border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                <User className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-black italic tracking-tight text-white uppercase">Profile Identity</CardTitle>
                <CardDescription className="text-slate-500">Public identification across the Divyanshi Matrix.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative group">
                <div className={cn(
                  "w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden bg-slate-900 shadow-2xl transition-all duration-300 group-hover:border-orange-500/50",
                  isUploading && "animate-pulse brightness-50"
                )}>
                  <img 
                    src={photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                {!isUploading && (
                  <button 
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 p-2.5 bg-orange-600 text-white rounded-full border-2 border-slate-950 shadow-xl hover:bg-orange-500 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Full Identity</label>
                    <Input 
                      value={user?.displayName || "Loading..."} 
                      readOnly
                      className="bg-white/5 border-white/10 h-12 focus:border-blue-500/50 cursor-default"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Neural Email</label>
                    <Input 
                      value={user?.email || "Loading..."} 
                      readOnly
                      className="bg-white/5 border-white/10 h-12 focus:border-blue-500/50 cursor-default"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                   <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{user?.role || 'Staff'}</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{user?.brand || 'HQ Node'}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] p-6 rounded-2xl">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                     <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase italic">Avatar Control</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Update your visual identification node.</p>
                  </div>
               </div>
               <div className="flex gap-3">
                 <Button 
                    variant="outline" 
                    onClick={removePhoto} 
                    disabled={isUploading}
                    className="border-white/10 text-slate-400 hover:text-red-500 hover:bg-red-500/5 font-bold px-6 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button 
                    onClick={triggerFileInput} 
                    disabled={isUploading}
                    className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-[10px] px-8 rounded-xl"
                  >
                    Upload New imagery
                  </Button>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Summary Column */}
        <div className="space-y-8">
           <Card className="bg-[#0a131d] border-white/10 shadow-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  System Authorization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase">Verification Status</span>
                       <Badge className="bg-emerald-500/10 text-emerald-500 border-0 text-[8px] font-black px-2 py-0.5">Verified</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase">Last Sync</span>
                       <span className="text-[9px] font-mono text-slate-400 italic">Today, 09:42 AM</span>
                    </div>
                 </div>
                 <Button variant="outline" className="w-full border-white/10 text-[10px] font-black uppercase tracking-widest h-10 hover:bg-white/5">
                   View Access Audit
                 </Button>
              </CardContent>
           </Card>

           <Card className="bg-gradient-to-br from-blue-600/10 to-transparent border-white/10 shadow-2xl">
              <CardContent className="p-6 text-center space-y-4">
                 <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto text-blue-500">
                    <Mail className="w-6 h-6" />
                 </div>
                 <div>
                    <h5 className="text-sm font-black text-white uppercase italic">Neural Newsletter</h5>
                    <p className="text-[10px] text-slate-500 uppercase font-bold leading-relaxed mt-1">Get weekly performance metrics and sector shifts directly.</p>
                 </div>
                 <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] h-10">
                   Subscribe Protocol
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
