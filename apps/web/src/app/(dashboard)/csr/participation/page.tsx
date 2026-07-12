"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/shared";
import { DataTable } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useEmployeeParticipations, useApproveParticipation, useRejectParticipation } from "@/lib/hooks/use-master-data";
import type { EmployeeParticipation } from "@/types/master-data";

const approvalVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "destructive",
};

export default function CsrParticipationPage() {
  const { data, isLoading } = useEmployeeParticipations();
  const approve = useApproveParticipation();
  const reject = useRejectParticipation();

  const columns: ColumnDef<EmployeeParticipation>[] = useMemo(() => [
    { accessorKey: "employeeId", header: "Employee" },
    { accessorKey: "csrActivityId", header: "Activity" },
    { accessorKey: "pointsEarned", header: "Points" },
    {
      accessorKey: "approvalStatus",
      header: "Status",
      cell: ({ row }) => <Badge variant={approvalVariant[row.original.approvalStatus] || "secondary"}>{row.original.approvalStatus}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => row.original.approvalStatus === "PENDING" ? (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="text-green-600" onClick={() => approve.mutate(row.original.id)}><Check className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => reject.mutate(row.original.id)}><X className="h-4 w-4" /></Button>
        </div>
      ) : null,
    },
  ], []);

  return (
    <>
      <PageHeader title="CSR Participation" description="Review and approve employee CSR participation" />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search participation..." />
    </>
  );
}
