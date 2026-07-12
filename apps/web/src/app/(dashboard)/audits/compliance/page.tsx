"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, FormDialog, ConfirmDelete, PageHeader } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useComplianceIssues,
  useCreateComplianceIssue,
  useUpdateComplianceIssue,
  useDeleteComplianceIssue,
} from "@/lib/hooks/use-master-data";
import type { ComplianceIssue } from "@/types/master-data";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  ownerId: z.string().min(1, "Owner is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "description", label: "Description", type: "textarea" as const, placeholder: "Describe the compliance issue...", required: true },
  {
    name: "severity", label: "Severity", type: "select" as const,
    options: [
      { label: "Low", value: "LOW" },
      { label: "Medium", value: "MEDIUM" },
      { label: "High", value: "HIGH" },
      { label: "Critical", value: "CRITICAL" },
    ],
  },
  { name: "ownerId", label: "Owner ID", type: "text" as const, placeholder: "User ID", required: true },
  { name: "dueDate", label: "Due Date", type: "date" as const, required: true },
  {
    name: "status", label: "Status", type: "select" as const,
    options: [
      { label: "Open", value: "OPEN" },
      { label: "In Progress", value: "IN_PROGRESS" },
      { label: "Resolved", value: "RESOLVED" },
      { label: "Closed", value: "CLOSED" },
    ],
  },
];

const severityVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  LOW: "default",
  MEDIUM: "warning",
  HIGH: "destructive",
  CRITICAL: "destructive",
};

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  OPEN: "destructive",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "secondary",
};

export default function ComplianceIssuesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ComplianceIssue | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useComplianceIssues();
  const createMutation = useCreateComplianceIssue();
  const updateMutation = useUpdateComplianceIssue();
  const deleteMutation = useDeleteComplianceIssue();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "", severity: "MEDIUM", ownerId: "", dueDate: "", status: "OPEN" },
  });

  const columns: ColumnDef<ComplianceIssue>[] = useMemo(() => [
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => <Badge variant={severityVariant[row.original.severity] || "default"}>{row.original.severity}</Badge>,
    },
    { accessorKey: "description", header: "Issue" },
    { accessorKey: "dueDate", header: "Due Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={statusVariant[row.original.status] || "secondary"}>{row.original.status}</Badge>,
    },
    { accessorKey: "isOverdue", header: "Overdue", cell: ({ row }) => row.original.isOverdue ? <Badge variant="destructive">Yes</Badge> : <Badge variant="secondary">No</Badge> },
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
      <PageHeader title="Compliance Issues" description="Track and resolve compliance findings" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ description: "", severity: "MEDIUM", ownerId: "", dueDate: "", status: "OPEN" }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Issue
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search issues..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Issue" : "New Compliance Issue"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
