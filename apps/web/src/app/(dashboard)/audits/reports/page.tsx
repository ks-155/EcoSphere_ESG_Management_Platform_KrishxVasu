"use client";

import { PageHeader } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const auditSummaries = [
  { title: "Q1 2026 ESG Audit", date: "2026-03-15", status: "COMPLETED", issues: 3, resolved: 3, score: 92 },
  { title: "Q2 2026 ESG Audit", date: "2026-06-20", status: "IN_PROGRESS", issues: 5, resolved: 2, score: null },
  { title: "Q3 2026 ESG Audit", date: "2026-09-15", status: "PLANNED", issues: null, resolved: null, score: null },
];

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  COMPLETED: "success",
  IN_PROGRESS: "warning",
  PLANNED: "secondary",
};

export default function AuditReportsPage() {
  return (
    <>
      <PageHeader title="Audit Reports" description="View ESG audit history and findings" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Compliance Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% vs last year</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Audit History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditSummaries.map((a) => (
              <div key={a.title} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  {a.score && <span className="text-sm font-medium">{a.score}%</span>}
                  <Badge variant={statusVariant[a.status] || "secondary"}>{a.status}</Badge>
                  {a.issues != null && (
                    <span className="text-xs text-muted-foreground">
                      {a.resolved}/{a.issues} resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
