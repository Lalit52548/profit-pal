// ============================================
// Zustand Store for HR & Recruitment Module
// Persists data to localStorage
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  RecruitmentPlan,
  SalaryMaster,
  PreviousEmployee,
  FinancialSummary,
  recruitmentPlans as initialPlans,
  salaryMaster as initialSalary,
  previousEmployees as initialEmployees,
  FYMonth,
  FY_MONTHS,
  calculateTotalPlanned,
  calculateTotalActual,
  calculatePBT,
  calculatePAT,
  HRRole,
} from '@/lib/recruitmentData';

interface RecruitmentState {
  // Data
  recruitmentPlans: RecruitmentPlan[];
  salaryMaster: SalaryMaster[];
  previousEmployees: PreviousEmployee[];
  financialSummary: FinancialSummary;
  
  // UI State
  selectedYear: string;
  currentHRRole: HRRole;
  
  // Actions - Recruitment Plans
  updatePlannedHeadcount: (planId: string, month: FYMonth, value: number) => void;
  updateActualHeadcount: (planId: string, month: FYMonth, value: number) => void;
  addRecruitmentPlan: (plan: Omit<RecruitmentPlan, 'id'>) => void;
  deleteRecruitmentPlan: (planId: string) => void;
  
  // Actions - Salary Master
  updateSalary: (salaryId: string, monthlySalary: number) => void;
  addSalaryEntry: (entry: Omit<SalaryMaster, 'id' | 'yearlyCost'>) => void;
  deleteSalaryEntry: (salaryId: string) => void;
  
  // Actions - Employees
  addEmployee: (employee: Omit<PreviousEmployee, 'id'>) => void;
  deleteEmployee: (employeeId: string) => void;
  
  // Actions - Financial Summary
  updateFinancialSummary: (updates: Partial<FinancialSummary>) => void;
  updateTaxRate: (taxRate: number) => void;
  
  // Actions - UI
  setSelectedYear: (year: string) => void;
  setCurrentHRRole: (role: HRRole) => void;
  
  // Computed values
  getTotalPlannedHires: () => number;
  getTotalActualHires: () => number;
  getTotalRecruitmentCost: () => number;
  getMonthlyHires: () => { month: FYMonth; planned: number; actual: number }[];
}

// Initial financial summary
const initialFinancialSummary: FinancialSummary = {
  year: '2025-26',
  turnover: 50000000, // 5 Cr
  totalExpense: 35000000, // 3.5 Cr
  recruitmentCost: 8500000, // 85 Lakh
  pbt: 15000000, // 1.5 Cr (auto-calculated)
  taxRate: 25,
  pat: 11250000, // (auto-calculated after tax)
};

