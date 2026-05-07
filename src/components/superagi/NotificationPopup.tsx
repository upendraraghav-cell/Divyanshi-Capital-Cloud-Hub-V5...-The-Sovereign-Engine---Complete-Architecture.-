/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, BellRing, Info, AlertTriangle, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db, auth, doc, updateDoc, handleFirestoreError, OperationType } from '@/lib/firebase';

interface NotificationPopupProps {
  show: boolean;
  data: {
    id: string;
    title: string;
    message: string;
    type: 'offer' | 'system' | 'hr' | 'alert';
  } | null;
  onClose: () => void;
}

export function NotificationPopup({ show, data, onClose }: NotificationPopupProps) {
  const handleAcknowledge = async () => {
    if (data && auth.currentUser) {
      try {
        const notificationRef = doc(db, 'users', auth.currentUser.uid, 'notifications', data.id);
        await updateDoc(notificationRef, { read: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}/notifications/${data.id}`);
      }
    }
    onClose();
  };

  if (!data) return null;

  const getIcon = () => {
    switch (data.type) {
      case 'offer': return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'system': return <Info className="w-6 h-6 text-blue-400" />;
      case 'hr': return <AlertTriangle className="w-6 h-6 text-rose-400" />;
      case 'alert': return <AlertCircle className="w-6 h-6 text-rose-500 animate-pulse" />;
      default: return <BellRing className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-panel rounded-3xl shadow-2xl overflow-hidden border-primary/30"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    {getIcon()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{data.title}</h3>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">OS System Notification</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleAcknowledge} className="rounded-full hover:bg-white/10">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.message}
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAcknowledge} className="flex-1 rounded-xl h-12 shadow-lg shadow-primary/20">
                  Acknowledge
                </Button>
                <Button variant="outline" onClick={handleAcknowledge} className="flex-1 rounded-xl h-12 border-white/10 hover:bg-white/5">
                  Dismiss
                </Button>
              </div>
            </div>
            
            {/* Progress bar for auto-close if needed */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
              onAnimationComplete={handleAcknowledge}
              className="h-1 bg-primary/50"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
