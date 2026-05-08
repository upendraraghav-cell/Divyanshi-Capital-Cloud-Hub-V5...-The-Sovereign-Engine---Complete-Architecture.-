/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { toast } from 'sonner';

// API Base URL - Default to local for SaaS mode
export const BACKEND_URL = "/api/backend";

export type BackendRoute = 
  | "LOGIN_EMPLOYEE"
  | "GET_DASHBOARD"
  | "GET_MD_SNAPSHOT"
  | "BULBUL_CHAT"
  | "SOURCE_NAME_BRIDGE_ROUTER"
  | "GENIE_NOTIFY"
  | "GET_POLICY_FLAGS"
  | "GET_BULBUL_INTELLIGENCE"
  | "GET_DRIVE_ASSETS";

/**
 * Standard API Response structure
 */
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

/**
 * Robust fetch wrapper with automatic error handling and toast notifications
 */
export async function request<T>(
  url: string, 
  options: RequestInit = {}, 
  silent: boolean = false
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    let data: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
      if (!silent) {
        toast.error(errorMsg, {
          description: "Neural Matrix Alert",
          duration: 4000
        });
      }
      throw new Error(errorMsg);
    }

    return data as T;
  } catch (error: any) {
    console.error(`[Neural Bridge] API Error: ${url}`, error);
    if (!silent && !error.message.includes('aborted')) {
      toast.error("Network Connectivity Issue", {
        description: error.message || "Could not reach HQ servers.",
        duration: 5000
      });
    }
    throw error;
  }
}

export async function callBackend<T>(route: BackendRoute, payload: any = {}): Promise<T> {
  console.log(`Calling SaaS backend route: ${route}`, payload);
  
  try {
    return await request<T>(BACKEND_URL, {
      method: 'POST',
      body: JSON.stringify({ 
        api: route,
        route: route, 
        ...payload 
      }),
    });
  } catch (error) {
    console.warn(`[Neural Bridge] Redirecting ${route} to Local Cache...`);
    return getMockData(route) as T;
  }
}

function getMockData(route: BackendRoute): any {
  switch (route) {
    case "GET_DRIVE_ASSETS":
      return {
        assets: [
          { id: '1', name: 'System_Snapshot_001.jpg', type: 'image', url: 'https://picsum.photos/seed/sys1/800/600', date: '2024-03-20' },
          { id: '2', name: 'Stack_Verification.png', type: 'image', url: 'https://picsum.photos/seed/stack/800/600', date: '2024-03-21' },
          { id: '3', name: 'Audit_Report_March.pdf', type: 'pdf', url: '#', date: '2024-03-22' },
          { id: '4', name: 'Infra_Schema_Main.jpg', type: 'image', url: 'https://picsum.photos/seed/infra/800/600', date: '2024-03-23' },
        ]
      };
    case "GET_DASHBOARD":
      return {
        kpis: {
          leadsToday: 142,
          activeNodes: 128,
          totalRevenue: "₹5.4Cr",
          inboxPending: 15
        },
        alerts: [
          { id: 1, title: "Service Update", message: "Stripe updated API version to 2024-04-10", type: "offer" },
          { id: 2, title: "Security Update", message: "Node clusters patched successfully", type: "system" }
        ]
      };
    case "BULBUL_CHAT":
      const funnyReplies = [
        "Your wish is my command! (As long as it involves spreadsheets and loan approvals).",
        "POOF! 💨 I've consulted the cosmic ledgers. The answer is... maybe? Just kidding, let's get to work!",
        "I'm rubbing the digital lamp as fast as I can! What else do you need, oh wise one?",
        "By the beard of a thousand underwriters, that's a great question!",
        "I've summoned the spirits of ROI and they say: 'Go for it!'"
      ];
      return {
        reply: funnyReplies[Math.floor(Math.random() * funnyReplies.length)]
      };
    default:
      return {};
  }
}
