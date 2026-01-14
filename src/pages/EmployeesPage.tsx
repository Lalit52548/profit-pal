import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { employees, clients, commissions, formatCurrency, formatDate } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Plus, User, Mail, Briefcase, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { toast } from 'sonner';

export const EmployeesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-primary/10 text-primary';
      case 'manager':
        return 'bg-accent/10 text-accent';
      case 'finance':
        return 'badge-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getEmployeeStats = (employeeId: string) => {
    const employeeClients = clients.filter((c) => c.ownerId === employeeId);
    const employeeCommissions = commissions.filter((c) => c.employeeId === employeeId);
    const totalRevenue = employeeClients.reduce((sum, c) => sum + c.totalRevenue, 0);
    const totalCommission = employeeCommissions.reduce((sum, c) => sum + c.amount, 0);
    return { clientCount: employeeClients.length, totalRevenue, totalCommission };
  };

  return (
    <DashboardLayout title="Employees" subtitle="Team management and performance">
      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter employee details including role and commission rate.</DialogDescription>
          </DialogHeader>
          <EmployeeForm 
            onSubmit={(data) => {
              toast.success('Employee added successfully!');
              setIsFormOpen(false);
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Employees Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => {
          const stats = getEmployeeStats(employee.id);

          return (
            <div
              key={employee.id}
              className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{employee.name}</h3>
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', getRoleBadge(employee.role))}>
                      {employee.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{employee.department}</p>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>Joined {formatDate(employee.joinDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Percent className="h-4 w-4" />
                  <span>{employee.commissionRate}% commission rate</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Clients</p>
                  <p className="text-lg font-bold text-foreground">{stats.clientCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-sm font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Commission</p>
                  <p className="text-sm font-bold text-success">{formatCurrency(stats.totalCommission)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <User className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No employees found</h3>
          <p className="text-muted-foreground">Try adjusting your search term</p>
        </div>
      )}
    </DashboardLayout>
  );
};
