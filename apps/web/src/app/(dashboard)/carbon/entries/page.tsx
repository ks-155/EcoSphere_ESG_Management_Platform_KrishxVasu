"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, FormDialog, ConfirmDelete, PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useCarbonTransactions,
  useCreateCarbonTransaction,
  useUpdateCarbonTransaction,
  useDeleteCarbonTransaction,
} from "@/lib/hooks/use-master-data";
import type { CarbonTransaction } from "@/types/master-data";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  sourceType: z.string().min(1, "Source type is required"),
  quantity: z.coerce.number().min(0, "Quantity must be >= 0"),
  co2Amount: z.coerce.number().min(0, "CO\u2082 amount must be >= 0"),
  departmentId: z.string().min(1, "Department is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "date", label: "Date", type: "date" as const, required: true },
  { name: "sourceType", label: "Source Type", type: "text" as const, placeholder: "e.g. Electricity, Transport", required: true },
  { name: "quantity", label: "Quantity", type: "number" as const, placeholder: "1000", required: true },
  { name: "co2Amount", label: "CO\u2082 Amount (kg)", type: "number" as const, placeholder: "500", required: true },
  { name: "departmentId", label: "Department ID", type: "text" as const, placeholder: "Dept ID", required: true },
  { name: "notes", label: "Notes", type: "textarea" as const },
];

export default function CarbonEntriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CarbonTransaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useCarbonTransactions();
  const createMutation = useCreateCarbonTransaction();
  const updateMutation = useUpdateCarbonTransaction();
  const deleteMutation = useDeleteCarbonTransaction();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { date: "", sourceType: "", quantity: 0, co2Amount: 0, departmentId: "", notes: "" },
  });

  const columns: ColumnDef<CarbonTransaction>[] = useMemo(() => [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "sourceType", header: "Source" },
    { accessorKey: "quantity", header: "Qty" },
    { accessorKey: "co2Amount", header: "CO\u2082 (kg)" },
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
      <PageHeader title="Carbon Entries" description="Record and track carbon emissions" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ date: "", sourceType: "", quantity: 0, co2Amount: 0, departmentId: "", notes: "" }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Entry
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search entries..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Entry" : "New Carbon Entry"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
