import React from 'react';
import { commissions, employees, formatCurrency } from '@/lib/mockData';
import { TrendingUp } from 'lucide-react';

export const CommissionsSummary: React.FC = () => {
  // Calculate total commissions per employee
  const employeeCommissions = employees
    .filter((e) => e.role === 'employee' || e.role === 'manager')
    .map((employee) => {
      const employeeComms = commissions.filter((c) => c.employeeId === employee.id);
      const totalCommission = employeeComms.reduce((sum, c) => sum + c.amount, 0);
      const paidCommission = employeeComms
        .filter((c) => c.status === 'paid')
        .reduce((sum, c) => sum + c.amount, 0);
      const pendingCommission = employeeComms
        .filter((c) => c.status === 'pending')
        .reduce((sum, c) => sum + c.amount, 0);
      
      return {
        ...employee,
        totalCommission,
        paidCommission,
        pendingCommission,
      };
    })
    .filter((e) => e.totalCommission > 0)
    .sort((a, b) => b.totalCommission - a.totalCommission);

  return (
    <div className="chart-container animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Commission Summary</h3>
          <p className="text-sm text-muted-foreground">Employee earnings from client acquisition</p>
        </div>
      </div>
      <div className="space-y-4">
        {employeeCommissions.map((employee) => (
          <div
            key={employee.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{employee.name}</p>
                <p className="text-sm text-muted-foreground">{employee.commissionRate}% rate</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{formatCurrency(employee.totalCommission)}</p>
              <div className="flex gap-2 text-xs">
                <span className="text-success">Paid: {formatCurrency(employee.paidCommission)}</span>
                {employee.pendingCommission > 0 && (
                  <span className="text-warning">Pending: {formatCurrency(employee.pendingCommission)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
