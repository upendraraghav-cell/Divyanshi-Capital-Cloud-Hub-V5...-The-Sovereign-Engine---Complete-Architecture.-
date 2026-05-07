/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppRole = 'Admin' | 'Editor' | 'Viewer' | 'SaaS Administrator' | 'MD' | 'Managing Director' | 'Founder & Director';

export interface Permissions {
  canViewDashboard: boolean;
  canManageSovereignCRM: boolean;
  canAccessLoanOS: boolean;
  canEditSettings: boolean;
  canViewAnalytics: boolean;
  canUseSmartForm: boolean;
  canAccessAICenter: boolean;
}

export const DEFAULT_PERMISSIONS: Permissions = {
  canViewDashboard: true,
  canManageSovereignCRM: false,
  canAccessLoanOS: false,
  canEditSettings: false,
  canViewAnalytics: false,
  canUseSmartForm: true,
  canAccessAICenter: true,
};

export const ROLE_PERMISSIONS: Record<string, Permissions> = {
  'Admin': {
    canViewDashboard: true,
    canManageSovereignCRM: true,
    canAccessLoanOS: true,
    canEditSettings: true,
    canViewAnalytics: true,
    canUseSmartForm: true,
    canAccessAICenter: true,
  },
  'SaaS Administrator': {
    canViewDashboard: true,
    canManageSovereignCRM: true,
    canAccessLoanOS: true,
    canEditSettings: true,
    canViewAnalytics: true,
    canUseSmartForm: true,
    canAccessAICenter: true,
  },
  'MD': {
    canViewDashboard: true,
    canManageSovereignCRM: true,
    canAccessLoanOS: true,
    canEditSettings: true,
    canViewAnalytics: true,
    canUseSmartForm: true,
    canAccessAICenter: true,
  },
  'Managing Director': {
    canViewDashboard: true,
    canManageSovereignCRM: true,
    canAccessLoanOS: true,
    canEditSettings: true,
    canViewAnalytics: true,
    canUseSmartForm: true,
    canAccessAICenter: true,
  },
  'Founder & Director': {
    canViewDashboard: true,
    canManageSovereignCRM: true,
    canAccessLoanOS: true,
    canEditSettings: true,
    canViewAnalytics: true,
    canUseSmartForm: true,
    canAccessAICenter: true,
  },
  'Editor': {
    canViewDashboard: true,
    canManageSovereignCRM: false,
    canAccessLoanOS: true,
    canEditSettings: false,
    canViewAnalytics: true,
    canUseSmartForm: true,
    canAccessAICenter: true,
  },
  'Viewer': {
    canViewDashboard: true,
    canManageSovereignCRM: false,
    canAccessLoanOS: false,
    canEditSettings: false,
    canViewAnalytics: false,
    canUseSmartForm: true,
    canAccessAICenter: true,
  },
  'Head of Human Resources (HR)': {
    canViewDashboard: true,
    canManageSovereignCRM: false,
    canAccessLoanOS: true,
    canEditSettings: false,
    canViewAnalytics: true,
    canUseSmartForm: true,
    canAccessAICenter: true,
  },
  'Chief Finance & Research Officer': {
    canViewDashboard: true,
    canManageSovereignCRM: false,
    canAccessLoanOS: true,
    canEditSettings: false,
    canViewAnalytics: true,
    canUseSmartForm: true,
    canAccessAICenter: true,
  },
  'Coordinator': {
    canViewDashboard: true,
    canManageSovereignCRM: false,
    canAccessLoanOS: true,
    canEditSettings: false,
    canViewAnalytics: false,
    canUseSmartForm: true,
    canAccessAICenter: false,
  },
  'Sales Executive': {
    canViewDashboard: true,
    canManageSovereignCRM: false,
    canAccessLoanOS: false,
    canEditSettings: false,
    canViewAnalytics: false,
    canUseSmartForm: true,
    canAccessAICenter: true,
  }
};

export function getPermissions(role: string = 'Viewer'): Permissions {
  // Normalize role
  const normalizedRole = role || 'Viewer';
  
  // Return early if we have direct hit
  if (ROLE_PERMISSIONS[normalizedRole]) {
    return ROLE_PERMISSIONS[normalizedRole];
  }

  // Fallback map for common titles
  if (normalizedRole.includes('MD') || normalizedRole.includes('Administrator') || normalizedRole.includes('Director')) {
    return ROLE_PERMISSIONS['Admin'];
  }
  
  if (normalizedRole.includes('Head') || normalizedRole.includes('Officer') || normalizedRole.includes('Manager')) {
    return ROLE_PERMISSIONS['Editor'];
  }

  if (normalizedRole.includes('Coordinator')) {
    return ROLE_PERMISSIONS['Coordinator'];
  }

  return ROLE_PERMISSIONS['Viewer'];
}

export function isAdmin(role: string): boolean {
  const perms = getPermissions(role);
  return perms.canEditSettings && perms.canManageSovereignCRM;
}

export function isEditor(role: string): boolean {
  const perms = getPermissions(role);
  return !perms.canEditSettings && perms.canAccessLoanOS;
}

export function isViewer(role: string): boolean {
  const perms = getPermissions(role);
  return !perms.canAccessLoanOS && perms.canViewDashboard;
}
