import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

// SOVEREIGN AI BRIDGE - PROXIED VIA SERVER
// All AI calls are routed through /api/ai/chat to protect API keys.

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
  persona: 'LAILA' | 'BULBHUL' | 'SARI' = 'LAILA',
  userRole: string = 'CLIENT'
) {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: prompt, 
        history,
        persona,
        userRole
      })
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.error);

    return {
      text: data.text,
      functionCalls: data.functionCalls,
      suggestions: data.suggestions
    };
  } catch (error) {
    console.error("SuperAGI AI Error:", error);
    throw error;
  }
}
