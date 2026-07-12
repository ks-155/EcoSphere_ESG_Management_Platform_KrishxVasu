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
  useEmissionFactors,
  useCreateEmissionFactor,
  useUpdateEmissionFactor,
  useDeleteEmissionFactor,
} from "@/lib/hooks/use-master-data";
import type { EmissionFactor } from "@/types/master-data";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  value: z.number().positive("Value must be positive"),
  unit: z.enum(["KG", "TONNE", "LITER", "KWH", "MWH"]),
  source: z.string().optional(),
  validFrom: z.string().min(1, "Valid from date is required"),
  validTo: z.string().optional(),
  status: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "name", label: "Name", type: "text" as const, placeholder: "Electricity Grid", required: true },
  { name: "category", label: "Category", type: "text" as const, placeholder: "Energy", required: true },
  { name: "value", label: "Value", type: "number" as const, placeholder: "0.5", required: true },
  {
    name: "unit", label: "Unit", type: "select" as const, required: true,
    options: [
      { label: "KG", value: "KG" }, { label: "TONNE", value: "TONNE" },
      { label: "LITER", value: "LITER" }, { label: "KWH", value: "KWH" }, { label: "MWH", value: "MWH" },
    ],
  },
  { name: "source", label: "Source", type: "text" as const, placeholder: "EPA Dataset 2024" },
  { name: "validFrom", label: "Valid From", type: "date" as const },
  { name: "validTo", label: "Valid To", type: "date" as const },
  { name: "status", label: "Status", type: "switch" as const },
];

export default function EmissionFactorsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EmissionFactor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useEmissionFactors();
  const createMutation = useCreateEmissionFactor();
  const updateMutation = useUpdateEmissionFactor();
  const deleteMutation = useDeleteEmissionFactor();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", category: "", value: 0, unit: "KG", source: "", validFrom: "", validTo: "", status: true },
  });

  const columns: ColumnDef<EmissionFactor>[] = useMemo(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "value", header: "Value" },
    { accessorKey: "unit", header: "Unit" },
    { accessorKey: "source", header: "Source" },
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
      <PageHeader title="Emission Factors" description="Manage carbon emission factors for calculations" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ name: "", category: "", value: 0, unit: "KG", source: "", validFrom: "", validTo: "", status: true }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Factor
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search emission factors..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Emission Factor" : "Create Emission Factor"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
