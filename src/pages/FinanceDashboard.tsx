import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { CommissionsSummary } from '@/components/dashboard/CommissionsSummary';
import { payments, expenses, calculateTotals, formatCurrency, formatDate } from '@/lib/mockData';
import { DollarSign, Receipt, AlertCircle, TrendingDown, CheckCircle2, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const EXPENSE_COLORS = ['hsl(199, 89%, 48%)', 'hsl(172, 66%, 50%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

export const FinanceDashboard: React.FC = () => {
  const totals = calculateTotals();
  
  const receivedPayments = payments.filter((p) => p.status === 'received');
  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const overduePayments = payments.filter((p) => p.status === 'overdue');
  
  const totalReceived = receivedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);

  // Expense breakdown by category
  const expenseByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseChartData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Monthly payment data
  const monthlyPayments = [
    { month: 'Jul', received: 42000, pending: 8000 },
    { month: 'Aug', received: 78000, pending: 12000 },
    { month: 'Sep', received: 85000, pending: 15000 },
    { month: 'Oct', received: 62000, pending: 10000 },
    { month: 'Nov', received: 55000, pending: 14000 },
    { month: 'Dec', received: 72000, pending: 29000 },
  ];

  return (
    <DashboardLayout title="Finance Dashboard" subtitle="Payment and expense tracking">
      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Received"
          value={formatCurrency(totalReceived)}
          change={{ value: 15.2, isPositive: true }}
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(totalPending)}
          icon={Clock}
        />
        <StatCard
          title="Overdue"
          value={formatCurrency(totalOverdue)}
          icon={AlertCircle}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totals.totalCost)}
          icon={TrendingDown}
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(totals.totalProfit)}
          change={{ value: 12.8, isPositive: true }}
          icon={DollarSign}
        />
      </div>

      {/* Payment Trend Chart */}
      <div className="mb-8 chart-container animate-fade-in">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Payment Trend</h3>
          <p className="text-sm text-muted-foreground">Monthly payments received vs pending</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyPayments}>
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
              <Bar dataKey="received" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Received" />
              <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Expense Breakdown */}
        <div className="chart-container animate-fade-in">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Expense Breakdown</h3>
            <p className="text-sm text-muted-foreground">Costs by category</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="chart-container animate-fade-in">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Invoices</h3>
            <p className="text-sm text-muted-foreground">Latest payment invoices</p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 6).map((payment) => (
                  <tr key={payment.id}>
                    <td className="font-mono text-sm">{payment.invoiceNumber}</td>
                    <td>{payment.clientName}</td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        payment.status === 'received' ? 'badge-success' :
                        payment.status === 'pending' ? 'badge-warning' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Commission Summary */}
      <CommissionsSummary />
    </DashboardLayout>
  );
};
