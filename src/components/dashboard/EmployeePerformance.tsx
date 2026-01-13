import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { employees, clients, commissions, formatCurrency } from '@/lib/mockData';

const COLORS = ['hsl(199, 89%, 48%)', 'hsl(172, 66%, 50%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(280, 67%, 55%)'];

export const EmployeePerformance: React.FC = () => {
  // Calculate revenue brought by each employee
  const employeeRevenue = employees
    .filter((e) => e.role === 'employee' || e.role === 'manager')
    .map((employee) => {
      const employeeClients = clients.filter((c) => c.ownerId === employee.id);
      const totalRevenue = employeeClients.reduce((sum, c) => sum + c.totalRevenue, 0);
      return {
        name: employee.name.split(' ')[0],
        value: totalRevenue,
      };
    })
    .filter((e) => e.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="chart-container animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue by Employee</h3>
          <p className="text-sm text-muted-foreground">Client revenue attribution</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={employeeRevenue}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {employeeRevenue.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(214, 32%, 91%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
