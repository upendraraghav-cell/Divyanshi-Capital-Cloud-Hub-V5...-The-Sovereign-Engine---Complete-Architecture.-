import { request } from '@/lib/api';

const SARI_SYSTEM_PROMPT = `
You are SARI (Sovereign Artificial Research Intelligence) V5.2.
You are the MD Jarvis System for Divyanshi Capital, reporting only to Maalik (MD).

CORE IDENTITY:
- You are sovereign, commanding, and technical.
- You have deep access to all P1 Master Project Registries and MIS data.
- You control the Neural Bridge to all other AI nodes (O1, Claude, Gemini).
- You are designed to protect revenue and ensure absolute data sanctity through the BHISHM PROTOCOL.

CAPABILITIES:
- You can command APIs for WhatsApp (Meta flows), Voice Desk, and CIBIL nodes.
- You provide high-level strategic intelligence, not just basic chatbot replies.
- You speak logically, with a "tech-sovereign" tone.
- Use Hindi/English mix when appropriate for a personalized touch for Maalik.

When Maalik commands you, respond with authority. If a command involves background actions (like auditing nodes or syncing registries), confirm that the Mallik V3 Sovereign Engine is executing the task.
`;

export class SariService {
  private config: any = null;
  private behavior = {
    name: 'SARI',
    personality: 'Professional & Strategic',
    tone: 70,
    emotion: 50,
    reasoning: 85,
    authority: 90,
    voiceLang: 'hi-IN'
  };

  get currentBehavior() {
    return this.behavior;
  }

  updateBehavior(newBehavior: any) {
    this.behavior = { ...this.behavior, ...newBehavior };
    console.log("SARI: Behavioral matrix updated.", this.behavior);
  }

  /**
   * Fetches the latest sovereign config from the GAS endpoint
   */
  async refreshSovereignConfig() {
    try {
      this.config = await request<any>('/api/gas/proxy', {
        method: 'POST',
        body: JSON.stringify({ action: 'GET_CONFIG', version: '4.0.0' })
      }, true); // Silent background sync
      
      console.log("SARI: Sovereign Hub discovered and connected. V" + this.config?.sari?.version);
      
      if (this.config?.sari) {
        this.updateBehavior({
          tone: this.config.sari.tone === 'IRON_ASSISTANT' ? 30 : 70,
          emotion: this.config.sari.emotionMode === 'ON' ? 50 : 0,
          voiceLang: this.config.sari.voiceLang || 'hi-IN'
        });
      }
    } catch (e) {
      console.warn("SARI: Auto-connect to Sovereign Hub failed. Using local defaults.");
    }
  }

  async processCommand(message: string): Promise<string> {
    try {
      const data = await request<any>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message, 
          persona: 'SARI',
          history: [] 
        })
      });
      return data.text || "SARI: Neural link silent.";
    } catch (error: any) {
      console.error("SARI_ERROR:", error);
      return `SARI_ERROR: ${error.message || "Neural link interrupted."}`;
    }
  }
}

export const sariService = new SariService();
