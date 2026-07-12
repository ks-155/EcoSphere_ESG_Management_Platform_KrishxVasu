"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Users,
  CheckCircle2,
  Clock,
  TreePine,
  Droplets,
  Waves,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const subTabs = [
  { id: "csr-activities", label: "CSR Activities" },
  { id: "employee-participation", label: "Employee Participation" },
  { id: "diversity-dashboard", label: "Diversity Dashboard" },
];

const mockCSRActivities = [
  {
    name: "Tree Plantation",
    icon: TreePine,
    joined: 24,
    open: false,
    evidenceRequired: true,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Blood Donation",
    icon: Droplets,
    joined: 10,
    open: false,
    evidenceRequired: true,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "Beach Cleanup",
    icon: Waves,
    joined: 31,
    open: true,
    evidenceRequired: false,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "ESG Workshop",
    icon: BookOpen,
    joined: 52,
    open: true,
    evidenceRequired: false,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

const mockParticipants = [
  { employee: "Aditi Rao", activity: "Tree Plantation", proof: "photo.jpg", points: 50, approval: "Pending" },
  { employee: "Karan Shah", activity: "ESG Workshop", proof: "cert.pdf", points: 30, approval: "Approved" },
  { employee: "Meena Kumar", activity: "Beach Cleanup", proof: "photo.jpg", points: 40, approval: "Pending" },
  { employee: "Raj Verma", activity: "Blood Donation", proof: "cert.pdf", points: 60, approval: "Approved" },
];

const mockDiversity = [
  { metric: "Gender Ratio (F/M)", value: "42% / 58%", trend: "+2% YoY" },
  { metric: "Employees with Disabilities", value: "4.1%", trend: "Stable" },
  { metric: "Avg Training Hours / Employee", value: "18 hrs", trend: "+3 hrs" },
  { metric: "Minority Representation", value: "31%", trend: "+1.5% YoY" },
];

function getApprovalColor(status: string) {
  switch (status.toLowerCase()) {
    case "approved": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "pending": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "rejected": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState("csr-activities");

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-semibold">Social: CSR &amp; Employee Engagement</h1>
        <p className="text-xs text-muted-foreground">
          Track CSR activities, employee participation, and diversity metrics
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

      {/* CSR Activities */}
      {activeTab === "csr-activities" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Activity
            </Button>
          </div>

          {/* Activity Cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {mockCSRActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <Card key={activity.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-2", activity.bg)}>
                      <Icon className={cn("h-4 w-4", activity.color)} />
                    </div>
                    <p className="text-sm font-semibold mb-0.5">{activity.name}</p>
                    <p className="text-xs text-muted-foreground mb-0.5">{activity.joined} joined</p>
                    {activity.evidenceRequired && (
                      <p className="text-[10px] text-muted-foreground mb-2">Evidence Required</p>
                    )}
                    {!activity.evidenceRequired && (
                      <p className="text-[10px] text-muted-foreground mb-2">Open</p>
                    )}
                    <Button
                      size="sm"
                      className={cn(
                        "h-6 text-[10px] px-3",
                        activity.open
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      )}
                    >
                      Join
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Employee Participation */}
      {activeTab === "employee-participation" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium mb-3">Employee Participation — approval queue</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b bg-muted/40">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Employee</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Activity/Challenge</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Proof</th>
                        <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Points</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Approval</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockParticipants.map((p, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="px-4 py-2.5 font-medium">{p.employee}</td>
                          <td className="px-4 py-2.5">{p.activity}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{p.proof}</td>
                          <td className="px-4 py-2.5 text-right">{p.points}</td>
                          <td className="px-4 py-2.5">
                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getApprovalColor(p.approval))}>
                              {p.approval}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex gap-1">
                              <Button size="sm" className="h-5 text-[10px] px-2 bg-blue-500 hover:bg-blue-600 text-white">
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" className="h-5 text-[10px] px-2">
                                Reject
                              </Button>
                            </div>
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

      {/* Diversity Dashboard */}
      {activeTab === "diversity-dashboard" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {mockDiversity.map((d) => (
              <Card key={d.metric}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{d.metric}</p>
                  <p className="text-lg font-bold">{d.value}</p>
                  <p className="text-[10px] text-emerald-500 mt-0.5">{d.trend}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                Department Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {["Logistics", "Manufacturing", "Corporate", "R&D"].map((dept) => {
                  const pct = Math.floor(Math.random() * 30 + 30);
                  return (
                    <div key={dept}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{dept}</span>
                        <span className="text-muted-foreground">{pct}% female</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
