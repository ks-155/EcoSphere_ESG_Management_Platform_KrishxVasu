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
  useCsrActivities,
  useCreateCsrActivity,
  useUpdateCsrActivity,
  useDeleteCsrActivity,
} from "@/lib/hooks/use-master-data";
import type { CsrActivity } from "@/types/master-data";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "title", label: "Title", type: "text" as const, placeholder: "Beach Cleanup Drive", required: true },
  { name: "description", label: "Description", type: "textarea" as const },
  { name: "categoryId", label: "Category ID", type: "text" as const, placeholder: "Category ID", required: true },
  { name: "date", label: "Date", type: "date" as const, required: true },
];

export default function CsrInitiativesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CsrActivity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useCsrActivities();
  const createMutation = useCreateCsrActivity();
  const updateMutation = useUpdateCsrActivity();
  const deleteMutation = useDeleteCsrActivity();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", categoryId: "", date: "" },
  });

  const columns: ColumnDef<CsrActivity>[] = useMemo(() => [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "date", header: "Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={row.original.status ? "success" : "secondary"}>{row.original.status ? "Active" : "Inactive"}</Badge>,
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
      <PageHeader title="CSR Initiatives" description="Manage corporate social responsibility activities" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ title: "", description: "", categoryId: "", date: "" }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Initiative
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search initiatives..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Initiative" : "New CSR Initiative"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
