import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { commissions, employees, formatCurrency, formatDate } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export const CommissionsPage: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter commissions based on role
  const userCommissions = currentRole === 'employee'
    ? commissions.filter((c) => c.employeeId === currentUser?.id)
    : commissions;

  const filteredCommissions = userCommissions.filter((commission) => {
    const matchesSearch =
      commission.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCommissions = [...filteredCommissions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate totals
  const totalPaid = userCommissions.filter((c) => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
  const totalPending = userCommissions.filter((c) => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
  const totalAmount = totalPaid + totalPending;

  // Employee summary
  const employeeSummary = employees
    .filter((e) => e.role === 'employee' || e.role === 'manager')
    .map((employee) => {
      const empCommissions = commissions.filter((c) => c.employeeId === employee.id);
      return {
        ...employee,
        totalCommission: empCommissions.reduce((sum, c) => sum + c.amount, 0),
        paidCommission: empCommissions.filter((c) => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0),
        pendingCommission: empCommissions.filter((c) => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0),
      };
    })
    .filter((e) => e.totalCommission > 0)
    .sort((a, b) => b.totalCommission - a.totalCommission);

  const statuses = ['all', 'paid', 'pending'];

  return (
    <DashboardLayout title="Commissions" subtitle="Track employee earnings from client acquisition">
      {/* Summary Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-primary/5 p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Commissions</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-success/5 p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-warning/5 p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">{formatCurrency(totalPending)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Summary (Admin/Finance only) */}
      {(currentRole === 'admin' || currentRole === 'finance') && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Employee Summary</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {employeeSummary.map((employee) => (
              <div key={employee.id} className="rounded-lg border border-border bg-background p-4">
                <p className="font-medium text-foreground">{employee.name}</p>
                <p className="text-sm text-muted-foreground">{employee.commissionRate}% rate</p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-success">{formatCurrency(employee.paidCommission)}</span>
                  {employee.pendingCommission > 0 && (
                    <span className="text-warning">+{formatCurrency(employee.pendingCommission)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search commissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Client</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedCommissions.map((commission) => (
                <tr key={commission.id} className="animate-fade-in">
                  <td className="font-medium">{commission.employeeName}</td>
                  <td className="text-muted-foreground">{commission.clientName}</td>
                  <td>{commission.rate}%</td>
                  <td className="font-semibold text-success">{formatCurrency(commission.amount)}</td>
                  <td className="text-muted-foreground">{formatDate(commission.date)}</td>
                  <td>
                    <span className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                      commission.status === 'paid' ? 'badge-success' : 'badge-warning'
                    )}>
                      {commission.status === 'paid' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {commission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedCommissions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No commissions found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </DashboardLayout>
  );
};
