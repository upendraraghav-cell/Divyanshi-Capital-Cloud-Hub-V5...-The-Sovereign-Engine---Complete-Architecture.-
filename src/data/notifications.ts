
export type NotificationRole = 'SAAS_BOSS' | 'BRAND_MD' | 'STAFF' | 'ALL';

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  role: NotificationRole;
  brand?: string;
}

export const SYSTEM_NOTIFICATIONS: SystemNotification[] = [
  // SaaS Boss Level
  {
    id: 'n1',
    title: 'New Node Activation',
    description: 'HCL Technology Hub successfully mapped to Master Registry.',
    time: '5m ago',
    type: 'SUCCESS',
    role: 'SAAS_BOSS'
  },
  {
    id: 'n2',
    title: 'Revenue Milestone',
    description: 'Divyanshi Capital exceeded weekly revenue target by 15%.',
    time: '2h ago',
    type: 'INFO',
    role: 'SAAS_BOSS'
  },
  {
    id: 'n3',
    title: 'System Health Alert',
    description: 'Fortis Hospital Node reporting high latency in neural sync.',
    time: '1h ago',
    type: 'WARNING',
    role: 'SAAS_BOSS'
  },

  // Brand MD Level (Divyanshi Capital)
  {
    id: 'n4',
    title: 'Evening Report Ready',
    description: 'Daily loan disbursement summary is now available for review.',
    time: '18:00',
    type: 'INFO',
    role: 'BRAND_MD',
    brand: 'Divyanshi Capital Cloud Hub V5'
  },
  {
    id: 'n5',
    title: 'Performance Spike',
    description: 'North Zone team has achieved 112% of their calling targets.',
    time: '3h ago',
    type: 'SUCCESS',
    role: 'BRAND_MD',
    brand: 'Divyanshi Capital Cloud Hub V5'
  },

  // Staff Level
  {
    id: 'n6',
    title: 'Lead Assigned',
    description: 'New high-intent lead for Personal Loan assigned to your terminal.',
    time: 'Just now',
    type: 'ALERT',
    role: 'STAFF'
  },
  {
    id: 'n7',
    title: 'File Approved',
    description: 'Rahul Sharma - ₹4.5L Loan file has been approved by MD node.',
    time: '10m ago',
    type: 'SUCCESS',
    role: 'STAFF'
  },
  {
    id: 'n8',
    title: 'Target Update',
    description: 'You are ₹2.5L away from your monthly incentive qualification.',
    time: '4h ago',
    type: 'WARNING',
    role: 'STAFF'
  },
  {
    id: 'notif-7',
    title: 'Evening Report: Sales Node',
    description: 'Divyanshi Capital Daily Closure: ₹12.5L recovery processed across 14 nodes.',
    time: '6:30 PM',
    role: 'BRAND_MD',
    brand: 'Divyanshi Capital Cloud Hub V5',
    type: 'SUCCESS'
  },
  {
    id: 'notif-8',
    title: 'Evening Report: Ops Matrix',
    description: 'Fortis Hub Daily Closure: 42 Patient files synced to master registry.',
    time: '7:00 PM',
    role: 'BRAND_MD',
    brand: 'Fortis Hospital Hub',
    type: 'SUCCESS'
  },
  {
    id: 'notif-9',
    title: 'SaaS Gateway Alert',
    description: 'HCL Technology node attempting unscheduled registry sync. Blocked.',
    time: 'Just now',
    role: 'SAAS_BOSS',
    brand: 'QDN Tech Internal',
    type: 'ALERT'
  }
];
