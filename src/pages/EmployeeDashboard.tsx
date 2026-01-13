import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { clients, commissions, projects, formatCurrency, formatDate } from '@/lib/mockData';
import { DollarSign, Users, FolderKanban, TrendingUp, Building2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const EmployeeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Get employee's clients
  const myClients = clients.filter((c) => c.ownerId === currentUser?.id);
  const totalClientRevenue = myClients.reduce((sum, c) => sum + c.totalRevenue, 0);
  
  // Get employee's commissions
  const myCommissions = commissions.filter((c) => c.employeeId === currentUser?.id);
  const totalCommissions = myCommissions.reduce((sum, c) => sum + c.amount, 0);
  const paidCommissions = myCommissions.filter((c) => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
  const pendingCommissions = myCommissions.filter((c) => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);

  // Get assigned projects
  const myProjects = projects.filter((p) => p.assignedEmployees.includes(currentUser?.id || ''));

  // Monthly commission data
  const monthlyData = [
    { month: 'Jul', amount: 1250 },
    { month: 'Aug', amount: 1950 },
    { month: 'Sep', amount: 2500 },
    { month: 'Oct', amount: 1800 },
    { month: 'Nov', amount: 2200 },
    { month: 'Dec', amount: 1700 },
  ];

  return (
    <DashboardLayout title="My Dashboard" subtitle={`Welcome back, ${currentUser?.name || 'Employee'}`}>
      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Clients"
          value={myClients.length}
          icon={Building2}
        />
        <StatCard
          title="Revenue Generated"
          value={formatCurrency(totalClientRevenue)}
          change={{ value: 8.5, isPositive: true }}
          icon={DollarSign}
        />
        <StatCard
          title="Total Commission"
          value={formatCurrency(totalCommissions)}
          change={{ value: 12.3, isPositive: true }}
          icon={TrendingUp}
        />
        <StatCard
          title="Active Projects"
          value={myProjects.filter((p) => p.status === 'active').length}
          icon={FolderKanban}
        />
      </div>

      {/* Commission Trend Chart */}
      <div className="mb-8 chart-container animate-fade-in">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Commission Trend</h3>
          <p className="text-sm text-muted-foreground">Your monthly commission earnings</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" fontSize={12} />
              <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Commission']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(199, 89%, 48%)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Clients */}
        <div className="chart-container animate-fade-in">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">My Clients</h3>
            <p className="text-sm text-muted-foreground">Clients you brought to the company</p>
          </div>
          <div className="space-y-4">
            {myClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{client.company}</p>
                  <p className="text-sm text-muted-foreground">{client.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(client.totalRevenue)}</p>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    client.status === 'active' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {client.status}
                  </span>
                </div>
              </div>
            ))}
            {myClients.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No clients yet</p>
            )}
          </div>
        </div>

        {/* Commission Breakdown */}
        <div className="chart-container animate-fade-in">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Commission Breakdown</h3>
            <p className="text-sm text-muted-foreground">Your earnings from client payments</p>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-success/10 p-4">
              <p className="text-sm text-success">Paid</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(paidCommissions)}</p>
            </div>
            <div className="rounded-lg bg-warning/10 p-4">
              <p className="text-sm text-warning">Pending</p>
              <p className="text-2xl font-bold text-warning">{formatCurrency(pendingCommissions)}</p>
            </div>
          </div>
          <div className="space-y-3">
            {myCommissions.slice(0, 5).map((commission) => (
              <div
                key={commission.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{commission.clientName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(commission.date)}</p>
                </div>
                <p className="font-semibold text-foreground">{formatCurrency(commission.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
