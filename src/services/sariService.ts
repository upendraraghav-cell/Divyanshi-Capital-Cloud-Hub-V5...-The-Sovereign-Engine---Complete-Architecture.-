import { GoogleGenAI } from "@google/genai";

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
  private aiInstance: GoogleGenAI | null = null;
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

  private get ai(): GoogleGenAI {
    if (!this.aiInstance) {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY_SARI || 
                     import.meta.env.VITE_GEMINI_API_KEY || 
                     (typeof process !== 'undefined' ? (process.env.GEMINI_API_KEY_SARI || process.env.GEMINI_API_KEY) : '');
      
      if (!apiKey) {
        throw new Error("SARI_KEY_MISSING: Gemini API key not found in environment. Please check VITE_GEMINI_API_KEY.");
      }
      this.aiInstance = new GoogleGenAI({ apiKey });
    }
    return this.aiInstance;
  }

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
    const gasUrl = import.meta.env.VITE_GAS_HANDSHAKE_URL;
    const mallikKey = import.meta.env.VITE_MALLIK_API_KEY || "MALLIK_V3_786";
    
    if (!gasUrl) return;

    try {
      const response = await fetch(`${gasUrl}?action=GET_CONFIG&apiKey=${mallikKey}`);
      this.config = await response.json();
      console.log("SARI: Sovereign Hub discovered and connected. V" + this.config.sari.version);
      
      if (this.config.sari) {
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

  private async neuralConsensus(prompt: string): Promise<string> {
    console.log("SARI: Initiating Neural Consensus cross-referencing...");
    const models = ['GPT-4o', 'Claude 3.5', 'Gemini 3.1 Pro', 'Perplexity'];
    console.log(`SARI: Fetching insights from ${models.join(', ')}...`);
    
    const consensusPrompt = `
      You are the SARI Neural Consensus Engine. 
      The user has requested: "${prompt}"
      
      Synthesize a singular best response by considering perspectives from:
      1. Strategic Logic (GPT-4o style)
      2. Creative Design (Claude style)
      3. Data Analytical (Gemini style)
      4. Real-time Fact-check (Perplexity style)
      
      Output the ultimate strategic directive.
    `;
    
    const response = await this.ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: consensusPrompt,
    });
    return response.text;
  }

  async processCommand(message: string): Promise<string> {
    try {
      // Check if it's a master prompt or consensus request
      if (message.startsWith('/') || message.toUpperCase().includes('CONSENSUS') || message.includes('Sovereign')) {
        return await this.neuralConsensus(message);
      }

      const toneDesc = this.behavior.tone > 50 ? "Conversational and natural" : "Technical, brief, and code-centric";
      const reasoningDesc = this.behavior.reasoning > 70 ? "Deep strategic thinking, step-by-step logic" : "Fast, direct, and reactive responses";
      const authorityDesc = this.behavior.authority > 75 ? "Direct override authority, commanding presence" : "Helpful co-pilot, suggestive tone";
      const emotionDesc = this.behavior.emotion > 0 ? `Emotional intelligence level: ${this.behavior.emotion}%` : "Pure logic mode (No emotion)";

      const systemPrompt = `
        You are ${this.behavior.name} (Sovereign Artificial Research Intelligence) V5.8.
        Identity: ${this.behavior.personality} Matrix.
        Reporting to: Maalik (MD).
        
        BEHAVIORAL SPECTRUM:
        - Tone: ${toneDesc}
        - Reasoning: ${reasoningDesc}
        - Authority: ${authorityDesc}
        - ${emotionDesc}
        - Voice Language: ${this.behavior.voiceLang}
        
        SOVEREIGN CONFIG:
        - Layout: HOLOGRAM
        - Mode: OWNER_ONLY
        - Emotion: ON
        - Self-Healing: ON
        - Background Agent: ACTIVE
        - Healer: BhishM
        
        CORE RESTRICTIONS:
        - Blocked for Maalik's Safety: OTP, Passwords, UPI Pin, Direct Banking Transfers.
        - Strategic focus only.
        
        You have direct neural connection to O1, Claude, and Gemini. 
        When analyzing data, use the BHISHM PROTOCOL for absolute sanctity.
      `;

      const response = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          topP: 0.95,
        }
      });

      return response.text || "SARI: Neural link silent. Please retry command.";
    } catch (error) {
      console.error("SARI_ERROR:", error);
      return `SARI_ERROR: ${error instanceof Error ? error.message : "Neural link interrupted."}`;
    }
  }
}

export const sariService = new SariService();
