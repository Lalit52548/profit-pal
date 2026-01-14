import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { employees } from '@/lib/mockData';
import { Percent, User, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const commissionConfigSchema = z.object({
  employeeId: z.string().min(1, 'Please select an employee'),
  baseRate: z.coerce.number().min(0, 'Rate must be at least 0%').max(50, 'Rate cannot exceed 50%'),
  bonusThreshold: z.coerce.number().min(0, 'Threshold must be at least 0'),
  bonusRate: z.coerce.number().min(0, 'Bonus rate must be at least 0%').max(20, 'Bonus rate cannot exceed 20%'),
  effectiveDate: z.string().min(1, 'Please select an effective date'),
  payoutFrequency: z.enum(['monthly', 'quarterly', 'per-payment']),
  autoCalculate: z.boolean(),
  minimumPayment: z.coerce.number().min(0, 'Minimum must be at least 0'),
});

type CommissionConfigData = z.infer<typeof commissionConfigSchema>;

interface CommissionConfigFormProps {
  onSubmit: (data: CommissionConfigData) => void;
  onCancel: () => void;
  defaultValues?: Partial<CommissionConfigData>;
  isEdit?: boolean;
}

export const CommissionConfigForm: React.FC<CommissionConfigFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEdit = false,
}) => {
  const form = useForm<CommissionConfigData>({
    resolver: zodResolver(commissionConfigSchema),
    defaultValues: {
      employeeId: '',
      baseRate: 5,
      bonusThreshold: 50000,
      bonusRate: 2,
      effectiveDate: new Date().toISOString().split('T')[0],
      payoutFrequency: 'monthly',
      autoCalculate: true,
      minimumPayment: 100,
      ...defaultValues,
    },
  });

  const eligibleEmployees = employees.filter(
    (e) => e.role === 'employee' || e.role === 'manager'
  );

  const baseRate = form.watch('baseRate');
  const bonusRate = form.watch('bonusRate');
  const bonusThreshold = form.watch('bonusThreshold');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Employee Selection */}
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Employee
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee to configure" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eligibleEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.department} (Current: {employee.commissionRate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Commission Rates */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Commission Structure</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Base Rate */}
            <FormField
              control={form.control}
              name="baseRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    Base Commission Rate (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={50}
                      step={0.5}
                      placeholder="e.g., 5"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Standard commission rate for all payments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bonus Threshold */}
            <FormField
              control={form.control}
              name="bonusThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Bonus Threshold ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="e.g., 50000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Revenue threshold to earn bonus rate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bonus Rate */}
            <FormField
              control={form.control}
              name="bonusRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    Bonus Rate (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      placeholder="e.g., 2"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional rate when threshold is met
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Minimum Payment */}
            <FormField
              control={form.control}
              name="minimumPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Minimum Payout ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={50}
                      placeholder="e.g., 100"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum commission before payout
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Payout Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Payout Settings</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Effective Date */}
            <FormField
              control={form.control}
              name="effectiveDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Effective Date
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    When this configuration takes effect
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payout Frequency */}
            <FormField
              control={form.control}
              name="payoutFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payout Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="per-payment">Per Payment</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How often commissions are paid out
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Auto Calculate */}
          <FormField
            control={form.control}
            name="autoCalculate"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Automatic Calculation</FormLabel>
                  <FormDescription>
                    Automatically calculate commissions when payments are recorded
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Preview */}
        <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2">
          <h4 className="font-medium text-foreground">Commission Preview</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">For a $10,000 payment:</span>
              <p className="font-semibold text-success">${(10000 * baseRate / 100).toLocaleString()} commission</p>
            </div>
            <div>
              <span className="text-muted-foreground">After ${bonusThreshold.toLocaleString()} revenue:</span>
              <p className="font-semibold text-success">{baseRate + bonusRate}% total rate</p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? 'Update Configuration' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
