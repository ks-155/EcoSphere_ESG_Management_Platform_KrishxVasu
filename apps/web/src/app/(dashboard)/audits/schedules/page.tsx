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
  useAudits,
  useCreateAudit,
  useUpdateAudit,
  useDeleteAudit,
} from "@/lib/hooks/use-master-data";
import type { Audit } from "@/types/master-data";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "title", label: "Title", type: "text" as const, placeholder: "Q1 ESG Audit", required: true },
  { name: "description", label: "Description", type: "textarea" as const },
  { name: "date", label: "Date", type: "date" as const, required: true },
  {
    name: "status", label: "Status", type: "select" as const,
    options: [
      { label: "Planned", value: "PLANNED" },
      { label: "In Progress", value: "IN_PROGRESS" },
      { label: "Completed", value: "COMPLETED" },
    ],
  },
];

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  PLANNED: "secondary",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
};

export default function AuditSchedulesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Audit | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useAudits();
  const createMutation = useCreateAudit();
  const updateMutation = useUpdateAudit();
  const deleteMutation = useDeleteAudit();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", date: "", status: "PLANNED" },
  });

  const columns: ColumnDef<Audit>[] = useMemo(() => [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "date", header: "Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={statusVariant[row.original.status] || "secondary"}>{row.original.status}</Badge>,
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
      <PageHeader title="Audit Schedules" description="Plan and manage ESG audits" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ title: "", description: "", date: "", status: "PLANNED" }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Schedule Audit
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search audits..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Audit" : "New Audit"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
