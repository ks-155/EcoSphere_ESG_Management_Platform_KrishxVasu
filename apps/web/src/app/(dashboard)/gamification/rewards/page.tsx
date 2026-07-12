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
  useRewards,
  useCreateReward,
  useUpdateReward,
  useDeleteReward,
} from "@/lib/hooks/use-master-data";
import type { Reward } from "@/types/master-data";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  pointCost: z.number().positive("Point cost must be positive"),
  stock: z.number().min(0, "Stock cannot be negative"),
  category: z.enum(["ENVIRONMENTAL", "SOCIAL", "GOVERNANCE", "GENERAL"]),
  status: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "name", label: "Name", type: "text" as const, placeholder: "Eco Tote Bag", required: true },
  { name: "description", label: "Description", type: "textarea" as const },
  { name: "imageUrl", label: "Image URL", type: "text" as const, placeholder: "https://..." },
  { name: "pointCost", label: "Point Cost", type: "number" as const, placeholder: "500", required: true },
  { name: "stock", label: "Stock", type: "number" as const, placeholder: "10", required: true },
  {
    name: "category", label: "Category", type: "select" as const, required: true,
    options: [
      { label: "Environmental", value: "ENVIRONMENTAL" },
      { label: "Social", value: "SOCIAL" },
      { label: "Governance", value: "GOVERNANCE" },
      { label: "General", value: "GENERAL" },
    ],
  },
  { name: "status", label: "Status", type: "switch" as const },
];

export default function RewardsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Reward | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useRewards();
  const createMutation = useCreateReward();
  const updateMutation = useUpdateReward();
  const deleteMutation = useDeleteReward();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", imageUrl: "", pointCost: 0, stock: 0, category: "GENERAL", status: true },
  });

  const columns: ColumnDef<Reward>[] = useMemo(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "pointCost", header: "Points" },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <Badge variant={row.original.stock === 0 ? "destructive" : row.original.stock < 5 ? "warning" : "success"}>
          {row.original.stock}
        </Badge>
      ),
    },
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
      <PageHeader title="Rewards" description="Manage reward catalog with point costs and stock" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ name: "", description: "", imageUrl: "", pointCost: 0, stock: 0, category: "GENERAL", status: true }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Reward
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search rewards..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Reward" : "Create Reward"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
