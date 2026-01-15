// ============================================
// Salary Cost Page
// Maps to Excel: Recruitment Team Salary sheet
// Role-wise salary with auto-calculated totals
// ============================================

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRecruitmentStore } from '@/stores/recruitmentStore';
import {
  formatINR,
  getExperienceLevelLabel,
  ExperienceLevel,
  calculateTotalActual,
} from '@/lib/recruitmentData';
import { DollarSign, TrendingUp, Users, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['hsl(var(--primary))', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const SalaryCostPage: React.FC = () => {
  const {
    salaryMaster,
    recruitmentPlans,
    selectedYear,
    updateSalary,
    addSalaryEntry,
    deleteSalaryEntry,
    currentHRRole,
    getTotalRecruitmentCost,
  } = useRecruitmentStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    role: '',
    department: '',
    experienceLevel: 'mid' as ExperienceLevel,
    monthlySalary: 0,
  });

  const canEdit = currentHRRole === 'hr';
  const totalRecruitmentCost = getTotalRecruitmentCost();

  // Calculate totals
  const totalMonthlySalary = salaryMaster.reduce((sum, s) => sum + s.monthlySalary, 0);
  const totalYearlyCost = salaryMaster.reduce((sum, s) => sum + s.yearlyCost, 0);

  // Calculate cost by department for pie chart
  const costByDepartment = salaryMaster.reduce((acc, s) => {
    const yearPlans = recruitmentPlans.filter(
      (p) => p.year === selectedYear && p.role === s.role && p.experienceLevel === s.experienceLevel
    );
    const hires = yearPlans.reduce((sum, p) => sum + calculateTotalActual(p), 0);
    const cost = hires * s.yearlyCost;

    if (!acc[s.department]) {
      acc[s.department] = 0;
    }
    acc[s.department] += cost;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(costByDepartment)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const handleSalaryChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    updateSalary(id, numValue);
  };

  const handleAddEntry = () => {
    if (newEntry.role && newEntry.department && newEntry.monthlySalary > 0) {
      addSalaryEntry(newEntry);
      setNewEntry({ role: '', department: '', experienceLevel: 'mid', monthlySalary: 0 });
      setIsDialogOpen(false);
    }
  };

  // Group by department
  const groupedByDept = salaryMaster.reduce((acc, s) => {
    if (!acc[s.department]) {
      acc[s.department] = [];
    }
    acc[s.department].push(s);
    return acc;
  }, {} as Record<string, typeof salaryMaster>);

  return (
    <DashboardLayout
      title="Salary Cost Master"
      subtitle="Role-wise Salary Structure with Auto-calculated Monthly & Yearly Costs"
    >
      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <DollarSign className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Monthly Payroll</p>
              <p className="text-2xl font-bold text-primary">{formatINR(totalMonthlySalary)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50">
          <CardContent className="flex items-center gap-4 p-4">
            <TrendingUp className="h-10 w-10 text-secondary-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total Yearly Cost</p>
              <p className="text-2xl font-bold">{formatINR(totalYearlyCost)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="flex items-center gap-4 p-4">
            <Users className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">FY {selectedYear} Recruitment Cost</p>
              <p className="text-2xl font-bold">{formatINR(totalRecruitmentCost)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Salary Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Salary Master</CardTitle>
            {canEdit && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Salary Entry</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Role Title</Label>
                      <Input
                        value={newEntry.role}
                        onChange={(e) => setNewEntry({ ...newEntry, role: e.target.value })}
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input
                        value={newEntry.department}
                        onChange={(e) => setNewEntry({ ...newEntry, department: e.target.value })}
                        placeholder="e.g., Engineering"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <Select
                        value={newEntry.experienceLevel}
                        onValueChange={(v) =>
                          setNewEntry({ ...newEntry, experienceLevel: v as ExperienceLevel })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fresher">Fresher</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="mid">Mid-Level</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly Salary (₹)</Label>
                      <Input
                        type="number"
                        value={newEntry.monthlySalary || ''}
                        onChange={(e) =>
                          setNewEntry({ ...newEntry, monthlySalary: parseInt(e.target.value) || 0 })
                        }
                        placeholder="e.g., 50000"
                      />
                    </div>
                    <Button onClick={handleAddEntry} className="w-full">
                      Add Entry
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Role</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Monthly Salary</TableHead>
                  <TableHead className="text-right">Yearly Cost</TableHead>
                  {canEdit && <TableHead className="w-20">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedByDept).map(([dept, entries]) => (
                  <React.Fragment key={dept}>
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={canEdit ? 5 : 4} className="font-semibold text-primary">
                        {dept}
                      </TableCell>
                    </TableRow>
                    {entries.map((salary) => (
                      <TableRow key={salary.id}>
                        <TableCell className="font-medium">{salary.role}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getExperienceLevelLabel(salary.experienceLevel)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {canEdit ? (
                            <Input
                              type="number"
                              value={salary.monthlySalary}
                              onChange={(e) => handleSalaryChange(salary.id, e.target.value)}
                              className="w-32 text-right ml-auto"
                            />
                          ) : (
                            formatINR(salary.monthlySalary)
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {/* Excel formula: Yearly = Monthly × 12 */}
                          {formatINR(salary.yearlyCost)}
                        </TableCell>
                        {canEdit && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteSalaryEntry(salary.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
                {/* Totals Row */}
                <TableRow className="bg-primary/5 font-bold">
                  <TableCell colSpan={2}>TOTAL</TableCell>
                  <TableCell className="text-right">{formatINR(totalMonthlySalary)}</TableCell>
                  <TableCell className="text-right">{formatINR(totalYearlyCost)}</TableCell>
                  {canEdit && <TableCell></TableCell>}
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Cost Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatINR(value)}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No hiring data for current year
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Impact on Profitability Note */}
      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Impact on Profitability:</strong> The total
            recruitment cost of {formatINR(totalRecruitmentCost)} for FY {selectedYear} will be
            added to operational expenses. This affects the PBT (Profit Before Tax) calculation on
            the CEO Dashboard.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};
