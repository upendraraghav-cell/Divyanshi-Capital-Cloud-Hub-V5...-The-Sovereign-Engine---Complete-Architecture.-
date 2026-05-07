
import { toast } from 'sonner';

/**
 * SOVEREIGN SUPREME ENGINE - NEURAL BRIDGE
 * Interfaces with the Google Apps Script V3 Backend
 */

const GAS_URL = import.meta.env.VITE_GAS_BASE_URL;
const GAS_HANDSHAKE_URL = import.meta.env.VITE_GAS_HANDSHAKE_URL;
const GAS_P1_URL = import.meta.env.VITE_GAS_P1_URL;
const GAS_V2_URL = import.meta.env.VITE_GAS_V2_URL;
const GAS_API_KEY = import.meta.env.VITE_GAS_API_KEY;

const getUrlWithKey = (url: string = GAS_URL) => {
  if (!GAS_API_KEY) return url;
  return url.includes('?') ? `${url}&apiKey=${GAS_API_KEY}` : `${url}?apiKey=${GAS_API_KEY}`;
};

/**
 * Helper to call the secure proxy
 */
async function callProxy(action: string, payload: any = {}): Promise<GasResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s neural timeout

  try {
    const response = await fetch('/api/gas/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.debug(`[Neural Bridge] Protocol ${action} timed out. Proceeding with cache fallback.`);
      return { ok: false, error: "Link timed out." };
    }
    console.error(`[Proxy Error] ${action}:`, error);
    return { ok: false, error: "Neural link fractured. Ensure the SaaS Bridge is healthy." };
  }
}

export interface GasResponse {
  ok: boolean;
  reply?: string;
  text?: string;
  error?: string;
  html?: string;
  reload?: boolean;
  config?: any;
  data?: any;
  lid?: string;
  url?: string;
}

export const gasService = {
  /**
   * Generic backend caller for Genie CRM
   */
  async callBackend(route: string, payload: any = {}): Promise<GasResponse> {
    return callProxy(route, payload);
  },

  /**
   * Execute SARI Supreme Command
   */
  async executeSariCommand(message: string): Promise<GasResponse> {
    return callProxy('SARI_SUPREME', { message });
  },

  /**
   * Execute P1 Web Lead Protocol
   */
  async createWebLead(leadData: any): Promise<GasResponse> {
    const toastId = toast.loading("Syncing Lead to P1 Master...");
    try {
      const data = await callProxy('WEB_LEAD', { api: 'WEB_LEAD', ...leadData });
      if (data.ok) {
        toast.success(`Lead Synced: ${data.lid || 'Success'}`, { id: toastId });
        return data;
      }
      toast.error(data.error || "P1 Sync Failed", { id: toastId });
      return data;
    } catch (e) {
      toast.error("Bridge link fractured", { id: toastId });
      return { ok: false, error: "Network error" };
    }
  },

  /**
   * Performs the Neural Handshake with the Sovereign HQ
   */
  async performNeuralHandshake(): Promise<GasResponse> {
    return callProxy('GET_CONFIG', { version: '4.0.0' });
  },

  /**
   * Execute a command via Laila AI Core
   */
  async executeLailaCommand(command: string, projectId: string = 'PRJ_DIVYANSHI_001'): Promise<GasResponse> {
    return callProxy('LAILA_COMMAND', { command, projectId });
  },

  /**
   * Fetch Team Registry
   */
  async getTeam(projectId: string = 'PRJ_DIVYANSHI_001'): Promise<GasResponse> {
    return callProxy('GET_TEAM', { projectId });
  },

  /**
   * Initiate OTP Protocol
   */
  async sendOTP(mobile: string, uid: string, projectId: string): Promise<boolean> {
    const toastId = toast.loading("Transmitting OTP...");
    try {
      const data = await callProxy('REGISTRY_STAFF_SEND_OTP', {
        projectId,
        uid,
        mobile
      });
      if (data.ok) {
        toast.success("OTP Sent via WhatsApp", { id: toastId });
        return true;
      } else {
        toast.error(data.error || "Registry Denied Access", { id: toastId });
        return false;
      }
    } catch (e) {
      toast.error("Neural link fractured", { id: toastId });
      return false;
    }
  },

  /**
   * Verify OTP Protocol
   */
  async verifyOTP(mobile: string, otp: string, uid: string, projectId: string): Promise<GasResponse> {
    const toastId = toast.loading("Verifying Identity...");
    try {
      const data = await callProxy('REGISTRY_STAFF_VERIFY_OTP', {
        projectId,
        uid,
        otp
      });
      if (data.ok) {
        toast.success("Identity Verified", { id: toastId });
      } else {
        toast.error("Invalid Vector Code", { id: toastId });
      }
      return data;
    } catch (e) {
      toast.error("Neural link fractured", { id: toastId });
      return { ok: false };
    }
  },

  /**
   * Sets the All-In-One configuration on the Sovereign Backend (Google Apps Script)
   */
  async setAllInOneConfig(configValue: string): Promise<GasResponse> {
    return callProxy('SET_ALL_IN_ONE_CONFIG', { config: configValue });
  },

  /**
   * Triggers the Autonomous Master Engine on the Backend
   */
  async triggerMasterAutoEngine(): Promise<GasResponse> {
    return callProxy('MASTER_AUTO_ENGINE', {});
  },

  /**
   * Syncs P1 Sheet tokens to Script Properties
   */
  async syncP1ToProperties(): Promise<GasResponse> {
    return callProxy('SYNC_P1_TO_PROPERTIES', {});
  },

  /**
   * Deploys the system to Live Production state
   */
  async goLiveProduction(): Promise<GasResponse> {
    return callProxy('GO_LIVE_PRODUCTION', {});
  },

  /**
   * Initiates an Autonomous Market Scan for system evolution
   */
  async autonomousMarketScan(): Promise<GasResponse> {
    return callProxy('V3_AUTONOMOUS_MARKET_SCAN', {});
  }
};
