"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar } from "recharts";
import { Shield, AlertTriangle, ClipboardCheck, FileCheck } from "lucide-react";

export default function GovernanceDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "governance"],
    queryFn: () => dashboardApi.getGovernance(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Governance Dashboard" description="Track policy compliance, audit status, and governance metrics" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>
          ))}
        </div>
      </div>
    );
  }

  const totalAuditStatus = data?.auditStatusBreakdown.reduce((sum, s) => sum + s._count, 0) ?? 0;
  const totalSeverity = data?.complianceIssuesBySeverity.reduce((sum, s) => sum + s._count, 0) ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Governance Dashboard" description="Track policy compliance, audit status, and governance metrics" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Acknowledgement</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data?.policyAcknowledgementRate ?? 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Employee acknowledgement rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAuditStatus}</div>
            <p className="text-xs text-muted-foreground">Across all statuses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSeverity}</div>
            <p className="text-xs text-muted-foreground">Active issues tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Resolved</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.issuesByStatus.find((s) => s.status === "RESOLVED")?._count ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Issues closed or resolved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Audit Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.auditStatusBreakdown && data.auditStatusBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.auditStatusBreakdown.map((s) => ({ name: s.status, value: s._count }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#22c55e" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No audit data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.complianceIssuesBySeverity && data.complianceIssuesBySeverity.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.complianceIssuesBySeverity.map((s) => ({ severity: s.severity, count: s._count }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="severity" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.complianceIssuesBySeverity.map((s) => (
                      <Cell
                        key={s.severity}
                        fill={
                          s.severity === "CRITICAL" ? "#ef4444"
                          : s.severity === "HIGH" ? "#f97316"
                          : s.severity === "MEDIUM" ? "#f59e0b"
                          : "#22c55e"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No compliance issues
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Resolution Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.complianceTrend && data.complianceTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.complianceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="resolvedCount" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No resolution trend data
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issues by Status</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.issuesByStatus && data.issuesByStatus.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium">Status</th>
                    <th className="py-2 text-right font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.issuesByStatus.map((s) => (
                    <tr key={s.status} className="border-b last:border-0">
                      <td className="py-2">{s.status}</td>
                      <td className="py-2 text-right">{s._count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No issues tracked</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
