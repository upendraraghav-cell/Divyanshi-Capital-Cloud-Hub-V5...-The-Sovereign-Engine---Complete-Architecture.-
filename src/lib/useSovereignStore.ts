import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  empCode?: string;
  role: 'MD' | 'STAFF' | 'CLIENT' | 'Managing Director';
  personalFileId?: string;
}

interface SovereignState {
  user: User | null;
  matrixStatus: 'online' | 'optimizing' | 'threat_detected' | 'offline';
  neuralLink: 'connected' | 'reconnecting' | 'severed';
  activeNode: string;
  lailaTelemery: string[];
  
  setUser: (user: User | null) => void;
  setMatrixStatus: (status: SovereignState['matrixStatus']) => void;
  setNeuralLink: (link: SovereignState['neuralLink']) => void;
  addTelemetry: (msg: string) => void;
}

export const useSovereignStore = create<SovereignState>((set) => ({
  user: null,
  matrixStatus: 'online',
  neuralLink: 'connected',
  activeNode: 'DIVYANSHI_OS_V5',
  lailaTelemery: ['Sovereign Engine Initialized.', 'P1 Registry Latch: SUCCESS'],

  setUser: (user) => set({ user }),
  setMatrixStatus: (status) => set({ matrixStatus: status }),
  setNeuralLink: (link) => set({ neuralLink: link }),
  addTelemetry: (msg) => set((state) => ({ 
    lailaTelemery: [...state.lailaTelemery.slice(-19), `${new Date().toLocaleTimeString()} | ${msg}`] 
  })),
}));
