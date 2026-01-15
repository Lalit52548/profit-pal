// ============================================
// HR & CEO Recruitment Planning Data Models
// Maps to Excel sheets: Summary, 6 Months Summary, 
// Target vs Actual, Recruitment Plan, Salary Master
// ============================================

// Financial year months (Apr-Mar for Indian FY)
export const FY_MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'] as const;
export type FYMonth = typeof FY_MONTHS[number];

// Experience levels for recruitment
export type ExperienceLevel = 'fresher' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager';

// User roles for the HR module
export type HRRole = 'hr' | 'ceo';

// ============================================
// Recruitment Plan Interface
// Maps to Excel: Recruitment Plan 2025-26
// ============================================
export interface RecruitmentPlan {
  id: string;
  role: string;
  experienceLevel: ExperienceLevel;
  department: string;
  year: string; // e.g., "2025-26"
  // Monthly headcount - maps to Apr-Mar columns in Excel
  monthlyPlanned: Record<FYMonth, number>;
  monthlyActual: Record<FYMonth, number>;
}

// ============================================
// Salary Master Interface
// Maps to Excel: Recruitment Team Salary
// ============================================
export interface SalaryMaster {
  id: string;
  role: string;
  experienceLevel: ExperienceLevel;
  department: string;
  monthlySalary: number;
  // Excel formula: Yearly Cost = Monthly Salary × 12
  yearlyCost: number;
}

// ============================================
// Previous Year Employee Interface
// Maps to Excel: Previous Year Employees
// ============================================
export interface PreviousEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  joinDate: string;
  exitDate?: string;
  year: string; // Financial year e.g., "2024-25"
  monthlySalary: number;
}

// ============================================
// Financial Summary Interface
// Maps to Excel: Summary sheet
// ============================================
export interface FinancialSummary {
  year: string;
  turnover: number;
  totalExpense: number;
  recruitmentCost: number;
  // Excel formula: PBT = Turnover - Total Expense
  pbt: number;
  taxRate: number; // Configurable tax percentage
  // Excel formula: PAT = PBT - (PBT × Tax Rate)
  pat: number;
}

// ============================================
// Sample Recruitment Plans (2025-26)
// ============================================
export const recruitmentPlans: RecruitmentPlan[] = [
  {
    id: 'rp1',
    role: 'Software Engineer',
    experienceLevel: 'fresher',
    department: 'Engineering',
    year: '2025-26',
    monthlyPlanned: { Apr: 2, May: 1, Jun: 2, Jul: 1, Aug: 2, Sep: 1, Oct: 2, Nov: 1, Dec: 0, Jan: 1, Feb: 2, Mar: 1 },
    monthlyActual: { Apr: 2, May: 1, Jun: 1, Jul: 1, Aug: 2, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0 },
  },
  {
    id: 'rp2',
    role: 'Software Engineer',
    experienceLevel: 'mid',
    department: 'Engineering',
    year: '2025-26',
    monthlyPlanned: { Apr: 1, May: 1, Jun: 1, Jul: 0, Aug: 1, Sep: 1, Oct: 0, Nov: 1, Dec: 0, Jan: 1, Feb: 0, Mar: 1 },
    monthlyActual: { Apr: 1, May: 0, Jun: 1, Jul: 0, Aug: 1, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0 },
  },
  {
    id: 'rp3',
    role: 'Senior Engineer',
    experienceLevel: 'senior',
    department: 'Engineering',
    year: '2025-26',
    monthlyPlanned: { Apr: 0, May: 1, Jun: 0, Jul: 1, Aug: 0, Sep: 1, Oct: 0, Nov: 1, Dec: 0, Jan: 0, Feb: 1, Mar: 0 },
    monthlyActual: { Apr: 0, May: 1, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0 },
  },
  {
    id: 'rp4',
    role: 'Tech Lead',
    experienceLevel: 'lead',
    department: 'Engineering',
    year: '2025-26',
    monthlyPlanned: { Apr: 0, May: 0, Jun: 1, Jul: 0, Aug: 0, Sep: 0, Oct: 1, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 1 },
    monthlyActual: { Apr: 0, May: 0, Jun: 1, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0 },
  },
  {
    id: 'rp5',
    role: 'UI/UX Designer',
    experienceLevel: 'mid',
    department: 'Design',
    year: '2025-26',
    monthlyPlanned: { Apr: 1, May: 0, Jun: 1, Jul: 0, Aug: 0, Sep: 1, Oct: 0, Nov: 0, Dec: 0, Jan: 1, Feb: 0, Mar: 0 },
    monthlyActual: { Apr: 1, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0 },
  },
  {
    id: 'rp6',
    role: 'Product Manager',
    experienceLevel: 'senior',
    department: 'Product',
    year: '2025-26',
    monthlyPlanned: { Apr: 0, May: 1, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 1, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0 },
    monthlyActual: { Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0 },
  },
  {
    id: 'rp7',
    role: 'QA Engineer',
    experienceLevel: 'junior',
    department: 'Quality',
    year: '2025-26',
    monthlyPlanned: { Apr: 1, May: 0, Jun: 1, Jul: 0, Aug: 1, Sep: 0, Oct: 1, Nov: 0, Dec: 0, Jan: 0, Feb: 1, Mar: 0 },
    monthlyActual: { Apr: 1, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0 },
  },
  {
    id: 'rp8',
    role: 'DevOps Engineer',
    experienceLevel: 'mid',
    department: 'Infrastructure',
    year: '2025-26',
    monthlyPlanned: { Apr: 0, May: 1, Jun: 0, Jul: 0, Aug: 1, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 1, Mar: 0 },
    monthlyActual: { Apr: 0, May: 1, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, Jan: 0, Feb: 0, Mar: 0 },
  },
];

