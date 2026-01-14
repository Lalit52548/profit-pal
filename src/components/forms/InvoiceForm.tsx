import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { clients, projects } from '@/lib/mockData';
import { FileText, Building2, Calendar, Plus, Trash2, DollarSign } from 'lucide-react';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0, 'Unit price must be at least 0'),
});

const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  clientId: z.string().min(1, 'Please select a client'),
  projectId: z.string().min(1, 'Please select a project'),
  issueDate: z.string().min(1, 'Please select an issue date'),
  dueDate: z.string().min(1, 'Please select a due date'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<InvoiceFormData>;
  isEdit?: boolean;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEdit = false,
}) => {
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      clientId: '',
      projectId: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: '',
      taxRate: 0,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const selectedClientId = form.watch('clientId');
  const clientProjects = projects.filter((p) => p.clientId === selectedClientId);
  const lineItems = form.watch('lineItems');
  const taxRate = form.watch('taxRate') || 0;

  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Invoice Header */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Invoice Information</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Invoice Number */}
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Invoice Number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="INV-2024-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Issue Date */}
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Issue Date
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Due Date
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
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
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('projectId', '');
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            {/* Project */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!selectedClientId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedClientId ? "Select project" : "Select client first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Line Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-3 text-sm font-medium text-muted-foreground px-1">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            {fields.map((field, index) => {
              const itemTotal = (lineItems[index]?.quantity || 0) * (lineItems[index]?.unitPrice || 0);
              return (
                <div key={field.id} className="grid grid-cols-12 gap-3 items-start">
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormControl>
                          <Input placeholder="Service description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Input type="number" min={0} step={0.01} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-1 flex items-center justify-end h-10 text-sm font-medium">
                    ${itemTotal.toLocaleString()}
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="h-10 w-10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-end gap-8 text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium w-24 text-right">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-end items-center gap-4">
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel className="text-sm text-muted-foreground">Tax Rate:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        className="w-20 h-8"
                        {...field}
                      />
                    </FormControl>
                    <span className="text-sm">%</span>
                  </FormItem>
                )}
              />
              <span className="font-medium w-24 text-right">${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-end gap-8 text-lg font-bold pt-2 border-t border-border">
              <span>Total:</span>
              <span className="w-24 text-right text-primary">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes / Terms (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Payment terms, additional notes, thank you message..."
                  className="min-h-[80px] resize-none"
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
          <Button type="submit" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit">
            {isEdit ? 'Update Invoice' : 'Create & Send Invoice'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
