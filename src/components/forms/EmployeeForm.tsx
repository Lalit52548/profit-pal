import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { User, Mail, Briefcase, Percent, Calendar } from 'lucide-react';

const employeeFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'manager', 'employee', 'finance']),
  department: z.string().min(2, 'Department must be at least 2 characters').max(50, 'Department must be less than 50 characters'),
  commissionRate: z.coerce.number().min(0, 'Commission rate must be at least 0%').max(100, 'Commission rate cannot exceed 100%'),
  joinDate: z.string().min(1, 'Please select a join date'),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<EmployeeFormData>;
  isEdit?: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEdit = false,
}) => {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'employee',
      department: '',
      commissionRate: 5,
      joinDate: new Date().toISOString().split('T')[0],
      ...defaultValues,
    },
  });

  const departments = [
    'Sales',
    'Development',
    'Design',
    'Marketing',
    'Finance',
    'Management',
    'HR',
    'Support',
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g., john@company.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Determines access level in the system
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Department */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Department
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Commission Rate */}
          <FormField
            control={form.control}
            name="commissionRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  Commission Rate (%)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    placeholder="e.g., 5"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Percentage of client revenue paid as commission
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Join Date */}
          <FormField
            control={form.control}
            name="joinDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Join Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