// ============================================
// Sample Salary Master Data
// ============================================
export const salaryMaster: SalaryMaster[] = [
  { id: 's1', role: 'Software Engineer', experienceLevel: 'fresher', department: 'Engineering', monthlySalary: 35000, yearlyCost: 420000 },
  { id: 's2', role: 'Software Engineer', experienceLevel: 'junior', department: 'Engineering', monthlySalary: 50000, yearlyCost: 600000 },
  { id: 's3', role: 'Software Engineer', experienceLevel: 'mid', department: 'Engineering', monthlySalary: 75000, yearlyCost: 900000 },
  { id: 's4', role: 'Senior Engineer', experienceLevel: 'senior', department: 'Engineering', monthlySalary: 110000, yearlyCost: 1320000 },
  { id: 's5', role: 'Tech Lead', experienceLevel: 'lead', department: 'Engineering', monthlySalary: 150000, yearlyCost: 1800000 },
  { id: 's6', role: 'Engineering Manager', experienceLevel: 'manager', department: 'Engineering', monthlySalary: 200000, yearlyCost: 2400000 },
  { id: 's7', role: 'UI/UX Designer', experienceLevel: 'mid', department: 'Design', monthlySalary: 65000, yearlyCost: 780000 },
  { id: 's8', role: 'Senior Designer', experienceLevel: 'senior', department: 'Design', monthlySalary: 95000, yearlyCost: 1140000 },
  { id: 's9', role: 'Product Manager', experienceLevel: 'senior', department: 'Product', monthlySalary: 130000, yearlyCost: 1560000 },
  { id: 's10', role: 'QA Engineer', experienceLevel: 'junior', department: 'Quality', monthlySalary: 40000, yearlyCost: 480000 },
  { id: 's11', role: 'QA Engineer', experienceLevel: 'mid', department: 'Quality', monthlySalary: 60000, yearlyCost: 720000 },
  { id: 's12', role: 'DevOps Engineer', experienceLevel: 'mid', department: 'Infrastructure', monthlySalary: 85000, yearlyCost: 1020000 },
];

