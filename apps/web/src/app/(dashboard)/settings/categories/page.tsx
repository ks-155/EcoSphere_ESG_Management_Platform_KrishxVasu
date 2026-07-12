"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, FormDialog, ConfirmDelete, PageHeader } from "@/components/shared";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/lib/hooks/use-master-data";
import type { Category } from "@/types/master-data";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["CSR_ACTIVITY", "CHALLENGE"]),
  status: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "name", label: "Name", type: "text" as const, placeholder: "Tree Plantation", required: true },
  { name: "description", label: "Description", type: "textarea" as const, placeholder: "Category description..." },
  {
    name: "type", label: "Type", type: "select" as const,
    options: [
      { label: "CSR Activity", value: "CSR_ACTIVITY" },
      { label: "Challenge", value: "CHALLENGE" },
    ],
  },
  { name: "status", label: "Status", type: "switch" as const },
];

export default function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", type: "CSR_ACTIVITY", status: true },
  });

  const columns: ColumnDef<Category>[] = useMemo(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
      <PageHeader
        title="Categories"
        description="Manage CSR activity and challenge categories"
        action={
          <Button onClick={() => { setEditingItem(null); form.reset({ name: "", description: "", type: "CSR_ACTIVITY", status: true }); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        }
      />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search categories..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Category" : "Create Category"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
