// Mock data for the SaaS dashboard

export type UserRole = 'admin' | 'manager' | 'employee' | 'finance';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  commissionRate: number;
  avatar?: string;
  department: string;
  joinDate: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  ownerId: string; // Employee who brought the client
  ownerName: string;
  status: 'active' | 'inactive' | 'pending';
  totalRevenue: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  contractValue: number;
  startDate: string;
  endDate: string;
  assignedEmployees: string[];
  projectCost: number;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  revenue: number;
  profit: number;
}

export interface Payment {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  amount: number;
  date: string;
  status: 'received' | 'pending' | 'overdue';
  invoiceNumber: string;
}

export interface Expense {
  id: string;
  projectId: string;
  projectName: string;
  category: 'salary' | 'tools' | 'cloud' | 'freelancer' | 'other';
  description: string;
  amount: number;
  date: string;
}

export interface Commission {
  id: string;
  employeeId: string;
  employeeName: string;
  clientId: string;
  clientName: string;
  paymentId: string;
  amount: number;
  rate: number;
  date: string;
  status: 'paid' | 'pending';
}

// Sample employees
export const employees: Employee[] = [
  { id: 'e1', name: 'Alex Johnson', email: 'alex@company.com', role: 'admin', commissionRate: 10, department: 'Management', joinDate: '2022-01-15' },
  { id: 'e2', name: 'Sarah Williams', email: 'sarah@company.com', role: 'manager', commissionRate: 8, department: 'Sales', joinDate: '2022-03-20' },
  { id: 'e3', name: 'Michael Chen', email: 'michael@company.com', role: 'employee', commissionRate: 5, department: 'Development', joinDate: '2022-06-10' },
  { id: 'e4', name: 'Emily Davis', email: 'emily@company.com', role: 'employee', commissionRate: 5, department: 'Design', joinDate: '2022-08-05' },
  { id: 'e5', name: 'James Brown', email: 'james@company.com', role: 'finance', commissionRate: 3, department: 'Finance', joinDate: '2022-02-28' },
  { id: 'e6', name: 'Lisa Anderson', email: 'lisa@company.com', role: 'employee', commissionRate: 6, department: 'Sales', joinDate: '2023-01-10' },
];

// Sample clients
export const clients: Client[] = [
  { id: 'c1', name: 'John Smith', email: 'john@techcorp.com', company: 'TechCorp Inc.', ownerId: 'e3', ownerName: 'Michael Chen', status: 'active', totalRevenue: 125000, createdAt: '2023-02-15' },
  { id: 'c2', name: 'Maria Garcia', email: 'maria@innovate.io', company: 'Innovate.io', ownerId: 'e2', ownerName: 'Sarah Williams', status: 'active', totalRevenue: 89000, createdAt: '2023-04-22' },
  { id: 'c3', name: 'David Lee', email: 'david@startupx.com', company: 'StartupX', ownerId: 'e6', ownerName: 'Lisa Anderson', status: 'active', totalRevenue: 67500, createdAt: '2023-06-10' },
  { id: 'c4', name: 'Emma Wilson', email: 'emma@globaltech.net', company: 'GlobalTech', ownerId: 'e3', ownerName: 'Michael Chen', status: 'pending', totalRevenue: 45000, createdAt: '2023-08-01' },
  { id: 'c5', name: 'Robert Taylor', email: 'robert@enterprise.co', company: 'Enterprise Co.', ownerId: 'e2', ownerName: 'Sarah Williams', status: 'active', totalRevenue: 210000, createdAt: '2023-01-08' },
];

// Sample projects
export const projects: Project[] = [
  { id: 'p1', name: 'E-commerce Platform', clientId: 'c1', clientName: 'TechCorp Inc.', contractValue: 75000, startDate: '2023-03-01', endDate: '2023-08-31', assignedEmployees: ['e3', 'e4'], projectCost: 45000, status: 'completed', revenue: 75000, profit: 30000 },
  { id: 'p2', name: 'Mobile App Development', clientId: 'c2', clientName: 'Innovate.io', contractValue: 55000, startDate: '2023-05-15', endDate: '2023-11-30', assignedEmployees: ['e3'], projectCost: 32000, status: 'active', revenue: 40000, profit: 8000 },
  { id: 'p3', name: 'Website Redesign', clientId: 'c3', clientName: 'StartupX', contractValue: 35000, startDate: '2023-07-01', endDate: '2023-09-30', assignedEmployees: ['e4'], projectCost: 18000, status: 'completed', revenue: 35000, profit: 17000 },
  { id: 'p4', name: 'CRM Integration', clientId: 'c5', clientName: 'Enterprise Co.', contractValue: 120000, startDate: '2023-02-01', endDate: '2024-01-31', assignedEmployees: ['e3', 'e4', 'e6'], projectCost: 72000, status: 'active', revenue: 90000, profit: 18000 },
  { id: 'p5', name: 'Data Analytics Dashboard', clientId: 'c1', clientName: 'TechCorp Inc.', contractValue: 50000, startDate: '2023-09-01', endDate: '2024-02-28', assignedEmployees: ['e3'], projectCost: 28000, status: 'active', revenue: 25000, profit: -3000 },
  { id: 'p6', name: 'Brand Identity System', clientId: 'c4', clientName: 'GlobalTech', contractValue: 28000, startDate: '2023-08-15', endDate: '2023-10-31', assignedEmployees: ['e4'], projectCost: 15000, status: 'on-hold', revenue: 14000, profit: -1000 },
];

