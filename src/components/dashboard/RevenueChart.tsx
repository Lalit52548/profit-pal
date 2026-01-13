import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { monthlyRevenueData } from '@/lib/mockData';

export const RevenueChart: React.FC = () => {
  return (
    <div className="chart-container animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue, costs, and profit</p>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(215, 16%, 47%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215, 16%, 47%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(214, 32%, 91%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(199, 89%, 48%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCost)"
              name="Cost"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProfit)"
              name="Profit"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
