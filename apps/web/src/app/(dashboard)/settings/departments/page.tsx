"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Tags,
  Settings2,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDepartments } from "@/lib/hooks/use-master-data";
// useDepartments returns { data: { data: [...] } | [...] } depending on API response shape

const subTabs = [
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "esg-config", label: "ESG Configuration", icon: Settings2 },
  { id: "notifications", label: "Notification Settings", icon: Bell },
];

const mockDepartments = [
  { name: "Manufacturing", code: "MFC", head: "S. Nair", parentDept: "—", employees: 134, status: "Active" },
  { name: "Logistics", code: "LOG", head: "R. Iyer", parentDept: "Manufacturing", employees: 58, status: "Active" },
  { name: "Corporate", code: "COR", head: "A. Mehta", parentDept: "—", employees: 41, status: "Active" },
];

const mockCategories = [
  { name: "Energy", code: "ENR", description: "Electricity and fuel consumption", active: true },
  { name: "Transport", code: "TRP", description: "Fleet and travel emissions", active: true },
  { name: "Waste", code: "WST", description: "Solid and liquid waste management", active: true },
  { name: "Social", code: "SOC", description: "CSR and community engagement", active: false },
];

const esgConfigToggles = [
  { id: "auto-emission", label: "Enable auto emission calculation" },
  { id: "require-evidence", label: "Require evidence for all CSR activities" },
  { id: "auto-badges", label: "Auto-award badges on challenge completion" },
  { id: "email-alerts", label: "Email alerts for new compliance issues" },
];

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "inactive": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function SettingsDepartmentsPage() {
  const [activeTab, setActiveTab] = useState("departments");
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "auto-emission": true,
    "require-evidence": false,
    "auto-badges": true,
    "email-alerts": true,
  });

  const { data: depts } = useDepartments();
  const displayDepts = depts?.length
    ? depts.map((d: any) => ({
        name: d.name,
        code: d.code,
        head: d.head || "—",
        parentDept: d.parentName || "—",
        employees: d.employeeCount ?? "—",
        status: d.isActive !== false ? "Active" : "Inactive",
      }))
    : mockDepartments;

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-semibold">Settings: Configuration &amp; Administration</h1>
        <p className="text-xs text-muted-foreground">
          Manage departments, categories, ESG configuration and notification preferences
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

      {/* Departments */}
      {activeTab === "departments" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Department
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 bg-orange-500 hover:bg-orange-600 text-white border-orange-500">
              <Edit className="h-3 w-3" /> Edit
            </Button>
            <Button size="sm" variant="destructive" className="h-7 text-xs gap-1">
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Code</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Head</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Parent Dept</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Employees</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayDepts.map((dept: any, i: number) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{dept.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{dept.code}</td>
                        <td className="px-4 py-2.5">{dept.head}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{dept.parentDept}</td>
                        <td className="px-4 py-2.5 text-right">{dept.employees}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(dept.status))}>
                            {dept.status}
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

      {/* Categories */}
      {activeTab === "categories" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Category
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <Edit className="h-3 w-3" /> Edit
            </Button>
            <Button size="sm" variant="destructive" className="h-7 text-xs gap-1">
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Code</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Description</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCategories.map((cat, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{cat.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{cat.code}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{cat.description}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(cat.active ? "Active" : "Inactive"))}>
                            {cat.active ? "Active" : "Inactive"}
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

      {/* ESG Configuration */}
      {activeTab === "esg-config" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-medium">ESG Configuration &amp; Notifications</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              {esgConfigToggles.map((toggle) => (
                <div key={toggle.id} className="flex items-center justify-between">
                  <Label htmlFor={toggle.id} className="text-xs text-muted-foreground cursor-pointer">
                    {toggle.label}
                  </Label>
                  <Switch
                    id={toggle.id}
                    checked={toggles[toggle.id] ?? false}
                    onCheckedChange={(checked) =>
                      setToggles((prev) => ({ ...prev, [toggle.id]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-medium">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              {[
                { id: "email-compliance", label: "Email on new compliance issues" },
                { id: "email-audit", label: "Email on audit completion" },
                { id: "push-challenge", label: "Push notification on new challenges" },
                { id: "push-badge", label: "Push notification on badge awards" },
                { id: "weekly-digest", label: "Weekly ESG digest email" },
              ].map((toggle) => (
                <div key={toggle.id} className="flex items-center justify-between">
                  <Label htmlFor={toggle.id} className="text-xs text-muted-foreground cursor-pointer">
                    {toggle.label}
                  </Label>
                  <Switch
                    id={toggle.id}
                    defaultChecked={toggle.id.includes("email")}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
