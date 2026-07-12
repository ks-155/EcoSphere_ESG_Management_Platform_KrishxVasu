"use client";

import { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, PageHeader } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { useChallengeParticipations } from "@/lib/hooks/use-master-data";
import type { ChallengeParticipation } from "@/types/master-data";

const approvalVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "destructive",
};

export default function ChallengeSubmissionsPage() {
  const { data, isLoading } = useChallengeParticipations();

  const columns: ColumnDef<ChallengeParticipation>[] = useMemo(() => [
    { accessorKey: "challengeId", header: "Challenge" },
    { accessorKey: "employeeId", header: "Employee" },
    { accessorKey: "progress", header: "Progress %" },
    { accessorKey: "xpAwarded", header: "XP Awarded" },
    {
      accessorKey: "approvalStatus",
      header: "Status",
      cell: ({ row }) => <Badge variant={approvalVariant[row.original.approvalStatus] || "secondary"}>{row.original.approvalStatus}</Badge>,
    },
  ], []);

  return (
    <>
      <PageHeader title="Challenge Submissions" description="Review employee challenge submissions" />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search submissions..." />
    </>
  );
}
