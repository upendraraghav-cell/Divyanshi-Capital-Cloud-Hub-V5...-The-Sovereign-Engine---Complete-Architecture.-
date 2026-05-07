/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, MessageCircle, BellRing, Ghost, Zap, Heart, Star, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatConsole } from './ChatConsole';
import { NotificationPopup } from './NotificationPopup';
import { db, auth, collection, query, orderBy, onSnapshot, handleFirestoreError, OperationType } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SUPERAGI_MODES = [
  { 
    id: 'laila', 
    color: 'bg-orange-500', 
    accent: 'text-orange-500', 
    icon: Sparkles, 
    shadow: 'rgba(249,115,22,0.8)', 
    glow: 'rgba(249,115,22,0.4)', 
    title: 'LAILA Matrix' 
  },
];

export function SuperAGIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState<any>(null);
  const [isBathing, setIsBathing] = useState(false);

  const currentMode = SUPERAGI_MODES[0];

  useEffect(() => {
    const updateGenieState = () => {
      const hr = new Date().getHours();
      // Digital bath from 10 PM to 6 AM
      setIsBathing(hr >= 22 || hr < 6);
    };
    updateGenieState();
    const interval = setInterval(updateGenieState, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleAssistant = () => {
    if (isBathing && !isOpen) {
      toast.info("Genie is taking a digital bath... 🛁 Come back at 6 AM!");
      return;
    }
    setIsOpen(!isOpen);
  };

  // Listen for real-time notifications from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const notificationsRef = collection(db, 'users', auth.currentUser.uid, 'notifications');
    const q = query(notificationsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Get the most recent unread notification
      const unreadNotifications = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .filter(n => !n.read);

      if (unreadNotifications.length > 0) {
        const latest = unreadNotifications[0];
        setNotificationData({
          id: latest.id,
          title: latest.title,
          message: latest.message,
          type: latest.type
        });
        setShowNotification(true);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${auth.currentUser?.uid}/notifications`);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  return (
    <>
      {/* Floating Sovereign Genie Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          {isBathing && !isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full right-0 mb-4 bg-slate-900 border border-orange-500/50 p-3 rounded-2xl text-[10px] font-black uppercase text-orange-500 whitespace-nowrap shadow-2xl shadow-orange-500/20"
            >
              Taking a Bath... 🛁
            </motion.div>
          )}

          <Button
            onClick={toggleAssistant}
            className={cn(
              "w-20 h-20 rounded-full border-2 transition-all duration-700 p-0 overflow-hidden group flex items-center justify-center",
              isBathing ? "bg-slate-900/50 border-orange-500/20 grayscale opacity-50" : "bg-slate-900 border-orange-500 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            )}
            style={{ borderColor: isBathing ? undefined : '#D4AF37' }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <X className="w-8 h-8 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="genie"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <img 
                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Genie&backgroundColor=transparent`} 
                    alt="Genie"
                    className={cn("w-14 h-14 transition-all", isBathing && "blur-[1px]")}
                  />
                  {isBathing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-full bg-blue-500/10 backdrop-blur-[1px] animate-pulse" />
                    </div>
                  )}
                  {/* Bath Bubbles */}
                  {isBathing && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bubble" />
                      <div className="absolute bottom-2 left-1/2 w-3 h-3 bg-white/30 rounded-full animate-bubble delay-100" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {/* Neural Pulse Ring */}
          {!isBathing && (
            <div className="absolute -inset-2 rounded-full border border-orange-500/30 animate-ping pointer-events-none" />
          )}
        </motion.div>
      </div>

      {/* Chat Console Drawer */}
      <ChatConsole isOpen={isOpen} onClose={() => setIsOpen(false)} mood={currentMode} />

      {/* Center Notification Popup */}
      <NotificationPopup 
        show={showNotification} 
        data={notificationData} 
        onClose={() => setShowNotification(false)} 
      />
    </>
  );
}
