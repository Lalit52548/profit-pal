// ============================================
// Previous Year Employees Page
// Maps to Excel: Previous Year Employees sheet
// List with filters by year & role
// ============================================

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Label } from '@/components/ui/label';
import { useRecruitmentStore } from '@/stores/recruitmentStore';
import { formatINR, getFinancialYears } from '@/lib/recruitmentData';
import { formatDate } from '@/lib/mockData';
import { Users, Search, Plus, Calendar, DollarSign, Building2 } from 'lucide-react';

export const PreviousEmployeesPage: React.FC = () => {
  const { previousEmployees, addEmployee, currentHRRole } = useRecruitmentStore();
  
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    department: '',
    joinDate: '',
    year: '2024-25',
    monthlySalary: 0,
  });

  const canEdit = currentHRRole === 'hr';

  // Get unique roles for filter
  const uniqueRoles = useMemo(() => {
    return [...new Set(previousEmployees.map((e) => e.role))];
  }, [previousEmployees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return previousEmployees.filter((emp) => {
      const matchesYear = filterYear === 'all' || emp.year === filterYear;
      const matchesRole = filterRole === 'all' || emp.role === filterRole;
      const matchesSearch =
        searchQuery === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesYear && matchesRole && matchesSearch;
    });
  }, [previousEmployees, filterYear, filterRole, searchQuery]);

  // Calculate totals
  const totalSalary = filteredEmployees.reduce((sum, e) => sum + e.monthlySalary, 0);
  const activeCount = filteredEmployees.filter((e) => !e.exitDate).length;
  const exitedCount = filteredEmployees.filter((e) => e.exitDate).length;

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.role && newEmployee.department) {
      addEmployee(newEmployee);
      setNewEmployee({
        name: '',
        role: '',
        department: '',
        joinDate: '',
        year: '2024-25',
        monthlySalary: 0,
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <DashboardLayout
      title="Previous Year Employees"
      subtitle="Historical Employee Records with Year & Role Filters"
    >
      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold">{filteredEmployees.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Building2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Calendar className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">Exited</p>
              <p className="text-2xl font-bold text-amber-600">{exitedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Monthly Salary</p>
              <p className="text-xl font-bold">{formatINR(totalSalary)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Year Filter */}
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {getFinancialYears().map((year) => (
                    <SelectItem key={year} value={year}>
                      FY {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Role Filter */}
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {canEdit && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Previous Year Employee</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        placeholder="e.g., John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                          value={newEmployee.role}
                          onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Input
                          value={newEmployee.department}
                          onChange={(e) =>
                            setNewEmployee({ ...newEmployee, department: e.target.value })
                          }
                          placeholder="e.g., Engineering"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Join Date</Label>
                        <Input
                          type="date"
                          value={newEmployee.joinDate}
                          onChange={(e) =>
                            setNewEmployee({ ...newEmployee, joinDate: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Financial Year</Label>
                        <Select
                          value={newEmployee.year}
                          onValueChange={(v) => setNewEmployee({ ...newEmployee, year: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getFinancialYears().map((year) => (
                              <SelectItem key={year} value={year}>
                                FY {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly Salary (₹)</Label>
                      <Input
                        type="number"
                        value={newEmployee.monthlySalary || ''}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            monthlySalary: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="e.g., 50000"
                      />
                    </div>
                    <Button onClick={handleAddEmployee} className="w-full">
                      Add Employee
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Employee Records ({filteredEmployees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Exit Date</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Monthly Salary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No employees found matching the filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.role}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{formatDate(emp.joinDate)}</TableCell>
                    <TableCell>
                      {emp.exitDate ? formatDate(emp.exitDate) : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">FY {emp.year}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatINR(emp.monthlySalary)}
                    </TableCell>
                    <TableCell>
                      {emp.exitDate ? (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                          Exited
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};
