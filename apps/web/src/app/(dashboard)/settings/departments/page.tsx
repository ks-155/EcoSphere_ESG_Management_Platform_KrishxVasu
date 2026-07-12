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
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from "@/lib/hooks/use-master-data";
import type { Department } from "@/types/master-data";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(2, "Code must be at least 2 characters").max(6),
  description: z.string().optional(),
  headName: z.string().optional(),
  status: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "name", label: "Name", type: "text" as const, placeholder: "Engineering", required: true },
  { name: "code", label: "Code", type: "text" as const, placeholder: "ENG", required: true },
  { name: "description", label: "Description", type: "textarea" as const, placeholder: "Department description..." },
  { name: "headName", label: "Head Name", type: "text" as const, placeholder: "John Doe" },
  { name: "status", label: "Status", type: "switch" as const },
];

export default function DepartmentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Department | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useDepartments();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", code: "", description: "", headName: "", status: true },
  });

  const columns: ColumnDef<Department>[] = useMemo(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "headName", header: "Head" },
    { accessorKey: "employeeCount", header: "Employees" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(row.original)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ], []);

  function handleEdit(item: Department) {
    setEditingItem(item);
    form.reset({
      name: item.name,
      code: item.code,
      description: item.description || "",
      headName: item.headName || "",
      status: item.status,
    });
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    setDeleteOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    form.reset({ name: "", code: "", description: "", headName: "", status: true });
    setDialogOpen(true);
  }

  function onSubmit(values: FormValues) {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: values }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createMutation.mutate(values, { onSuccess: () => setDialogOpen(false) });
    }
  }

  function onDelete() {
    if (deletingId) {
      deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) });
    }
  }

  return (
    <>
      <PageHeader
        title="Departments"
        description="Manage organizational departments"
        action={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Department
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        searchPlaceholder="Search departments..."
      />
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingItem ? "Edit Department" : "Create Department"}
        form={form}
        fields={formFields}
        onSubmit={onSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />
      <ConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
