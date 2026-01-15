// ============================================
// Recruitment Plan Page (HR View)
// Maps to Excel: Recruitment Plan 2025-26
// ============================================

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecruitmentStore } from '@/stores/recruitmentStore';
import {
  FY_MONTHS,
  FYMonth,
  getFinancialYears,
  calculateTotalPlanned,
  calculateTotalActual,
  calculateVariance,
  getExperienceLevelLabel,
} from '@/lib/recruitmentData';
import { Users, Target, TrendingUp, TrendingDown } from 'lucide-react';

export const RecruitmentPlanPage: React.FC = () => {
  const {
    recruitmentPlans,
    selectedYear,
    setSelectedYear,
    updatePlannedHeadcount,
    updateActualHeadcount,
    currentHRRole,
    getTotalPlannedHires,
    getTotalActualHires,
  } = useRecruitmentStore();

  const yearPlans = recruitmentPlans.filter((p) => p.year === selectedYear);
  const canEdit = currentHRRole === 'hr';

  // Calculate totals for summary cards
  const totalPlanned = getTotalPlannedHires();
  const totalActual = getTotalActualHires();
  const variance = totalActual - totalPlanned;

  // Calculate month-wise totals (like Excel SUM at bottom)
  const monthlyTotals = FY_MONTHS.reduce((acc, month) => {
    acc[month] = {
      planned: yearPlans.reduce((sum, p) => sum + p.monthlyPlanned[month], 0),
      actual: yearPlans.reduce((sum, p) => sum + p.monthlyActual[month], 0),
    };
    return acc;
  }, {} as Record<FYMonth, { planned: number; actual: number }>);

  const handlePlannedChange = (planId: string, month: FYMonth, value: string) => {
    const numValue = parseInt(value) || 0;
    updatePlannedHeadcount(planId, month, numValue);
  };

  const handleActualChange = (planId: string, month: FYMonth, value: string) => {
    const numValue = parseInt(value) || 0;
    updateActualHeadcount(planId, month, numValue);
  };

  return (
    <DashboardLayout
      title="Recruitment Plan"
      subtitle={`Financial Year ${selectedYear} - Role-wise, Month-wise Hiring Plan`}
    >
      {/* Year Selector & Summary Cards */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {getFinancialYears().map((year) => (
                <SelectItem key={year} value={year}>
                  FY {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!canEdit && (
            <Badge variant="secondary" className="text-xs">
              Read Only (CEO View)
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="bg-primary/5">
            <CardContent className="flex items-center gap-3 p-4">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total Planned</p>
                <p className="text-2xl font-bold text-primary">{totalPlanned}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-secondary/50">
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-8 w-8 text-secondary-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total Actual</p>
                <p className="text-2xl font-bold">{totalActual}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={variance >= 0 ? 'bg-green-500/10' : 'bg-destructive/10'}>
            <CardContent className="flex items-center gap-3 p-4">
              {variance >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-destructive" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Variance</p>
                <p className={`text-2xl font-bold ${variance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                  {variance > 0 ? '+' : ''}{variance}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recruitment Plan Table - Maps to Excel layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Role-wise Recruitment Plan (Apr - Mar)
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[180px] font-semibold">Role</TableHead>
                <TableHead className="min-w-[100px] font-semibold">Level</TableHead>
                <TableHead className="w-16 font-semibold">Type</TableHead>
                {FY_MONTHS.map((month) => (
                  <TableHead key={month} className="w-16 text-center font-semibold">
                    {month}
                  </TableHead>
                ))}
                <TableHead className="w-20 text-center font-semibold bg-muted">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearPlans.map((plan) => (
                <React.Fragment key={plan.id}>
                  {/* Planned Row */}
                  <TableRow className="border-b-0">
                    <TableCell rowSpan={2} className="font-medium border-r">
                      <div>
                        <p>{plan.role}</p>
                        <p className="text-xs text-muted-foreground">{plan.department}</p>
                      </div>
                    </TableCell>
                    <TableCell rowSpan={2} className="border-r">
                      <Badge variant="outline" className="text-xs">
                        {getExperienceLevelLabel(plan.experienceLevel)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-blue-600 bg-blue-50/50">
                      Plan
                    </TableCell>
                    {FY_MONTHS.map((month) => (
                      <TableCell key={`${plan.id}-planned-${month}`} className="p-1 bg-blue-50/50">
                        {canEdit ? (
                          <Input
                            type="number"
                            min="0"
                            value={plan.monthlyPlanned[month]}
                            onChange={(e) => handlePlannedChange(plan.id, month, e.target.value)}
                            className="h-8 w-12 text-center text-sm"
                          />
                        ) : (
                          <span className="block text-center">{plan.monthlyPlanned[month]}</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-semibold bg-blue-100/50">
                      {calculateTotalPlanned(plan)}
                    </TableCell>
                  </TableRow>
                  {/* Actual Row */}
                  <TableRow>
                    <TableCell className="text-xs font-medium text-green-600 bg-green-50/50">
                      Actual
                    </TableCell>
                    {FY_MONTHS.map((month) => (
                      <TableCell key={`${plan.id}-actual-${month}`} className="p-1 bg-green-50/50">
                        {canEdit ? (
                          <Input
                            type="number"
                            min="0"
                            value={plan.monthlyActual[month]}
                            onChange={(e) => handleActualChange(plan.id, month, e.target.value)}
                            className="h-8 w-12 text-center text-sm"
                          />
                        ) : (
                          <span className="block text-center">{plan.monthlyActual[month]}</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-semibold bg-green-100/50">
                      {calculateTotalActual(plan)}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
              {/* Totals Row - Excel SUM equivalent */}
              <TableRow className="bg-muted font-semibold">
                <TableCell colSpan={2} className="font-bold">
                  MONTHLY TOTALS
                </TableCell>
                <TableCell className="text-xs text-blue-600">Plan</TableCell>
                {FY_MONTHS.map((month) => (
                  <TableCell key={`total-planned-${month}`} className="text-center">
                    {monthlyTotals[month].planned}
                  </TableCell>
                ))}
                <TableCell className="text-center bg-primary/10">{totalPlanned}</TableCell>
              </TableRow>
              <TableRow className="bg-muted font-semibold">
                <TableCell colSpan={2}></TableCell>
                <TableCell className="text-xs text-green-600">Actual</TableCell>
                {FY_MONTHS.map((month) => (
                  <TableCell key={`total-actual-${month}`} className="text-center">
                    {monthlyTotals[month].actual}
                  </TableCell>
                ))}
                <TableCell className="text-center bg-primary/10">{totalActual}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};
