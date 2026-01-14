import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { clients, formatCurrency, formatDate } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Plus, Building2, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientForm } from '@/components/forms/ClientForm';
import { toast } from 'sonner';

export const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      default:
        return 'badge-primary';
    }
  };

  return (
    <DashboardLayout title="Clients" subtitle="Manage your client relationships">
      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Enter the client details below. The client owner will earn commissions from all payments.</DialogDescription>
          </DialogHeader>
          <ClientForm 
            onSubmit={(data) => {
              toast.success('Client added successfully!');
              setIsFormOpen(false);
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Clients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{client.company}</h3>
                  <p className="text-sm text-muted-foreground">{client.name}</p>
                </div>
              </div>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', getStatusStyle(client.status))}>
                {client.status}
              </span>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Owner: {client.ownerName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(client.totalRevenue)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Since</p>
                <p className="text-sm font-medium text-foreground">{formatDate(client.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No clients found</h3>
          <p className="text-muted-foreground">Try adjusting your search term</p>
        </div>
      )}
    </DashboardLayout>
  );
};
