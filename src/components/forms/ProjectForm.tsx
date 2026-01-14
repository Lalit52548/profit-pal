import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { clients, employees } from '@/lib/mockData';
import { Folder, Building2, DollarSign, Calendar, Users } from 'lucide-react';

const projectFormSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').max(100, 'Project name must be less than 100 characters'),
  clientId: z.string().min(1, 'Please select a client'),
  contractValue: z.coerce.number().min(1, 'Contract value must be greater than 0'),
  projectCost: z.coerce.number().min(0, 'Project cost must be at least 0'),
  startDate: z.string().min(1, 'Please select a start date'),
  endDate: z.string().min(1, 'Please select an end date'),
  assignedEmployees: z.array(z.string()).min(1, 'Please assign at least one employee'),
  status: z.enum(['active', 'completed', 'on-hold', 'cancelled']),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<ProjectFormData>;
  isEdit?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEdit = false,
}) => {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      clientId: '',
      contractValue: 0,
      projectCost: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      assignedEmployees: [],
      status: 'active',
      description: '',
      ...defaultValues,
    },
  });

  const activeClients = clients.filter((c) => c.status === 'active');
  const assignableEmployees = employees.filter(
    (e) => e.role === 'employee' || e.role === 'manager'
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Project Details</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    Project Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., E-commerce Platform Development"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Client */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Client
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company} ({client.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Financial Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Financials</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Contract Value */}
            <FormField
              control={form.control}
              name="contractValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Contract Value ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="e.g., 50000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Total agreed value with the client
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Cost */}
            <FormField
              control={form.control}
              name="projectCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Estimated Cost ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="e.g., 30000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Expected project expenses
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Timeline</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Start Date
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    End Date
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Team Assignment</h3>
          <FormField
            control={form.control}
            name="assignedEmployees"
            render={() => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Assigned Employees
                </FormLabel>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mt-2">
                  {assignableEmployees.map((employee) => (
                    <FormField
                      key={employee.id}
                      control={form.control}
                      name="assignedEmployees"
                      render={({ field }) => (
                        <FormItem
                          key={employee.id}
                          className="flex items-center space-x-3 space-y-0 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(employee.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, employee.id])
                                  : field.onChange(
                                      field.value?.filter((v) => v !== employee.id)
                                    );
                              }}
                            />
                          </FormControl>
                          <div className="space-y-0.5 leading-none">
                            <FormLabel className="text-sm font-medium cursor-pointer">
                              {employee.name}
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              {employee.department}
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the project scope and deliverables..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