// ============================================
// Sample Previous Year Employees
// ============================================
export const previousEmployees: PreviousEmployee[] = [
  { id: 'pe1', name: 'Rahul Sharma', role: 'Software Engineer', department: 'Engineering', joinDate: '2024-04-15', year: '2024-25', monthlySalary: 50000 },
  { id: 'pe2', name: 'Priya Patel', role: 'Senior Engineer', department: 'Engineering', joinDate: '2024-05-01', year: '2024-25', monthlySalary: 110000 },
  { id: 'pe3', name: 'Amit Kumar', role: 'UI/UX Designer', department: 'Design', joinDate: '2024-06-10', year: '2024-25', monthlySalary: 65000 },
  { id: 'pe4', name: 'Sneha Reddy', role: 'QA Engineer', department: 'Quality', joinDate: '2024-04-01', year: '2024-25', monthlySalary: 45000 },
  { id: 'pe5', name: 'Vikram Singh', role: 'DevOps Engineer', department: 'Infrastructure', joinDate: '2024-07-15', year: '2024-25', monthlySalary: 85000 },
  { id: 'pe6', name: 'Ananya Iyer', role: 'Product Manager', department: 'Product', joinDate: '2024-08-01', year: '2024-25', monthlySalary: 130000 },
  { id: 'pe7', name: 'Karthik Nair', role: 'Software Engineer', department: 'Engineering', joinDate: '2024-04-01', exitDate: '2024-10-15', year: '2024-25', monthlySalary: 55000 },
  { id: 'pe8', name: 'Deepa Menon', role: 'Tech Lead', department: 'Engineering', joinDate: '2024-05-15', year: '2024-25', monthlySalary: 150000 },
  { id: 'pe9', name: 'Arjun Das', role: 'Software Engineer', department: 'Engineering', joinDate: '2024-09-01', year: '2024-25', monthlySalary: 38000 },
  { id: 'pe10', name: 'Meera Joshi', role: 'Senior Designer', department: 'Design', joinDate: '2024-06-01', year: '2024-25', monthlySalary: 95000 },
];

// ============================================
// Helper Functions - Excel Formula Equivalents
// ============================================

/**
 * Calculate total planned headcount for a recruitment plan
 * Excel equivalent: SUM(Apr:Mar) for planned row
 */
export const calculateTotalPlanned = (plan: RecruitmentPlan): number => {
  return FY_MONTHS.reduce((sum, month) => sum + plan.monthlyPlanned[month], 0);
};

/**
 * Calculate total actual headcount for a recruitment plan
 * Excel equivalent: SUM(Apr:Mar) for actual row
 */
export const calculateTotalActual = (plan: RecruitmentPlan): number => {
  return FY_MONTHS.reduce((sum, month) => sum + plan.monthlyActual[month], 0);
};

/**
 * Calculate variance between planned and actual
 * Excel equivalent: Actual - Planned
 * Negative variance means under-hiring
 */
export const calculateVariance = (plan: RecruitmentPlan): number => {
  return calculateTotalActual(plan) - calculateTotalPlanned(plan);
};

/**
 * Calculate variance for a specific month
 */
export const calculateMonthlyVariance = (plan: RecruitmentPlan, month: FYMonth): number => {
  return plan.monthlyActual[month] - plan.monthlyPlanned[month];
};

/**
 * Calculate yearly cost based on monthly salary
 * Excel formula: Monthly Salary × 12
 */
export const calculateYearlyCost = (monthlySalary: number): number => {
  return monthlySalary * 12;
};

/**
 * Calculate recruitment cost for a role based on headcount
 * Excel formula: Headcount × Yearly Cost
 */
export const calculateRecruitmentCost = (headcount: number, yearlyCost: number): number => {
  return headcount * yearlyCost;
};

/**
 * Calculate PBT (Profit Before Tax)
 * Excel formula: Turnover - Total Expense
 */
export const calculatePBT = (turnover: number, totalExpense: number): number => {
  return turnover - totalExpense;
};

/**
 * Calculate PAT (Profit After Tax)
 * Excel formula: PBT - (PBT × Tax Rate)
 */
export const calculatePAT = (pbt: number, taxRate: number): number => {
  return pbt - (pbt * (taxRate / 100));
};

/**
 * Format currency in INR
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get available financial years
 */
export const getFinancialYears = (): string[] => {
  return ['2024-25', '2025-26', '2026-27'];
};

/**
 * Get experience level label
 */
export const getExperienceLevelLabel = (level: ExperienceLevel): string => {
  const labels: Record<ExperienceLevel, string> = {
    fresher: 'Fresher (0-1 yr)',
    junior: 'Junior (1-3 yrs)',
    mid: 'Mid-Level (3-5 yrs)',
    senior: 'Senior (5-8 yrs)',
    lead: 'Lead (8-10 yrs)',
    manager: 'Manager (10+ yrs)',
  };
  return labels[level];
};
