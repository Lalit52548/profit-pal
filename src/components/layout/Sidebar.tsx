import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  DollarSign, 
  BarChart3, 
  Settings,
  Building2,
  Receipt,
  TrendingUp,
  UserCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee', 'finance'] },
  { label: 'Clients', href: '/clients', icon: Building2, roles: ['admin', 'manager', 'employee'] },
  { label: 'Projects', href: '/projects', icon: FolderKanban, roles: ['admin', 'manager', 'employee'] },
  { label: 'Employees', href: '/employees', icon: Users, roles: ['admin', 'manager'] },
  { label: 'Payments', href: '/payments', icon: Receipt, roles: ['admin', 'finance'] },
  { label: 'Commissions', href: '/commissions', icon: DollarSign, roles: ['admin', 'finance', 'employee'] },
  { label: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'manager', 'finance'] },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser, currentRole } = useAuth();

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">TrackPro</h1>
            <p className="text-xs text-sidebar-foreground/50">Business Suite</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'sidebar-link',
                  isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <UserCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {currentUser?.name || 'User'}
              </p>
              <p className="truncate text-xs capitalize text-sidebar-foreground/60">
                {currentRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
