import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { payments, formatCurrency, formatDate } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Plus, CheckCircle2, Clock, AlertCircle, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { toast } from 'sonner';

export const PaymentsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedPayments = [...filteredPayments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'received':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'overdue':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'badge-primary';
    }
  };

  const statuses = ['all', 'received', 'pending', 'overdue'];

  // Calculate totals
  const totals = {
    received: payments.filter((p) => p.status === 'received').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overdue: payments.filter((p) => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <DashboardLayout title="Payments" subtitle="Track all payment transactions">
      {/* Summary Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-success/5 p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(totals.received)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-warning/5 p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">{formatCurrency(totals.pending)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-destructive/5 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(totals.overdue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
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
        <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Record a payment received from a client. Commission will be calculated automatically.</DialogDescription>
          </DialogHeader>
          <PaymentForm 
            onSubmit={(data) => {
              toast.success('Payment recorded successfully!');
              setIsFormOpen(false);
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Payments Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.map((payment) => (
                <tr key={payment.id} className="animate-fade-in">
                  <td className="font-mono text-sm font-medium">{payment.invoiceNumber}</td>
                  <td>{payment.clientName}</td>
                  <td className="text-muted-foreground">{payment.projectName}</td>
                  <td className="font-semibold">{formatCurrency(payment.amount)}</td>
                  <td className="text-muted-foreground">{formatDate(payment.date)}</td>
                  <td>
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', getStatusStyle(payment.status))}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedPayments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Receipt className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No payments found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </DashboardLayout>
  );
};
