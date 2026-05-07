export interface Employee {
  empCode: string;
  name: string;
  email: string;
  mobile: string;
  password?: string;
  role: string;
  personalFileId: string;
  brand: string;
  department?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  branch?: string;
  manager?: string;
}

export const ALL_EMPLOYEES: Employee[] = [
  { 
    empCode: 'DC001', 
    name: 'Upendra Singh Raghav', 
    email: 'upendra.raghav@divyanshicapital.com', 
    mobile: '9899032117', 
    password: 'admin',
    role: 'Managing Director (Sovereign)', 
    personalFileId: 'DIR-UP-001',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Management',
    status: 'ACTIVE',
    branch: 'Head Office'
  },
  { 
    empCode: 'DC001B', 
    name: 'Sari Supreme (MD)', 
    email: 'u.raghav003@gmail.com', 
    mobile: '9899032117', 
    password: 'admin',
    role: 'Managing Director (SARI)', 
    personalFileId: 'DIR-UP-001',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Management',
    status: 'ACTIVE',
    branch: 'Head Office'
  },
  {
    empCode: 'DC319',
    name: 'Khushboo',
    email: 'Khushboo.divyanshicapital@gmail.com',
    mobile: '9811122238',
    password: 'staff',
    role: 'Head of Human Resources (HR)',
    personalFileId: 'HR-KH-319',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Human Resources',
    status: 'ACTIVE',
    branch: 'Head Office'
  },
  { 
    empCode: 'DC317', 
    name: 'Narendra Singh Raghav', 
    email: 'narendra.raghav@divyanshicapital.com', 
    mobile: '9899903211', 
    password: 'admin',
    role: 'Founder & Director', 
    personalFileId: 'DIR-NR-317',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Management',
    status: 'ACTIVE',
    branch: 'Head Office'
  },
  { 
    empCode: 'DC315', 
    name: 'Khemchand', 
    email: 'khemchand@divyanshicapital.com', 
    mobile: '9889903201', 
    password: 'staff',
    role: 'Head of Human Resources (HR)', 
    personalFileId: 'FIN-KC-315',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Human Resources',
    status: 'ACTIVE',
    branch: 'Head Office'
  },
  { 
    empCode: 'DC331', 
    name: 'Sachin Sharma', 
    email: 'sachin.sharma@divyanshicapital.com', 
    mobile: '9876543210', 
    password: 'staff',
    role: 'Chief Finance & Research Officer', 
    personalFileId: 'FIN-SS-331',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Finance',
    status: 'ACTIVE',
    branch: 'Head Office'
  },
  { 
    empCode: 'DC335', 
    name: 'Dipti', 
    email: 'dipti@divyanshicapital.com', 
    mobile: '9811122233', 
    password: 'staff',
    role: 'Coordinator', 
    personalFileId: 'COORD-DP-335',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Operations',
    status: 'ACTIVE',
    branch: 'Janakpuri',
    manager: 'Upendra Singh Raghav'
  },
  { 
    empCode: 'DC336', 
    name: 'Deepak', 
    email: 'deepak@divyanshicapital.com', 
    mobile: '9811122234', 
    password: 'staff',
    role: 'Coordinator', 
    personalFileId: 'COORD-DK-336',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Operations',
    status: 'ACTIVE',
    branch: 'Janakpuri',
    manager: 'Upendra Singh Raghav'
  },
  { 
    empCode: 'DC280', 
    name: 'Manish', 
    email: 'manish@divyanshicapital.com', 
    mobile: '9811122235', 
    password: 'staff',
    role: 'Coordinator', 
    personalFileId: 'COORD-MN-280',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Operations',
    status: 'ACTIVE',
    branch: 'Janakpuri',
    manager: 'Upendra Singh Raghav'
  },
  { 
    empCode: 'DC305', 
    name: 'Arjun', 
    email: 'arjun@divyanshicapital.com', 
    mobile: '9811122236', 
    password: 'staff',
    role: 'Coordinator', 
    personalFileId: 'COORD-AJ-305',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Operations',
    status: 'ACTIVE',
    branch: 'Janakpuri',
    manager: 'Upendra Singh Raghav'
  },
  { 
    empCode: 'DC233', 
    name: 'Rajni', 
    email: 'rajni@divyanshicapital.com', 
    mobile: '9811122237', 
    password: 'staff',
    role: 'Coordinator', 
    personalFileId: 'COORD-RJ-233',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Operations',
    status: 'ACTIVE',
    branch: 'Janakpuri',
    manager: 'Upendra Singh Raghav'
  },
  { 
    empCode: 'STAFF001', 
    name: 'Rahul Sharma', 
    email: 'rahul@divyanshicapital.com', 
    mobile: '9800011111', 
    password: 'staff',
    role: 'Sales Executive', 
    personalFileId: 'STAFF-RS-001',
    brand: 'Divyanshi Capital Cloud Hub V5',
    department: 'Sales',
    status: 'ACTIVE',
    branch: 'Rohini'
  }
];
