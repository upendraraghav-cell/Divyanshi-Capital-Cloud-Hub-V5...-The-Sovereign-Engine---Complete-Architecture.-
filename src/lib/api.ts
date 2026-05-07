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

export async function callBackend<T>(route: BackendRoute, payload: any = {}): Promise<T> {
  console.log(`Calling SaaS backend route: ${route}`, payload);
  
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        api: route,
        route: route, 
        ...payload 
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error calling backend route ${route}:`, error);
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
