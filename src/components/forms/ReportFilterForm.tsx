import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { clients, employees, projects } from '@/lib/mockData';
import { Calendar, Filter, Download, RefreshCw } from 'lucide-react';

const reportFilterSchema = z.object({
  reportType: z.enum(['revenue', 'profit-loss', 'commissions', 'client-value', 'monthly-growth', 'yearly-growth']),
  dateFrom: z.string().min(1, 'Please select a start date'),
  dateTo: z.string().min(1, 'Please select an end date'),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  employeeId: z.string().optional(),
  groupBy: z.enum(['day', 'week', 'month', 'quarter', 'year']),
  includeProjected: z.boolean(),
  includeCancelled: z.boolean(),
  exportFormat: z.enum(['pdf', 'excel', 'csv']).optional(),
});

type ReportFilterData = z.infer<typeof reportFilterSchema>;

interface ReportFilterFormProps {
  onSubmit: (data: ReportFilterData) => void;
  onReset: () => void;
}

export const ReportFilterForm: React.FC<ReportFilterFormProps> = ({
  onSubmit,
  onReset,
}) => {
  const form = useForm<ReportFilterData>({
    resolver: zodResolver(reportFilterSchema),
    defaultValues: {
      reportType: 'revenue',
      dateFrom: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      dateTo: new Date().toISOString().split('T')[0],
      clientId: '',
      projectId: '',
      employeeId: '',
      groupBy: 'month',
      includeProjected: false,
      includeCancelled: false,
      exportFormat: 'pdf',
    },
  });

  const reportTypes = [
    { value: 'revenue', label: 'Revenue Report', description: 'Total revenue over time' },
    { value: 'profit-loss', label: 'Profit & Loss', description: 'Revenue vs expenses analysis' },
    { value: 'commissions', label: 'Employee Commissions', description: 'Commission payouts by employee' },
    { value: 'client-value', label: 'Client Value', description: 'Revenue per client analysis' },
    { value: 'monthly-growth', label: 'Monthly Growth', description: 'Month-over-month comparison' },
    { value: 'yearly-growth', label: 'Yearly Growth', description: 'Year-over-year comparison' },
  ];

  const selectedClientId = form.watch('clientId');
  const clientProjects = selectedClientId
    ? projects.filter((p) => p.clientId === selectedClientId)
    : projects;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Report Type */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Report Type</h3>
          <FormField
            control={form.control}
            name="reportType"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-auto py-3">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-muted-foreground">{type.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date Range */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Date Range</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="dateFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    From
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    To
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="groupBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group By</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grouping" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="day">Daily</SelectItem>
                      <SelectItem value="week">Weekly</SelectItem>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="quarter">Quarterly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters (Optional)
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Client Filter */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All clients" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All Clients</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Filter */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All projects" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All Projects</SelectItem>
                      {clientProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Employee Filter */}
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All employees" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All Employees</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Options</h3>
          <div className="flex flex-wrap gap-6">
            <FormField
              control={form.control}
              name="includeProjected"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5 leading-none">
                    <FormLabel className="cursor-pointer">Include Projected Data</FormLabel>
                    <FormDescription className="text-xs">
                      Show expected future revenue
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeCancelled"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5 leading-none">
                    <FormLabel className="cursor-pointer">Include Cancelled</FormLabel>
                    <FormDescription className="text-xs">
                      Include cancelled projects
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Export Format */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Export Format</h3>
          <FormField
            control={form.control}
            name="exportFormat"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-3">
                  {['pdf', 'excel', 'csv'].map((format) => (
                    <Button
                      key={format}
                      type="button"
                      variant={field.value === format ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => field.onChange(format)}
                      className="uppercase"
                    >
                      {format}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              form.reset();
              onReset();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
          <div className="flex gap-3">
            <Button type="submit" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button type="submit">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
