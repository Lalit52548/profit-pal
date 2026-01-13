import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { projects, employees, formatCurrency, formatDate } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Calendar, DollarSign, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-primary';
      case 'completed':
        return 'badge-success';
      case 'on-hold':
        return 'badge-warning';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'badge-primary';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary';
      case 'completed':
        return 'bg-success';
      case 'on-hold':
        return 'bg-warning';
      default:
        return 'bg-muted';
    }
  };

  const calculateProgress = (project: typeof projects[0]) => {
    if (project.status === 'completed') return 100;
    if (project.status === 'cancelled' || project.status === 'on-hold') return 0;
    const total = new Date(project.endDate).getTime() - new Date(project.startDate).getTime();
    const elapsed = Date.now() - new Date(project.startDate).getTime();
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const statuses = ['all', 'active', 'completed', 'on-hold', 'cancelled'];

  return (
    <DashboardLayout title="Projects" subtitle="Track and manage all projects">
      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredProjects.map((project) => {
          const assignedEmployeeNames = project.assignedEmployees
            .map((id) => employees.find((e) => e.id === id)?.name.split(' ')[0])
            .filter(Boolean)
            .join(', ');

          return (
            <div
              key={project.id}
              className="animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.clientName}</p>
                </div>
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', getStatusStyle(project.status))}>
                  {project.status}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{Math.round(calculateProgress(project))}%</span>
                </div>
                <Progress value={calculateProgress(project)} className="h-2" />
              </div>

              {/* Details Grid */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Contract</span>
                  </div>
                  <p className="font-semibold text-foreground">{formatCurrency(project.contractValue)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Profit</span>
                  </div>
                  <p className={cn('font-semibold', project.profit >= 0 ? 'text-success' : 'text-destructive')}>
                    {formatCurrency(project.profit)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{assignedEmployeeNames}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No projects found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </DashboardLayout>
  );
};
