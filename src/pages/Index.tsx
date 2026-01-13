import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';
import { FinanceDashboard } from './FinanceDashboard';

const Index: React.FC = () => {
  const { currentRole } = useAuth();

  switch (currentRole) {
    case 'admin':
    case 'manager':
      return <AdminDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    case 'finance':
      return <FinanceDashboard />;
    default:
      return <AdminDashboard />;
  }
};

export default Index;
