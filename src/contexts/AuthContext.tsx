import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, employees, Employee } from '@/lib/mockData';

interface AuthContextType {
  currentUser: Employee | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  
  // Get the current user based on role (for demo purposes)
  const getCurrentUser = (role: UserRole): Employee | null => {
    return employees.find(e => e.role === role) || null;
  };

  const value: AuthContextType = {
    currentUser: getCurrentUser(currentRole),
    currentRole,
    setCurrentRole,
    isAuthenticated: true, // For demo purposes
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