export const useRecruitmentStore = create<RecruitmentState>()(
  persist(
    (set, get) => ({
      // Initial Data
      recruitmentPlans: initialPlans,
      salaryMaster: initialSalary,
      previousEmployees: initialEmployees,
      financialSummary: initialFinancialSummary,
      selectedYear: '2025-26',
      currentHRRole: 'ceo',

      // ============================================
      // Recruitment Plan Actions
      // ============================================
      
      updatePlannedHeadcount: (planId, month, value) => {
        set((state) => ({
          recruitmentPlans: state.recruitmentPlans.map((plan) =>
            plan.id === planId
              ? {
                  ...plan,
                  monthlyPlanned: { ...plan.monthlyPlanned, [month]: value },
                }
              : plan
          ),
        }));
      },

      updateActualHeadcount: (planId, month, value) => {
        set((state) => ({
          recruitmentPlans: state.recruitmentPlans.map((plan) =>
            plan.id === planId
              ? {
                  ...plan,
                  monthlyActual: { ...plan.monthlyActual, [month]: value },
                }
              : plan
          ),
        }));
      },

      addRecruitmentPlan: (plan) => {
        const newPlan: RecruitmentPlan = {
          ...plan,
          id: `rp${Date.now()}`,
        };
        set((state) => ({
          recruitmentPlans: [...state.recruitmentPlans, newPlan],
        }));
      },

      deleteRecruitmentPlan: (planId) => {
        set((state) => ({
          recruitmentPlans: state.recruitmentPlans.filter((p) => p.id !== planId),
        }));
      },

      // ============================================
      // Salary Master Actions
      // ============================================
      
      updateSalary: (salaryId, monthlySalary) => {
        set((state) => ({
          salaryMaster: state.salaryMaster.map((s) =>
            s.id === salaryId
              ? { ...s, monthlySalary, yearlyCost: monthlySalary * 12 }
              : s
          ),
        }));
      },

      addSalaryEntry: (entry) => {
        const newEntry: SalaryMaster = {
          ...entry,
          id: `s${Date.now()}`,
          yearlyCost: entry.monthlySalary * 12,
        };
        set((state) => ({
          salaryMaster: [...state.salaryMaster, newEntry],
        }));
      },

      deleteSalaryEntry: (salaryId) => {
        set((state) => ({
          salaryMaster: state.salaryMaster.filter((s) => s.id !== salaryId),
        }));
      },

      // ============================================
      // Employee Actions
      // ============================================
      
      addEmployee: (employee) => {
        const newEmployee: PreviousEmployee = {
          ...employee,
          id: `pe${Date.now()}`,
        };
        set((state) => ({
          previousEmployees: [...state.previousEmployees, newEmployee],
        }));
      },

      deleteEmployee: (employeeId) => {
        set((state) => ({
          previousEmployees: state.previousEmployees.filter((e) => e.id !== employeeId),
        }));
      },

      // ============================================
      // Financial Summary Actions
      // ============================================
      
      updateFinancialSummary: (updates) => {
        set((state) => {
          const newSummary = { ...state.financialSummary, ...updates };
          // Auto-calculate PBT and PAT when turnover/expense changes
          newSummary.pbt = calculatePBT(newSummary.turnover, newSummary.totalExpense);
          newSummary.pat = calculatePAT(newSummary.pbt, newSummary.taxRate);
          return { financialSummary: newSummary };
        });
      },

      updateTaxRate: (taxRate) => {
        set((state) => {
          const newSummary = { ...state.financialSummary, taxRate };
          newSummary.pat = calculatePAT(newSummary.pbt, taxRate);
          return { financialSummary: newSummary };
        });
      },

      // ============================================
      // UI Actions
      // ============================================
      
      setSelectedYear: (year) => set({ selectedYear: year }),
      
      setCurrentHRRole: (role) => set({ currentHRRole: role }),

      // ============================================
      // Computed Values
      // Excel equivalent: Total calculations
      // ============================================
      
      getTotalPlannedHires: () => {
        const { recruitmentPlans, selectedYear } = get();
        return recruitmentPlans
          .filter((p) => p.year === selectedYear)
          .reduce((sum, plan) => sum + calculateTotalPlanned(plan), 0);
      },

      getTotalActualHires: () => {
        const { recruitmentPlans, selectedYear } = get();
        return recruitmentPlans
          .filter((p) => p.year === selectedYear)
          .reduce((sum, plan) => sum + calculateTotalActual(plan), 0);
      },

      getTotalRecruitmentCost: () => {
        const { recruitmentPlans, salaryMaster, selectedYear } = get();
        let totalCost = 0;
        
        recruitmentPlans
          .filter((p) => p.year === selectedYear)
          .forEach((plan) => {
            const salary = salaryMaster.find(
              (s) => s.role === plan.role && s.experienceLevel === plan.experienceLevel
            );
            if (salary) {
              const hires = calculateTotalActual(plan);
              totalCost += hires * salary.yearlyCost;
            }
          });
        
        return totalCost;
      },

      getMonthlyHires: () => {
        const { recruitmentPlans, selectedYear } = get();
        const yearPlans = recruitmentPlans.filter((p) => p.year === selectedYear);
        
        return FY_MONTHS.map((month) => ({
          month,
          planned: yearPlans.reduce((sum, plan) => sum + plan.monthlyPlanned[month], 0),
          actual: yearPlans.reduce((sum, plan) => sum + plan.monthlyActual[month], 0),
        }));
      },
    }),
    {
      name: 'recruitment-storage',
    }
  )
);
