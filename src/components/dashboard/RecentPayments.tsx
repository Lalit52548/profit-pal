import React from 'react';
import { payments, formatCurrency, formatDate } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const RecentPayments: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const sortedPayments = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="chart-container animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Payments</h3>
          <p className="text-sm text-muted-foreground">Latest payment transactions</p>
        </div>
      </div>
      <div className="space-y-4">
        {sortedPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-center gap-4">
              {getStatusIcon(payment.status)}
              <div>
                <p className="font-medium text-foreground">{payment.clientName}</p>
                <p className="text-sm text-muted-foreground">{payment.projectName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{formatCurrency(payment.amount)}</p>
              <p className="text-sm text-muted-foreground">{formatDate(payment.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
