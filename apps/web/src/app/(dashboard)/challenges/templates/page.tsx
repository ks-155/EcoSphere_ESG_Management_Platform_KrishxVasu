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
  useChallenges,
  useCreateChallenge,
  useUpdateChallenge,
  useDeleteChallenge,
} from "@/lib/hooks/use-master-data";
import type { Challenge } from "@/types/master-data";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  xp: z.coerce.number().min(0, "XP must be >= 0"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  evidenceRequired: z.boolean().default(false),
  deadline: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "UNDER_REVIEW", "COMPLETED", "ARCHIVED"]),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "title", label: "Title", type: "text" as const, placeholder: "30-Day Energy Saver", required: true },
  { name: "description", label: "Description", type: "textarea" as const },
  { name: "categoryId", label: "Category ID", type: "text" as const, placeholder: "Category ID", required: true },
  { name: "xp", label: "XP Reward", type: "number" as const, placeholder: "100", required: true },
  {
    name: "difficulty", label: "Difficulty", type: "select" as const,
    options: [
      { label: "Easy", value: "EASY" },
      { label: "Medium", value: "MEDIUM" },
      { label: "Hard", value: "HARD" },
    ],
  },
  { name: "deadline", label: "Deadline", type: "date" as const },
  {
    name: "status", label: "Status", type: "select" as const,
    options: [
      { label: "Draft", value: "DRAFT" },
      { label: "Active", value: "ACTIVE" },
      { label: "Under Review", value: "UNDER_REVIEW" },
      { label: "Completed", value: "COMPLETED" },
      { label: "Archived", value: "ARCHIVED" },
    ],
  },
];

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  ACTIVE: "success",
  DRAFT: "secondary",
  UNDER_REVIEW: "warning",
  COMPLETED: "default",
  ARCHIVED: "destructive",
};

export default function ChallengeTemplatesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Challenge | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useChallenges();
  const createMutation = useCreateChallenge();
  const updateMutation = useUpdateChallenge();
  const deleteMutation = useDeleteChallenge();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", categoryId: "", xp: 0, difficulty: "MEDIUM", evidenceRequired: false, deadline: "", status: "DRAFT" },
  });

  const columns: ColumnDef<Challenge>[] = useMemo(() => [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "difficulty", header: "Difficulty" },
    { accessorKey: "xp", header: "XP" },
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
      <PageHeader title="Challenge Templates" description="Create and manage employee challenges" action={
        <Button onClick={() => { setEditingItem(null); form.reset({ title: "", description: "", categoryId: "", xp: 0, difficulty: "MEDIUM", evidenceRequired: false, deadline: "", status: "DRAFT" }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Challenge
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search challenges..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingItem ? "Edit Challenge" : "New Challenge"} form={form} fields={formFields} onSubmit={onSubmit} loading={createMutation.isPending || updateMutation.isPending} />
      <ConfirmDelete open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={() => deletingId && deleteMutation.mutate(deletingId, { onSuccess: () => setDeleteOpen(false) })} loading={deleteMutation.isPending} />
    </>
  );
}
