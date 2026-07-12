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
  useBadges,
  useCreateBadge,
  useUpdateBadge,
  useDeleteBadge,
} from "@/lib/hooks/use-master-data";
import type { Badge } from "@/types/master-data";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  category: z.enum(["ENVIRONMENTAL", "SOCIAL", "GOVERNANCE", "GENERAL"]),
  unlockType: z.enum(["XP_THRESHOLD", "CHALLENGE_COUNT", "MANUAL"]),
  unlockValue: z.number().min(0, "Value must be 0 or more"),
  xpReward: z.number().min(0, "XP reward must be 0 or more"),
  status: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "name", label: "Name", type: "text" as const, placeholder: "Eco Champion", required: true },
  { name: "description", label: "Description", type: "textarea" as const },
  { name: "iconUrl", label: "Icon URL", type: "text" as const, placeholder: "https://..." },
  {
    name: "category", label: "Category", type: "select" as const, required: true,
    options: [
      { label: "Environmental", value: "ENVIRONMENTAL" },
      { label: "Social", value: "SOCIAL" },
      { label: "Governance", value: "GOVERNANCE" },
      { label: "General", value: "GENERAL" },
    ],
  },
  {
    name: "unlockType", label: "Unlock Type", type: "select" as const, required: true,
    options: [
      { label: "XP Threshold", value: "XP_THRESHOLD" },
      { label: "Challenge Count", value: "CHALLENGE_COUNT" },
      { label: "Manual", value: "MANUAL" },
    ],
  },
  { name: "unlockValue", label: "Unlock Value", type: "number" as const, placeholder: "1000" },
  { name: "xpReward", label: "XP Reward", type: "number" as const, placeholder: "100" },
  { name: "status", label: "Status", type: "switch" as const },
];

const unlockLabels: Record<string, string> = {
  XP_THRESHOLD: "XP Threshold",
  CHALLENGE_COUNT: "Challenge Count",
  MANUAL: "Manual",
};

export default function BadgesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Badge | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useBadges();
  const createMutation = useCreateBadge();
  const updateMutation = useUpdateBadge();
  const deleteMutation = useDeleteBadge();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "", iconUrl: "", category: "GENERAL", unlockType: "XP_THRESHOLD", unlockValue: 0, xpReward: 0, status: true },
  });

  const columns: ColumnDef<Badge>[] = useMemo(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "category", header: "Category" },
    {
      accessorKey: "unlockType",
      header: "Unlock Type",
      cell: ({ row }) => unlockLabels[row.original.unlockType] || row.original.unlockType,
    },
    { accessorKey: "unlockValue", header: "Unlock Value" },
    { accessorKey: "xpReward", header: "XP Reward" },
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
      <PageHeader title="Badges" description="Manage gamification badges with unlock rules" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ name: "", description: "", iconUrl: "", category: "GENERAL", unlockType: "XP_THRESHOLD", unlockValue: 0, xpReward: 0, status: true }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Badge
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search badges..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Badge" : "Create Badge"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
