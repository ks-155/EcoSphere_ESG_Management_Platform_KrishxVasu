"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, FormDialog, ConfirmDelete, PageHeader } from "@/components/shared";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
} from "@/lib/hooks/use-master-data";
import type { Goal } from "@/types/master-data";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["ENVIRONMENTAL", "SOCIAL", "GOVERNANCE"]),
  targetValue: z.number().positive("Target must be positive"),
  currentValue: z.number().min(0).default(0),
  unit: z.string().min(1, "Unit is required"),
  deadline: z.string().min(1, "Deadline is required"),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "ACHIEVED", "CANCELLED"]),
  departmentId: z.string().optional(),
  timeframe: z.enum(["QUARTERLY", "ANNUAL", "MULTI_YEAR"]),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "name", label: "Name", type: "text" as const, placeholder: "Reduce CO₂ by 20%", required: true },
  { name: "description", label: "Description", type: "textarea" as const },
  {
    name: "type", label: "Type", type: "select" as const, required: true,
    options: [
      { label: "Environmental", value: "ENVIRONMENTAL" },
      { label: "Social", value: "SOCIAL" },
      { label: "Governance", value: "GOVERNANCE" },
    ],
  },
  { name: "targetValue", label: "Target Value", type: "number" as const, placeholder: "100", required: true },
  { name: "currentValue", label: "Current Value", type: "number" as const, placeholder: "0" },
  { name: "unit", label: "Unit", type: "text" as const, placeholder: "tons CO₂e", required: true },
  { name: "deadline", label: "Deadline", type: "date" as const, required: true },
  {
    name: "status", label: "Status", type: "select" as const,
    options: [
      { label: "Not Started", value: "NOT_STARTED" },
      { label: "In Progress", value: "IN_PROGRESS" },
      { label: "Achieved", value: "ACHIEVED" },
      { label: "Cancelled", value: "CANCELLED" },
    ],
  },
  { name: "departmentId", label: "Department ID", type: "text" as const, placeholder: "Optional" },
  {
    name: "timeframe", label: "Timeframe", type: "select" as const,
    options: [
      { label: "Quarterly", value: "QUARTERLY" },
      { label: "Annual", value: "ANNUAL" },
      { label: "Multi-Year", value: "MULTI_YEAR" },
    ],
  },
];

const statusVariants: Record<string, "default" | "success" | "warning" | "secondary" | "destructive"> = {
  NOT_STARTED: "secondary",
  IN_PROGRESS: "default",
  ACHIEVED: "success",
  CANCELLED: "destructive",
};

export default function GoalsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Goal | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useGoals();
  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();
  const deleteMutation = useDeleteGoal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", type: "ENVIRONMENTAL", targetValue: 0, currentValue: 0, unit: "", deadline: "", status: "NOT_STARTED", departmentId: "", timeframe: "ANNUAL" },
  });

  const columns: ColumnDef<Goal>[] = useMemo(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "targetValue",
      header: "Target",
      cell: ({ row }) => `${row.original.targetValue} ${row.original.unit}`,
    },
    {
      accessorKey: "currentValue",
      header: "Progress",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min((row.original.currentValue / row.original.targetValue) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs">{Math.round((row.original.currentValue / row.original.targetValue) * 100)}%</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={statusVariants[row.original.status] || "secondary"}>{row.original.status.replace("_", " ")}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(row.original); form.reset(row.original); setDialogOpen(true); }}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeletingId(row.original.id); setDeleteOpen(true); }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ], []);

  function onSubmit(values: FormValues) {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: values }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createMutation.mutate(values, { onSuccess: () => setDialogOpen(false) });
    }
  }

  return (
    <>
      <PageHeader title="Goals" description="Manage environmental, social, and governance goals" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ name: "", description: "", type: "ENVIRONMENTAL", targetValue: 0, currentValue: 0, unit: "", deadline: "", status: "NOT_STARTED", departmentId: "", timeframe: "ANNUAL" }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Goal
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search goals..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Goal" : "Create Goal"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
