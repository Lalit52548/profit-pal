import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  monthlyRevenueData, 
  clients, 
  projects, 
  employees, 
  commissions,
  formatCurrency 
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileText, TrendingUp, Users, Building2, DollarSign } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

type ReportType = 'revenue' | 'profit' | 'commissions' | 'clients';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('revenue');
  const [dateRange, setDateRange] = useState('year');

  const reports: { id: ReportType; name: string; icon: React.ElementType; description: string }[] = [
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign, description: 'Monthly revenue trends and analysis' },
    { id: 'profit', name: 'Profit & Loss', icon: TrendingUp, description: 'Profit margins and cost breakdown' },
    { id: 'commissions', name: 'Commission Report', icon: Users, description: 'Employee commission earnings' },
    { id: 'clients', name: 'Client Value', icon: Building2, description: 'Client revenue contribution' },
  ];

  // Prepare data for different reports
  const clientValueData = clients
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .map((c) => ({ name: c.company, value: c.totalRevenue }));

  const commissionData = employees
    .filter((e) => e.role === 'employee' || e.role === 'manager')
    .map((emp) => {
      const empCommissions = commissions.filter((c) => c.employeeId === emp.id);
      return {
        name: emp.name.split(' ')[0],
        paid: empCommissions.filter((c) => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0),
        pending: empCommissions.filter((c) => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0),
      };
    })
    .filter((e) => e.paid > 0 || e.pending > 0);

  // Calculate summary stats
  const totalRevenue = monthlyRevenueData.reduce((sum, m) => sum + m.revenue, 0);
  const totalProfit = monthlyRevenueData.reduce((sum, m) => sum + m.profit, 0);
  const totalCost = monthlyRevenueData.reduce((sum, m) => sum + m.cost, 0);
  const avgGrowth = 12.5; // Mock growth rate

  const renderChart = () => {
    switch (reportType) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={12} />
              <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(199, 89%, 48%)" strokeWidth={2} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'profit':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={12} />
              <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="cost" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Cost" />
              <Bar dataKey="profit" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'commissions':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commissionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="name" stroke="hsl(215, 16%, 47%)" fontSize={12} />
              <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend />
              <Bar dataKey="paid" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Paid" />
              <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'clients':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clientValueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" horizontal={false} />
              <XAxis type="number" stroke="hsl(215, 16%, 47%)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <YAxis type="category" dataKey="name" stroke="hsl(215, 16%, 47%)" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Bar dataKey="value" fill="hsl(199, 89%, 48%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <DashboardLayout title="Reports" subtitle="Generate and analyze business reports">
      {/* Summary Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Revenue (YTD)</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Profit (YTD)</p>
          <p className="text-2xl font-bold text-success">{formatCurrency(totalProfit)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Costs (YTD)</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCost)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Avg. Growth</p>
          <p className="text-2xl font-bold text-primary">+{avgGrowth}%</p>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => setReportType(report.id)}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                reportType === report.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                reportType === report.id ? 'bg-primary/10' : 'bg-muted'
              }`}>
                <Icon className={`h-5 w-5 ${reportType === report.id ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-medium text-foreground">{report.name}</p>
                <p className="text-xs text-muted-foreground">{report.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          {reports.find((r) => r.id === reportType)?.name}
        </h3>
        <div className="h-80">
          {renderChart()}
        </div>
      </div>
    </DashboardLayout>
  );
};
