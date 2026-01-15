// ============================================
// Target vs Actual Page
// Maps to Excel: Target vs Actual sheet
// Shows variance analysis with highlighting
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRecruitmentStore } from '@/stores/recruitmentStore';
import {
  getFinancialYears,
  calculateTotalPlanned,
  calculateTotalActual,
  calculateVariance,
  getExperienceLevelLabel,
  FY_MONTHS,
} from '@/lib/recruitmentData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

export const TargetVsActualPage: React.FC = () => {
  const {
    recruitmentPlans,
    selectedYear,
    setSelectedYear,
    getMonthlyHires,
    getTotalPlannedHires,
    getTotalActualHires,
  } = useRecruitmentStore();

  const yearPlans = recruitmentPlans.filter((p) => p.year === selectedYear);
  const monthlyData = getMonthlyHires();
  const totalPlanned = getTotalPlannedHires();
  const totalActual = getTotalActualHires();
  const overallVariance = totalActual - totalPlanned;
  const completionRate = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;

  // Prepare data for role-wise analysis
  const roleAnalysis = yearPlans.map((plan) => {
    const planned = calculateTotalPlanned(plan);
    const actual = calculateTotalActual(plan);
    const variance = actual - planned;
    const completionPct = planned > 0 ? (actual / planned) * 100 : 0;

    return {
      id: plan.id,
      role: plan.role,
      department: plan.department,
      experienceLevel: plan.experienceLevel,
      planned,
      actual,
      variance,
      completionPct,
    };
  });

  // Count variance categories
  const onTrack = roleAnalysis.filter((r) => r.variance >= 0).length;
  const behindTarget = roleAnalysis.filter((r) => r.variance < 0).length;

  return (
    <DashboardLayout
      title="Target vs Actual"
      subtitle="Planned vs Actual Headcount Analysis with Variance Tracking"
    >
      {/* Year Selector & Summary */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Target</p>
                <p className="text-xl font-bold">{totalPlanned}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Achieved</p>
                <p className="text-xl font-bold">{totalActual}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={overallVariance >= 0 ? 'border-green-200' : 'border-destructive/50'}>
            <CardContent className="flex items-center gap-3 p-4">
              {overallVariance >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-destructive" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Variance</p>
                <p className={`text-xl font-bold ${overallVariance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                  {overallVariance > 0 ? '+' : ''}{overallVariance}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-xs text-muted-foreground">Behind Target</p>
                <p className="text-xl font-bold text-amber-600">{behindTarget}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overall Completion Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Overall Hiring Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {totalActual} of {totalPlanned} hires</span>
              <span className="font-medium">{completionRate.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(completionRate, 100)} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Hiring Trend (Plan vs Actual)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="planned" name="Planned" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Role-wise Variance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role-wise Variance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-center">Planned</TableHead>
                <TableHead className="text-center">Actual</TableHead>
                <TableHead className="text-center">Variance</TableHead>
                <TableHead className="text-center">Completion</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleAnalysis.map((role) => (
                <TableRow
                  key={role.id}
                  className={role.variance < 0 ? 'bg-destructive/5' : ''}
                >
                  <TableCell className="font-medium">{role.role}</TableCell>
                  <TableCell>{role.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getExperienceLevelLabel(role.experienceLevel)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">{role.planned}</TableCell>
                  <TableCell className="text-center font-medium">{role.actual}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-semibold ${
                        role.variance > 0
                          ? 'text-green-600'
                          : role.variance < 0
                          ? 'text-destructive'
                          : ''
                      }`}
                    >
                      {role.variance > 0 ? '+' : ''}
                      {role.variance}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Progress
                        value={Math.min(role.completionPct, 100)}
                        className="h-2 w-16"
                      />
                      <span className="text-xs text-muted-foreground">
                        {role.completionPct.toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {role.variance >= 0 ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        On Track
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Behind
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};
