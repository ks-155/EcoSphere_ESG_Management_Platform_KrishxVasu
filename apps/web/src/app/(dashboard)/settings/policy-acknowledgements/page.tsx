"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/shared";
import { DataTable } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { usePolicyAcknowledgements } from "@/lib/hooks/use-master-data";
import type { PolicyAcknowledgement } from "@/types/master-data";

export default function PolicyAcknowledgementsPage() {
  const { data, isLoading } = usePolicyAcknowledgements();

  const columns: ColumnDef<PolicyAcknowledgement>[] = useMemo(() => [
    { accessorKey: "policyId", header: "Policy" },
    { accessorKey: "employeeId", header: "Employee" },
    {
      accessorKey: "accepted",
      header: "Accepted",
      cell: ({ row }) => row.original.accepted ? <Badge variant="success">Yes</Badge> : <Badge variant="destructive">No</Badge>,
    },
    { accessorKey: "acceptedAt", header: "Date", cell: ({ row }) => new Date(row.original.acceptedAt).toLocaleDateString() },
  ], []);

  return (
    <>
      <PageHeader title="Policy Acknowledgements" description="Track employee policy acknowledgements" />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search acknowledgements..." />
    </>
  );
}