// Sample payments
export const payments: Payment[] = [
  { id: 'pay1', clientId: 'c1', clientName: 'TechCorp Inc.', projectId: 'p1', projectName: 'E-commerce Platform', amount: 25000, date: '2023-03-15', status: 'received', invoiceNumber: 'INV-2023-001' },
  { id: 'pay2', clientId: 'c1', clientName: 'TechCorp Inc.', projectId: 'p1', projectName: 'E-commerce Platform', amount: 25000, date: '2023-06-01', status: 'received', invoiceNumber: 'INV-2023-015' },
  { id: 'pay3', clientId: 'c1', clientName: 'TechCorp Inc.', projectId: 'p1', projectName: 'E-commerce Platform', amount: 25000, date: '2023-09-01', status: 'received', invoiceNumber: 'INV-2023-032' },
  { id: 'pay4', clientId: 'c2', clientName: 'Innovate.io', projectId: 'p2', projectName: 'Mobile App Development', amount: 20000, date: '2023-05-20', status: 'received', invoiceNumber: 'INV-2023-010' },
  { id: 'pay5', clientId: 'c2', clientName: 'Innovate.io', projectId: 'p2', projectName: 'Mobile App Development', amount: 20000, date: '2023-08-15', status: 'received', invoiceNumber: 'INV-2023-028' },
  { id: 'pay6', clientId: 'c3', clientName: 'StartupX', projectId: 'p3', projectName: 'Website Redesign', amount: 35000, date: '2023-10-01', status: 'received', invoiceNumber: 'INV-2023-040' },
  { id: 'pay7', clientId: 'c5', clientName: 'Enterprise Co.', projectId: 'p4', projectName: 'CRM Integration', amount: 30000, date: '2023-02-15', status: 'received', invoiceNumber: 'INV-2023-002' },
  { id: 'pay8', clientId: 'c5', clientName: 'Enterprise Co.', projectId: 'p4', projectName: 'CRM Integration', amount: 30000, date: '2023-05-15', status: 'received', invoiceNumber: 'INV-2023-012' },
  { id: 'pay9', clientId: 'c5', clientName: 'Enterprise Co.', projectId: 'p4', projectName: 'CRM Integration', amount: 30000, date: '2023-08-15', status: 'received', invoiceNumber: 'INV-2023-027' },
  { id: 'pay10', clientId: 'c1', clientName: 'TechCorp Inc.', projectId: 'p5', projectName: 'Data Analytics Dashboard', amount: 25000, date: '2023-09-15', status: 'received', invoiceNumber: 'INV-2023-035' },
  { id: 'pay11', clientId: 'c4', clientName: 'GlobalTech', projectId: 'p6', projectName: 'Brand Identity System', amount: 14000, date: '2023-08-20', status: 'received', invoiceNumber: 'INV-2023-029' },
  { id: 'pay12', clientId: 'c2', clientName: 'Innovate.io', projectId: 'p2', projectName: 'Mobile App Development', amount: 15000, date: '2023-12-01', status: 'pending', invoiceNumber: 'INV-2023-055' },
  { id: 'pay13', clientId: 'c4', clientName: 'GlobalTech', projectId: 'p6', projectName: 'Brand Identity System', amount: 14000, date: '2023-11-15', status: 'overdue', invoiceNumber: 'INV-2023-050' },
];

// Sample expenses
export const expenses: Expense[] = [
  { id: 'exp1', projectId: 'p1', projectName: 'E-commerce Platform', category: 'salary', description: 'Developer salaries', amount: 35000, date: '2023-08-31' },
  { id: 'exp2', projectId: 'p1', projectName: 'E-commerce Platform', category: 'cloud', description: 'AWS hosting', amount: 5000, date: '2023-08-31' },
  { id: 'exp3', projectId: 'p1', projectName: 'E-commerce Platform', category: 'tools', description: 'Design software', amount: 2500, date: '2023-04-15' },
  { id: 'exp4', projectId: 'p1', projectName: 'E-commerce Platform', category: 'freelancer', description: 'UI consultant', amount: 2500, date: '2023-05-20' },
  { id: 'exp5', projectId: 'p2', projectName: 'Mobile App Development', category: 'salary', description: 'Developer salary', amount: 28000, date: '2023-11-30' },
  { id: 'exp6', projectId: 'p2', projectName: 'Mobile App Development', category: 'cloud', description: 'Firebase services', amount: 4000, date: '2023-10-15' },
  { id: 'exp7', projectId: 'p3', projectName: 'Website Redesign', category: 'salary', description: 'Designer salary', amount: 15000, date: '2023-09-30' },
  { id: 'exp8', projectId: 'p3', projectName: 'Website Redesign', category: 'tools', description: 'Figma subscription', amount: 3000, date: '2023-08-01' },
  { id: 'exp9', projectId: 'p4', projectName: 'CRM Integration', category: 'salary', description: 'Team salaries', amount: 60000, date: '2024-01-15' },
  { id: 'exp10', projectId: 'p4', projectName: 'CRM Integration', category: 'cloud', description: 'Salesforce API', amount: 12000, date: '2023-12-01' },
];

