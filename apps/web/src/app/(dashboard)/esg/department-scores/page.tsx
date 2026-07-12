"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared";
import { DataTable } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, LogIn } from "lucide-react";
import { useDepartmentScores, useCalculateScore } from "@/lib/hooks/use-master-data";
import { useAuthStore } from "@/store/auth-store";
import type { ColumnDef } from "@tanstack/react-table";
import type { DepartmentScore } from "@/types/master-data";
import Link from "next/link";

export default function DepartmentScoresPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading } = useDepartmentScores();
  const calcMutation = useCalculateScore();

  if (!isAuthenticated) {
    return <div className="flex flex-col items-center justify-center py-20"><LogIn className="mb-4 h-12 w-12 text-muted-foreground" /><h2 className="mb-2 text-xl font-semibold">Please log in</h2><Link href="/login"><Button>Go to Login</Button></Link></div>;
  }
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcForm, setCalcForm] = useState({ departmentId: "", periodStart: "", periodEnd: "" });

  const columns: ColumnDef<DepartmentScore>[] = useMemo(() => [
    { accessorKey: "departmentId", header: "Department" },
    { accessorKey: "environmentalScore", header: "Env Score" },
    { accessorKey: "socialScore", header: "Social Score" },
    { accessorKey: "governanceScore", header: "Gov Score" },
    { accessorKey: "totalScore", header: "Total", cell: ({ row }) => <span className="font-bold">{row.original.totalScore.toFixed(1)}</span> },
    { accessorKey: "periodStart", header: "Period Start" },
    { accessorKey: "periodEnd", header: "Period End" },
  ], []);

  return (
    <>
      <PageHeader title="Department Scores" description="Calculate and view ESG scores by department" action={
        <Button onClick={() => setCalcOpen(true)}><Calculator className="mr-2 h-4 w-4" />Calculate Score</Button>
      } />
      <Card className="mb-6">
        <CardHeader><CardTitle>Score Weights</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Environmental: 40% · Social: 30% · Governance: 30% (configurable per organization)
        </CardContent>
      </Card>
      <DataTable columns={columns} data={data?.data ?? []} loading={isLoading} searchPlaceholder="Search scores..." />

      <Dialog open={calcOpen} onOpenChange={setCalcOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Calculate Department Score</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Department ID</Label>
              <Input value={calcForm.departmentId} onChange={(e) => setCalcForm({ ...calcForm, departmentId: e.target.value })} placeholder="Dept ID" />
            </div>
            <div>
              <Label>Period Start</Label>
              <Input type="date" value={calcForm.periodStart} onChange={(e) => setCalcForm({ ...calcForm, periodStart: e.target.value })} />
            </div>
            <div>
              <Label>Period End</Label>
              <Input type="date" value={calcForm.periodEnd} onChange={(e) => setCalcForm({ ...calcForm, periodEnd: e.target.value })} />
            </div>
            <Button className="w-full" onClick={() => { calcMutation.mutate(calcForm, { onSuccess: () => setCalcOpen(false) }); }}>
              <Calculator className="mr-2 h-4 w-4" />Calculate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
