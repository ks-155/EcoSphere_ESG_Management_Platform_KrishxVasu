"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Download,
  FileText,
  Shield,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const subTabs = [
  { id: "policies", label: "Policies" },
  { id: "policy-acks", label: "Policy Acknowledgements" },
  { id: "audits", label: "Audits" },
  { id: "compliance-issues", label: "Compliance Issues" },
];

const mockPolicies = [
  { name: "Anti-Corruption Policy", category: "Governance", version: "v2.1", status: "Active", mandatory: true },
  { name: "Environmental Policy", category: "Environmental", version: "v1.4", status: "Active", mandatory: true },
  { name: "Workplace Safety Policy", category: "Social", version: "v3.0", status: "Active", mandatory: true },
  { name: "Data Privacy Policy", category: "Governance", version: "v1.2", status: "Draft", mandatory: false },
];

const mockAcknowledgements = [
  { employee: "Aditi Rao", policy: "Anti-Corruption Policy", date: "2026-06-15", status: "Acknowledged" },
  { employee: "Karan Shah", policy: "Environmental Policy", date: "2026-06-20", status: "Acknowledged" },
  { employee: "Meena Kumar", policy: "Anti-Corruption Policy", date: null, status: "Pending" },
  { employee: "Raj Verma", policy: "Workplace Safety Policy", date: "2026-06-18", status: "Acknowledged" },
  { employee: "Priya Singh", policy: "Environmental Policy", date: null, status: "Pending" },
];

const mockAudits = [
  {
    title: "Q2 Waste Audit",
    department: "Manufacturing",
    auditor: "S. Nair",
    date: "2026-06-12",
    findings: "3 minor issues",
    status: "Completed",
  },
  {
    title: "Vendor Compliance Check",
    department: "Procurement",
    auditor: "R. Iyer",
    date: "2026-07-01",
    findings: "1 open issue",
    status: "Under Review",
  },
];

const mockComplianceIssues = [
  { issue: "Missing MSDS sheets", severity: "High", department: "Manufacturing", status: "Open" },
  { issue: "Late vendor disclosure", severity: "Medium", department: "Procurement", status: "Resolved" },
];

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "draft": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "acknowledged": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "pending": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "completed": return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
    case "under review": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "open": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "resolved": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    default: return "bg-muted text-muted-foreground";
  }
}

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "high": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "low": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState("audits");

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-semibold">Governance: Policies, Audits &amp; Compliance</h1>
        <p className="text-xs text-muted-foreground">
          Manage policies, track acknowledgements, schedule audits, and resolve compliance issues
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-0 border-b overflow-x-auto scrollbar-none">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active))] bg-[hsl(var(--sidebar-active))]/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Policies */}
      {activeTab === "policies" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Policy
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Policy Name</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Category</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Version</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Mandatory</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPolicies.map((p, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium flex items-center gap-2">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          {p.name}
                        </td>
                        <td className="px-4 py-2.5">{p.category}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{p.version}</td>
                        <td className="px-4 py-2.5">
                          <span className={p.mandatory ? "text-emerald-600" : "text-muted-foreground"}>
                            {p.mandatory ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(p.status))}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Policy Acknowledgements */}
      {activeTab === "policy-acks" && (
        <div className="space-y-3">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Employee</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Policy</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAcknowledgements.map((a, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{a.employee}</td>
                        <td className="px-4 py-2.5">{a.policy}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{a.date ?? "—"}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(a.status))}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audits */}
      {activeTab === "audits" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Audit
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <Download className="h-3 w-3" /> Export ▾
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Title</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Department</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Auditor</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Findings</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAudits.map((a, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{a.title}</td>
                        <td className="px-4 py-2.5">{a.department}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{a.auditor}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{a.date}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{a.findings}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(a.status))}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Issues sub-section within Audits */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Compliance Issues raised from Audits — severity-tagged, resolution tracked
            </p>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b bg-muted/40">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Issue</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Severity</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Department</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockComplianceIssues.map((issue, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="px-4 py-2.5">{issue.issue}</td>
                          <td className="px-4 py-2.5">
                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getSeverityColor(issue.severity))}>
                              {issue.severity}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">{issue.department}</td>
                          <td className="px-4 py-2.5">
                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(issue.status))}>
                              {issue.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Compliance Issues (standalone tab) */}
      {activeTab === "compliance-issues" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Issue
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Issue</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Severity</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Department</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockComplianceIssues.map((issue, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5">{issue.issue}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getSeverityColor(issue.severity))}>
                            {issue.severity}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">{issue.department}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(issue.status))}>
                            {issue.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
