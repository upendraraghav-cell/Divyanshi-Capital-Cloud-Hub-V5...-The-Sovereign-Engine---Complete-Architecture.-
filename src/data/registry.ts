export interface BrandRegistry {
  id: string;
  name: string;
  serverId: string;
  status: 'ACTIVE' | 'SYNCING' | 'OFFLINE';
  lastSync: string;
  roles: string[]; // Brand-specific roles
}

export const SOURCE_REGISTRY: BrandRegistry[] = [
  { 
    id: 'PRJ_DIVYANSHI_001',
    name: 'Divyanshi Capital Cloud Hub V5',
    serverId: '1Mk9AzGdKK07WZCKV6lZgtlM4JWy2sdESQwh70r0UicU',
    status: 'ACTIVE',
    lastSync: new Date().toISOString(),
    roles: ['Managing Director', 'Founder', 'CFO', 'Partner Management', 'Sales Manager', 'Coordinator', 'MD', 'Boss']
  }
];
