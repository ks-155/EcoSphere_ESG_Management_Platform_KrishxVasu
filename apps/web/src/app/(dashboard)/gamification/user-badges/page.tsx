"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader, DataTable, FormDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Plus, Award } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useUserBadges } from "@/lib/hooks/use-master-data";
import type { UserBadge } from "@/types/master-data";

const formSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  badgeId: z.string().min(1, "Badge ID is required"),
});

type FormValues = z.infer<typeof formSchema>;

const formFields = [
  { name: "userId", label: "User ID", type: "text" as const, placeholder: "User ID", required: true },
  { name: "badgeId", label: "Badge ID", type: "text" as const, placeholder: "Badge ID", required: true },
];

export default function UserBadgesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading } = useUserBadges();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { userId: "", badgeId: "" },
  });

  const columns: ColumnDef<UserBadge>[] = useMemo(() => [
    { accessorKey: "userId", header: "User" },
    { accessorKey: "badgeId", header: "Badge" },
    { accessorKey: "awardedAt", header: "Awarded", cell: ({ row }) => new Date(row.original.awardedAt).toLocaleDateString() },
  ], []);

  return (
    <>
      <PageHeader title="User Badges" description="Manage badges awarded to employees" action={
        <Button onClick={() => { form.reset({ userId: "", badgeId: "" }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Award Badge
        </Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search user badges..." />
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Award Badge" form={form} fields={formFields} onSubmit={() => setDialogOpen(false)} />
    </>
  );
}
