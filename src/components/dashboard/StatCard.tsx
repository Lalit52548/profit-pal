import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  // New props for HR module compatibility
  trend?: {
    value: string;
    positive: boolean;
  };
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  description,
  icon: Icon,
  iconColor = 'text-primary',
  className,
}) => {
  return (
    <div className={cn('stat-card animate-fade-in', className)}>
      <div className="stat-card-gradient" />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {/* Original change prop */}
          {change && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  change.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
          {/* New trend prop for HR module */}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.positive ? 'text-green-600' : 'text-destructive'
                )}
              >
                {trend.value}
              </span>
            </div>
          )}
          {/* New description prop */}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10', iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
