import React from 'react';
import { projects, formatCurrency, formatDate } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export const ProjectsTable: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'badge-primary',
      completed: 'badge-success',
      'on-hold': 'badge-warning',
      cancelled: 'bg-destructive/10 text-destructive',
    };
    return styles[status] || 'badge-primary';
  };

  return (
    <div className="chart-container animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Active Projects</h3>
          <p className="text-sm text-muted-foreground">Overview of all ongoing projects</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Contract Value</th>
              <th>Revenue</th>
              <th>Profit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.slice(0, 5).map((project) => (
              <tr key={project.id}>
                <td className="font-medium">{project.name}</td>
                <td className="text-muted-foreground">{project.clientName}</td>
                <td>{formatCurrency(project.contractValue)}</td>
                <td>{formatCurrency(project.revenue)}</td>
                <td className={cn(project.profit >= 0 ? 'text-success' : 'text-destructive', 'font-medium')}>
                  {formatCurrency(project.profit)}
                </td>
                <td>
                  <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', getStatusBadge(project.status))}>
                    {project.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
