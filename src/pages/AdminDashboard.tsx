import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProjectsTable } from '@/components/dashboard/ProjectsTable';
import { TopClientsChart } from '@/components/dashboard/TopClientsChart';
import { RecentPayments } from '@/components/dashboard/RecentPayments';
import { EmployeePerformance } from '@/components/dashboard/EmployeePerformance';
import { calculateTotals, formatCurrency } from '@/lib/mockData';
import { DollarSign, TrendingUp, FolderKanban, Users, AlertCircle, Building2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const totals = calculateTotals();
  const profitMargin = ((totals.totalProfit / totals.totalRevenue) * 100).toFixed(1);

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Complete business overview">
      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totals.totalRevenue)}
          change={{ value: 12.5, isPositive: true }}
          icon={DollarSign}
        />
        <StatCard
          title="Total Cost"
          value={formatCurrency(totals.totalCost)}
          change={{ value: 8.2, isPositive: false }}
          icon={TrendingUp}
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(totals.totalProfit)}
          change={{ value: 15.3, isPositive: true }}
          icon={TrendingUp}
        />
        <StatCard
          title="Active Projects"
          value={totals.activeProjects}
          icon={FolderKanban}
        />
        <StatCard
          title="Total Clients"
          value={totals.totalClients}
          icon={Building2}
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(totals.pendingPayments)}
          icon={AlertCircle}
        />
      </div>

      {/* Revenue Chart - Full Width */}
      <div className="mb-8">
        <RevenueChart />
      </div>

      {/* Two Column Layout */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <TopClientsChart />
        <EmployeePerformance />
      </div>

      {/* Projects Table */}
      <div className="mb-8">
        <ProjectsTable />
      </div>

      {/* Recent Payments */}
      <RecentPayments />
    </DashboardLayout>
  );
};
