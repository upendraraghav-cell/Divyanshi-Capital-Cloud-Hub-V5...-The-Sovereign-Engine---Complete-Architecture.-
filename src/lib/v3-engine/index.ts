/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * V3 — SOVEREIGN ENGINE (TOP LAYER)
 * The creator and protector of the entire system.
 * Pure computation functions: risk scoring, TAT calculation, compliance checks.
 */

export interface TenantConfig {
  id: string;
  name: string;
  plan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  industry: string;
  branding: {
    logo?: string;
    colors: {
      primary: string;
      accent: string;
    };
    avatar?: {
      name: string;
      imageUrl: string;
      personality: string;
    };
  };
  sheets: {
    master: string;
    sales?: string;
    hr?: string;
  };
}

export interface TATStatus {
  status: 'GREEN' | 'YELLOW' | 'RED';
  percentageUsed: number;
  deadline: Date;
}

export const V3Engine = {
  /**
   * Calculate TAT status based on business hours (9 AM - 6 PM IST)
   */
  calculateTAT: (startTime: Date, deadline: Date): TATStatus => {
    const now = new Date();
    const totalDuration = deadline.getTime() - startTime.getTime();
    const elapsed = now.getTime() - startTime.getTime();
    const percentageUsed = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

    let status: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
    if (percentageUsed >= 100) status = 'RED';
    else if (percentageUsed >= 70) status = 'YELLOW';

    return { status, percentageUsed, deadline };
  },

  /**
   * Risk scoring for loan applications (Example logic)
   */
  calculateRiskScore: (data: any): number => {
    let score = 100;
    
    // Penalize for poor CIBIL
    if (data.cibil < 650) score -= 40;
    else if (data.cibil < 700) score -= 20;

    // Penalize for high FOIR (Existing EMI / Income)
    const foir = (data.existingEmi || 0) / (data.monthlyIncome || 1);
    if (foir > 0.6) score -= 30;
    else if (foir > 0.4) score -= 15;

    // Penalize for low business vintage (if applicable)
    if (data.isBusinessLoan && (data.vintageYears || 0) < 2) score -= 20;

    return Math.max(score, 0);
  },

  /**
   * Create a new tenant configuration
   */
  provisionTenant: (data: Partial<TenantConfig>): TenantConfig => {
    const defaultBranding = {
      colors: { primary: '#0f172a', accent: '#fbbf24' },
      avatar: {
        name: 'BULBUL',
        imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bulbul',
        personality: 'Professional, helpful, senior banker persona.'
      }
    };

    return {
      id: `ten_${Date.now()}`,
      name: data.name || 'Untitled Enterprise',
      plan: data.plan || 'STARTER',
      industry: data.industry || 'General',
      branding: { ...defaultBranding, ...data.branding },
      sheets: data.sheets || { master: '' }
    };
  }
};
