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
  usePolicies,
  useCreatePolicy,
  useUpdatePolicy,
  useDeletePolicy,
} from "@/lib/hooks/use-master-data";
import type { Policy } from "@/types/master-data";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["ENVIRONMENTAL", "SOCIAL", "GOVERNANCE", "GENERAL"]),
  content: z.string().min(1, "Content is required"),
  version: z.string().min(1, "Version is required"),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  effectiveDate: z.string().min(1, "Effective date is required"),
  departmentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "title", label: "Title", type: "text" as const, placeholder: "Environmental Policy 2024", required: true },
  { name: "description", label: "Description", type: "textarea" as const },
  {
    name: "category", label: "Category", type: "select" as const, required: true,
    options: [
      { label: "Environmental", value: "ENVIRONMENTAL" },
      { label: "Social", value: "SOCIAL" },
      { label: "Governance", value: "GOVERNANCE" },
      { label: "General", value: "GENERAL" },
    ],
  },
  { name: "content", label: "Content", type: "textarea" as const, placeholder: "Policy content...", required: true },
  { name: "version", label: "Version", type: "text" as const, placeholder: "1.0", required: true },
  {
    name: "status", label: "Status", type: "select" as const,
    options: [
      { label: "Draft", value: "DRAFT" },
      { label: "Active", value: "ACTIVE" },
      { label: "Archived", value: "ARCHIVED" },
    ],
  },
  { name: "effectiveDate", label: "Effective Date", type: "date" as const, required: true },
];

const policyStatusVariants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  ACTIVE: "success",
  DRAFT: "warning",
  ARCHIVED: "secondary",
};

export default function PoliciesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Policy | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = usePolicies();
  const createMutation = useCreatePolicy();
  const updateMutation = useUpdatePolicy();
  const deleteMutation = useDeletePolicy();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", category: "GENERAL", content: "", version: "1.0", status: "DRAFT", effectiveDate: "", departmentId: "" },
  });

  const columns: ColumnDef<Policy>[] = useMemo(() => [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "version", header: "Version" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={(policyStatusVariants[row.original.status] || "secondary") as any}>{row.original.status}</Badge>,
    },
    { accessorKey: "effectiveDate", header: "Effective" },
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
      <PageHeader title="Policies" description="Manage ESG policies" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ title: "", description: "", category: "GENERAL", content: "", version: "1.0", status: "DRAFT", effectiveDate: "" }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Policy
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search policies..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Policy" : "Create Policy"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
