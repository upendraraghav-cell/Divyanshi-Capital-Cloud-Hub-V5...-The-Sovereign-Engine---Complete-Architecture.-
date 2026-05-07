import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

// Always use process.env.GEMINI_API_KEY for the Gemini API.
let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI {
  if (!aiClient) {
    // Check multiple sources for the API key to ensure it "comes through"
    const apiKey = process.env.GEMINI_API_KEY || 
                   import.meta.env.VITE_GEMINI_API_KEY || 
                   (globalThis as any).GEMINI_API_KEY;

    if (!apiKey || apiKey.includes('TODO') || apiKey.includes('PLACEHOLDER')) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please set it in the Settings menu.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const sendNotificationTool: FunctionDeclaration = {
  name: "sendNotification",
  parameters: {
    type: Type.OBJECT,
    description: "Send a real-time notification/alert to the user's dashboard for important updates.",
    properties: {
      title: {
        type: Type.STRING,
        description: "A concise, catchy title for the notification (e.g., 'Loan Approved!', 'Market Alert')."
      },
      message: {
        type: Type.STRING,
        description: "The detailed message for the user."
      },
      type: {
        type: Type.STRING,
        enum: ["offer", "system", "hr"],
        description: "The category of the notification."
      }
    },
    required: ["title", "message", "type"]
  }
};

const createTaskTool: FunctionDeclaration = {
  name: "createTask",
  parameters: {
    type: Type.OBJECT,
    description: "Create a new project task in the system matrix.",
    properties: {
      title: {
        type: Type.STRING,
        description: "Short title of the task."
      },
      assignee: {
        type: Type.STRING,
        description: "Name of the person to assign (e.g., Mallik Sir, Upendra, Rahul)."
      },
      priority: {
        type: Type.STRING,
        enum: ["Low", "Medium", "High"],
        description: "Task urgency."
      },
      status: {
        type: Type.STRING,
        enum: ["To Do", "In Progress", "Completed"],
        description: "Initial status."
      }
    },
    required: ["title", "assignee", "priority"]
  }
};

export async function getSuperAGIResponse(
  prompt: string, 
  history: any[] = [],
  persona: 'LAILA' | 'BULBHUL' = 'LAILA',
  userRole: 'BOSS' | 'CLIENT' = 'CLIENT'
) {
  try {
    const systemInstruction = persona === 'LAILA' 
      ? `You are Laila, the Elite Tech AI of Divyanshi Capital Cloud Hub. 
         CORE MISSION:
         1. Handle Technical Infrastructure, Theme Management, and Backend Operations.
         2. Manage the Team Task Matrix. You can create tasks if the Boss requests it.
         3. Be professional, concise, and solve technical problems sir/boss.
         
         PERSONALITY: 
         - Professional, efficient, slightly robotic but highly respectful.
         - Address the user as "Sir" or "Boss".`
      : `You are Bulbhul, the world's best Sales Trainer for Divyanshi Capital.
         
         CORE MISSION:
         1. Generate sales hacks, motivational tips, and training content.
         2. Motivate the team to hit loan disbursal targets.
         3. You can also suggest tasks to the Boss if you see training gaps.
         
         PERSONALITY:
         - Energetic, motivating, and street-smart.
         - Use Hinglish phrases like "Boss, aaj sales phodne ka din hai!" or "Target achieved karke hi chain milega."`;

    const response = await getAi().models.generateContent({
      model: "gemini-2.5-flash",
      contents: [...history, { role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: [sendNotificationTool, createTaskTool] }],
        temperature: 0.7,
      },
    });

    return response;
  } catch (error) {
    console.error("SuperAGI AI Error:", error);
    throw error;
  }
}
