// ============================================
// CEO Dashboard (Read-Only)
// Maps to Excel: Summary & 6 Months Summary
// KPIs: Headcount, Turnover, Expense, PBT, PAT
// ============================================

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/dashboard/StatCard';
import { useRecruitmentStore } from '@/stores/recruitmentStore';
import {
  formatINR,
  FY_MONTHS,
} from '@/lib/recruitmentData';
import {
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Target,
  Percent,
  Building2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export const CEODashboard: React.FC = () => {
  const {
    financialSummary,
    selectedYear,
    getTotalPlannedHires,
    getTotalActualHires,
    getTotalRecruitmentCost,
    getMonthlyHires,
  } = useRecruitmentStore();

  const totalPlanned = getTotalPlannedHires();
  const totalActual = getTotalActualHires();
  const recruitmentCost = getTotalRecruitmentCost();
  const monthlyHires = getMonthlyHires();
  const hiringVariance = totalActual - totalPlanned;
  const hiringRate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : '0';

  // Calculate margins
  const pbtMargin = financialSummary.turnover > 0 
    ? ((financialSummary.pbt / financialSummary.turnover) * 100).toFixed(1) 
    : '0';
  const patMargin = financialSummary.turnover > 0 
    ? ((financialSummary.pat / financialSummary.turnover) * 100).toFixed(1) 
    : '0';

  // Revenue vs Expense chart data
  const financialData = [
    { name: 'Turnover', value: financialSummary.turnover },
    { name: 'Expense', value: financialSummary.totalExpense },
    { name: 'Recruitment', value: recruitmentCost },
    { name: 'PBT', value: financialSummary.pbt },
    { name: 'PAT', value: financialSummary.pat },
  ];

  // 6-month summary data (simulated cumulative)
  const sixMonthData = FY_MONTHS.slice(0, 6).map((month, idx) => {
    const cumPlanned = monthlyHires.slice(0, idx + 1).reduce((sum, m) => sum + m.planned, 0);
    const cumActual = monthlyHires.slice(0, idx + 1).reduce((sum, m) => sum + m.actual, 0);
    return {
      month,
      planned: cumPlanned,
      actual: cumActual,
    };
  });

  return (
    <DashboardLayout
      title="CEO Dashboard"
      subtitle={`Financial Year ${selectedYear} - Executive Summary & KPIs`}
    >
      <Badge variant="secondary" className="mb-6">
        Read-Only View
      </Badge>

      {/* KPI Cards - Top Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Headcount Target"
          value={totalPlanned.toString()}
          icon={Target}
          trend={{ value: `${hiringRate}% achieved`, positive: hiringVariance >= 0 }}
          className="bg-primary/5"
        />
        <StatCard
          title="Actual Hires"
          value={totalActual.toString()}
          icon={Users}
          trend={{
            value: hiringVariance >= 0 ? `+${hiringVariance} ahead` : `${hiringVariance} behind`,
            positive: hiringVariance >= 0,
          }}
        />
        <StatCard
          title="Turnover"
          value={formatINR(financialSummary.turnover)}
          icon={TrendingUp}
          className="bg-green-50"
        />
        <StatCard
          title="Total Expense"
          value={formatINR(financialSummary.totalExpense)}
          icon={TrendingDown}
          className="bg-amber-50"
        />
      </div>

      {/* Financial KPIs - Second Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Recruitment Cost"
          value={formatINR(recruitmentCost)}
          icon={Building2}
          description="New hires this FY"
        />
        <StatCard
          title="PBT (Profit Before Tax)"
          value={formatINR(financialSummary.pbt)}
          icon={BarChart3}
          trend={{ value: `${pbtMargin}% margin`, positive: financialSummary.pbt > 0 }}
          className={financialSummary.pbt > 0 ? 'bg-green-50' : 'bg-red-50'}
        />
        <StatCard
          title="Tax Rate"
          value={`${financialSummary.taxRate}%`}
          icon={Percent}
          description="Configurable"
        />
        <StatCard
          title="PAT (Profit After Tax)"
          value={formatINR(financialSummary.pat)}
          icon={DollarSign}
          trend={{ value: `${patMargin}% margin`, positive: financialSummary.pat > 0 }}
          className={financialSummary.pat > 0 ? 'bg-primary/5' : 'bg-red-50'}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Hiring Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Hiring (Plan vs Actual)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyHires}>
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

        {/* 6 Month Cumulative Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">6 Month Cumulative Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sixMonthData}>
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
                  <Area
                    type="monotone"
                    dataKey="planned"
                    name="Target"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Achieved"
                    stroke="hsl(142, 76%, 36%)"
                    fill="hsl(142, 76%, 36%, 0.2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue vs Expense Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip
                    formatter={(value: number) => formatINR(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Excel Formula Reference Note */}
      <Card className="mt-6 border-muted bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Calculation Reference:</strong>{' '}
            PBT = Turnover − Total Expense | PAT = PBT − (PBT × Tax Rate) |
            All totals auto-update when recruitment data changes.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};