// Sample commissions
export const commissions: Commission[] = [
  { id: 'com1', employeeId: 'e3', employeeName: 'Michael Chen', clientId: 'c1', clientName: 'TechCorp Inc.', paymentId: 'pay1', amount: 1250, rate: 5, date: '2023-03-15', status: 'paid' },
  { id: 'com2', employeeId: 'e3', employeeName: 'Michael Chen', clientId: 'c1', clientName: 'TechCorp Inc.', paymentId: 'pay2', amount: 1250, rate: 5, date: '2023-06-01', status: 'paid' },
  { id: 'com3', employeeId: 'e3', employeeName: 'Michael Chen', clientId: 'c1', clientName: 'TechCorp Inc.', paymentId: 'pay3', amount: 1250, rate: 5, date: '2023-09-01', status: 'paid' },
  { id: 'com4', employeeId: 'e2', employeeName: 'Sarah Williams', clientId: 'c2', clientName: 'Innovate.io', paymentId: 'pay4', amount: 1600, rate: 8, date: '2023-05-20', status: 'paid' },
  { id: 'com5', employeeId: 'e2', employeeName: 'Sarah Williams', clientId: 'c2', clientName: 'Innovate.io', paymentId: 'pay5', amount: 1600, rate: 8, date: '2023-08-15', status: 'paid' },
  { id: 'com6', employeeId: 'e6', employeeName: 'Lisa Anderson', clientId: 'c3', clientName: 'StartupX', paymentId: 'pay6', amount: 2100, rate: 6, date: '2023-10-01', status: 'paid' },
  { id: 'com7', employeeId: 'e2', employeeName: 'Sarah Williams', clientId: 'c5', clientName: 'Enterprise Co.', paymentId: 'pay7', amount: 2400, rate: 8, date: '2023-02-15', status: 'paid' },
  { id: 'com8', employeeId: 'e2', employeeName: 'Sarah Williams', clientId: 'c5', clientName: 'Enterprise Co.', paymentId: 'pay8', amount: 2400, rate: 8, date: '2023-05-15', status: 'paid' },
  { id: 'com9', employeeId: 'e2', employeeName: 'Sarah Williams', clientId: 'c5', clientName: 'Enterprise Co.', paymentId: 'pay9', amount: 2400, rate: 8, date: '2023-08-15', status: 'paid' },
  { id: 'com10', employeeId: 'e3', employeeName: 'Michael Chen', clientId: 'c1', clientName: 'TechCorp Inc.', paymentId: 'pay10', amount: 1250, rate: 5, date: '2023-09-15', status: 'paid' },
  { id: 'com11', employeeId: 'e3', employeeName: 'Michael Chen', clientId: 'c4', clientName: 'GlobalTech', paymentId: 'pay11', amount: 700, rate: 5, date: '2023-08-20', status: 'paid' },
  { id: 'com12', employeeId: 'e2', employeeName: 'Sarah Williams', clientId: 'c2', clientName: 'Innovate.io', paymentId: 'pay12', amount: 1200, rate: 8, date: '2023-12-01', status: 'pending' },
];

// Monthly revenue data for charts
export const monthlyRevenueData = [
  { month: 'Jan', revenue: 30000, cost: 18000, profit: 12000 },
  { month: 'Feb', revenue: 45000, cost: 25000, profit: 20000 },
  { month: 'Mar', revenue: 38000, cost: 22000, profit: 16000 },
  { month: 'Apr', revenue: 52000, cost: 30000, profit: 22000 },
  { month: 'May', revenue: 48000, cost: 28000, profit: 20000 },
  { month: 'Jun', revenue: 65000, cost: 35000, profit: 30000 },
  { month: 'Jul', revenue: 42000, cost: 25000, profit: 17000 },
  { month: 'Aug', revenue: 78000, cost: 42000, profit: 36000 },
  { month: 'Sep', revenue: 85000, cost: 48000, profit: 37000 },
  { month: 'Oct', revenue: 62000, cost: 35000, profit: 27000 },
  { month: 'Nov', revenue: 55000, cost: 32000, profit: 23000 },
  { month: 'Dec', revenue: 72000, cost: 40000, profit: 32000 },
];

// Calculate totals
export const calculateTotals = () => {
  const totalRevenue = payments.filter(p => p.status === 'received').reduce((sum, p) => sum + p.amount, 0);
  const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalProfit = totalRevenue - totalCost;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalClients = clients.length;
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  
  return {
    totalRevenue,
    totalCost,
    totalProfit,
    activeProjects,
    totalClients,
    pendingPayments,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
