"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared";
import { DataTable } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCheck } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "@/lib/hooks/use-master-data";
import type { Notification } from "@/types/master-data";
import { useAuthStore } from "@/store/auth-store";

const typeVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  COMPLIANCE_ISSUE: "destructive",
  CSR_APPROVAL: "success",
  CHALLENGE_APPROVAL: "success",
  POLICY_REMINDER: "warning",
  BADGE_UNLOCK: "default",
  REWARD_REDEEMED: "secondary",
};

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useNotifications(user?.id || "");
  const markRead = useMarkAsRead();
  const markAllRead = useMarkAllAsRead();

  const columns: ColumnDef<Notification>[] = useMemo(() => [
    {
      accessorKey: "isRead",
      header: "",
      cell: ({ row }) => !row.original.isRead && <div className="h-2 w-2 rounded-full bg-blue-600" />,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant={typeVariant[row.original.type] || "secondary"}>{row.original.type.replace(/_/g, " ")}</Badge>,
    },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "message", header: "Message" },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => !row.original.isRead && (
        <Button variant="ghost" size="sm" onClick={() => markRead.mutate(row.original.id)}>Mark Read</Button>
      ),
    },
  ], []);

  return (
    <>
      <PageHeader title="Notifications" description="Stay updated on ESG activities" action={
        user && <Button variant="outline" onClick={() => markAllRead.mutate(user.id)}><CheckCheck className="mr-2 h-4 w-4" />Mark All Read</Button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search notifications..." />
    </>
  );
}
