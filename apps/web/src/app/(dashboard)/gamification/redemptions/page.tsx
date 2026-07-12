"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/shared";
import { DataTable } from "@/components/shared";
import type { ColumnDef } from "@tanstack/react-table";
import { useRewardRedemptions } from "@/lib/hooks/use-master-data";
import type { RewardRedemption } from "@/types/master-data";

export default function RewardRedemptionsPage() {
  const { data, isLoading } = useRewardRedemptions();

  const columns: ColumnDef<RewardRedemption>[] = useMemo(() => [
    { accessorKey: "userId", header: "User" },
    { accessorKey: "rewardId", header: "Reward" },
    { accessorKey: "pointsSpent", header: "Points" },
    { accessorKey: "redeemedAt", header: "Date", cell: ({ row }) => new Date(row.original.redeemedAt).toLocaleDateString() },
  ], []);

  return (
    <>
      <PageHeader title="Reward Redemptions" description="Track employee reward redemptions" />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search redemptions..." />
    </>
  );
}
