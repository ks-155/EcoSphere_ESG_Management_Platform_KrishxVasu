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
  useProductProfiles,
  useCreateProductProfile,
  useUpdateProductProfile,
  useDeleteProductProfile,
} from "@/lib/hooks/use-master-data";
import type { ProductProfile } from "@/types/master-data";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.enum(["ELECTRONICS", "FOOD", "TEXTILE", "PACKAGING", "CHEMICAL", "OTHER"]),
  carbonFootprint: z.number().optional(),
  waterUsage: z.number().optional(),
  recyclable: z.boolean().default(false),
  complianceStatus: z.enum(["COMPLIANT", "NON_COMPLIANT", "PENDING"]),
  description: z.string().optional(),
  status: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "name", label: "Name", type: "text" as const, placeholder: "Eco Bottle", required: true },
  { name: "sku", label: "SKU", type: "text" as const, placeholder: "ECO-001", required: true },
  {
    name: "category", label: "Category", type: "select" as const, required: true,
    options: [
      { label: "Electronics", value: "ELECTRONICS" }, { label: "Food", value: "FOOD" },
      { label: "Textile", value: "TEXTILE" }, { label: "Packaging", value: "PACKAGING" },
      { label: "Chemical", value: "CHEMICAL" }, { label: "Other", value: "OTHER" },
    ],
  },
  { name: "carbonFootprint", label: "Carbon Footprint (kg CO₂)", type: "number" as const, placeholder: "2.5" },
  { name: "waterUsage", label: "Water Usage (L)", type: "number" as const, placeholder: "10" },
  { name: "recyclable", label: "Recyclable", type: "switch" as const },
  {
    name: "complianceStatus", label: "Compliance Status", type: "select" as const,
    options: [
      { label: "Compliant", value: "COMPLIANT" },
      { label: "Non-Compliant", value: "NON_COMPLIANT" },
      { label: "Pending", value: "PENDING" },
    ],
  },
  { name: "description", label: "Description", type: "textarea" as const },
  { name: "status", label: "Status", type: "switch" as const },
];

export default function ProductProfilesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductProfile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useProductProfiles();
  const createMutation = useCreateProductProfile();
  const updateMutation = useUpdateProductProfile();
  const deleteMutation = useDeleteProductProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", sku: "", category: "OTHER", carbonFootprint: undefined, waterUsage: undefined, recyclable: false, complianceStatus: "PENDING", description: "", status: true },
  });

  const columns: ColumnDef<ProductProfile>[] = useMemo(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "carbonFootprint", header: "Carbon (kg)" },
    {
      accessorKey: "complianceStatus",
      header: "Compliance",
      cell: ({ row }) => (
        <Badge variant={row.original.complianceStatus === "COMPLIANT" ? "success" : row.original.complianceStatus === "NON_COMPLIANT" ? "destructive" : "warning"}>
          {row.original.complianceStatus.replace("_", " ")}
        </Badge>
      ),
    },
    { accessorKey: "recyclable", header: "Recyclable", cell: ({ row }) => row.original.recyclable ? "Yes" : "No" },
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
      <PageHeader title="Product Profiles" description="Manage ESG profiles for products" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ name: "", sku: "", category: "OTHER", recyclable: false, complianceStatus: "PENDING", description: "", status: true }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search products..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Product Profile" : "Create Product Profile"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
