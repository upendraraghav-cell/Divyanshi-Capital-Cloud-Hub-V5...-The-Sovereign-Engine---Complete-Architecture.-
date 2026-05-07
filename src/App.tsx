/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './components/layout/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { SignupPage } from './pages/SignupPage';
import { Toaster } from '@/components/ui/sonner';
import { auth, onAuthStateChanged, db, doc, safeGetDoc, setDoc, serverTimestamp } from '@/lib/firebase';
import { ActivityService } from '@/services/activityService';
import { gasService } from '@/services/gasService';
import { ALL_EMPLOYEES } from './data/staff';
import { toast } from 'sonner';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [handshakeStatus, setHandshakeStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'FAIL'>('IDLE');

  useEffect(() => {
    // Force dark mode for premium feel
    document.documentElement.classList.add('dark');

    const initializeEngine = async () => {
      setHandshakeStatus('PENDING');
      try {
        const response = await gasService.performNeuralHandshake();
        if (response.ok) {
          setHandshakeStatus('SUCCESS');
          ActivityService.log('system', "Neural Handshake: [SECURE] Connection established with HQ.");
          
          if (response.config?.MLA_CORE) {
            (window as any).MLA_CORE = response.config.MLA_CORE;
          }

          if (response.config?.GEMINI_API_KEY) {
            localStorage.setItem('NEURAL_CORE_KEY', response.config.GEMINI_API_KEY);
          }
        } else {
          setHandshakeStatus('FAIL');
        }
      } catch (e) {
        setHandshakeStatus('FAIL');
      }
    };

    initializeEngine();

    // Protocol: Safety Timeout to prevent endless loading in poor network conditions
    const safetyRelease = setTimeout(() => {
      setLoading(false);
    }, 4500);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // **CRITICAL**: RELEASE UI IMMEDIATELY
      // Do not wait for async profile sync to hide loading screen
      setLoading(false);
      clearTimeout(safetyRelease);

      if (firebaseUser) {
        // Optimized: Optimistically set user data from Auth first
        setUser({ 
          ...firebaseUser, 
          role: 'user', 
          brand: 'Divyanshi Capital Cloud Hub V5'
        });
        
        // Background: Proceed with deep profile sync
        (async () => {
          try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await safeGetDoc(userRef);
            
            let employeeData = ALL_EMPLOYEES.find(emp => emp.email === firebaseUser.email);
            let role = employeeData?.role || (userSnap.exists() ? userSnap.data().role : 'user');
            
            if (!userSnap.exists()) {
              await setDoc(userRef, {
                displayName: firebaseUser.displayName || 'Anonymous',
                email: firebaseUser.email,
                role: role,
                personalFileId: employeeData?.personalFileId || 'GUEST-NODE',
                brand: employeeData?.brand || 'Divyanshi Capital Cloud Hub V5',
                createdAt: serverTimestamp()
              }).catch(() => {});
            }
            
            setUser((prev: any) => ({ 
              ...prev,
              ...firebaseUser, 
              role, 
              personalFileId: employeeData?.personalFileId || userSnap.data()?.personalFileId || 'GUEST-NODE',
              brand: employeeData?.brand || userSnap.data()?.brand || 'Divyanshi Capital Cloud Hub V5'
            }));
            
            (window as any).USER = { email: firebaseUser.email, role, uid: firebaseUser.uid };
            ActivityService.log('system', `Neural profile synced: ${firebaseUser.email}`);
          } catch (error) {
            console.debug("[Neural Bridge] Profile sync deferred.", error);
          }
        })();
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(safetyRelease);
    };
  }, []);

  const handleManualLogin = (mockUser: any) => {
    // mockUser comes from LandingPage and includes personalFileId
    setUser(mockUser);
    ActivityService.log('system', `Identity hand-shake confirmed: ${mockUser.email}`);
  };

  if (loading && !user) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <>
      <Routes>
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/*" 
          element={
            user ? (
              <Layout user={user} />
            ) : (
              <LandingPage onLogin={handleManualLogin} />
            )
          } 
        />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  );
}
