"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface FormFieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "switch" | "textarea" | "date";
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | boolean }[];
  min?: number;
  max?: number;
}

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  form: UseFormReturn<any>;
  fields: FormFieldConfig[];
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  form,
  fields,
  onSubmit,
  loading = false,
}: FormDialogProps) {
  useEffect(() => {
    if (!open) form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.label}
                      {field.required && <span className="ml-1 text-destructive">*</span>}
                    </FormLabel>
                    <FormControl>
                      {field.type === "select" ? (
                        <Select
                          value={String(formField.value ?? "")}
                          onValueChange={(val) =>
                            formField.onChange(
                              field.options?.find((o) => o.value === "true" || o.value === "false")
                                ? val === "true"
                                : val
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((opt) => (
                              <SelectItem key={String(opt.value)} value={String(opt.value)}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "switch" ? (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={Boolean(formField.value)}
                            onCheckedChange={formField.onChange}
                          />
                          <span className="text-sm text-muted-foreground">
                            {formField.value ? "Active" : "Inactive"}
                          </span>
                        </div>
                      ) : field.type === "textarea" ? (
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder={field.placeholder}
                          value={formField.value ?? ""}
                          onChange={formField.onChange}
                        />
                      ) : (
                        <Input
                          type={field.type === "number" ? "number" : "text"}
                          placeholder={field.placeholder}
                          value={formField.value ?? ""}
                          onChange={(e) =>
                            formField.onChange(
                              field.type === "number"
                                ? e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                                : e.target.value
                            )
                          }
                          min={field.min}
                          max={field.max}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
