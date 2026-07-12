"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Search,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const subTabs = [
  { id: "emission-factors", label: "Emission Factors" },
  { id: "product-profiles", label: "Product ESG Profiles" },
  { id: "carbon-transactions", label: "Carbon Transactions" },
  { id: "environmental-goals", label: "Environmental Goals" },
];

const mockGoals = [
  {
    name: "Reduce Fleet Emissions",
    department: "Logistics",
    targetCO2: "500 t",
    currentCO2: "390 t",
    progress: 78,
    deadline: "2026-12-31",
    status: "Active",
  },
  {
    name: "Cut Packaging Waste",
    department: "Manufacturing",
    targetCO2: "170 t",
    currentCO2: "98 t",
    progress: 62,
    deadline: "2026-09-30",
    status: "On-Track",
  },
  {
    name: "Office Energy Cut",
    department: "Corporate",
    targetCO2: "80 t",
    currentCO2: "80 t",
    progress: 100,
    deadline: "2026-06-30",
    status: "Completed",
  },
];

const mockEmissionFactors = [
  { name: "Electricity (Grid)", category: "Energy", value: 0.233, unit: "kg CO₂/kWh" },
  { name: "Diesel Fuel", category: "Transport", value: 2.68, unit: "kg CO₂/L" },
  { name: "Natural Gas", category: "Heating", value: 2.04, unit: "kg CO₂/m³" },
  { name: "Air Travel (Short)", category: "Transport", value: 0.255, unit: "kg CO₂/km" },
];

const mockProductProfiles = [
  { name: "Product A", sku: "SKU-001", category: "Electronics", carbonScore: 12.4, status: "Active" },
  { name: "Product B", sku: "SKU-002", category: "Packaging", carbonScore: 3.1, status: "Active" },
  { name: "Product C", sku: "SKU-003", category: "Manufacturing", carbonScore: 8.7, status: "Draft" },
];

const mockTransactions = [
  { date: "2026-07-01", department: "Logistics", source: "Fleet", amount: 45.2, unit: "kg CO₂", status: "Logged" },
  { date: "2026-07-02", department: "Manufacturing", source: "Electricity", amount: 123.5, unit: "kg CO₂", status: "Logged" },
  { date: "2026-07-03", department: "Corporate", source: "A/C", amount: 22.1, unit: "kg CO₂", status: "Logged" },
];

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "on-track": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "completed": return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
    case "draft": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "logged": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function EnvironmentalPage() {
  const [activeTab, setActiveTab] = useState("environmental-goals");
  const [goalSearch, setGoalSearch] = useState("");

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-semibold">Environmental: Emission Tracking &amp; Goals</h1>
        <p className="text-xs text-muted-foreground">
          Manage emission factors, product profiles, carbon transactions and environmental goals
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

      {/* Tab Content */}
      {activeTab === "emission-factors" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Factor
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
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Category</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Value</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockEmissionFactors.map((ef, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5">{ef.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{ef.category}</td>
                        <td className="px-4 py-2.5 text-right">{ef.value}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{ef.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "product-profiles" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Profile
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
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">SKU</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Category</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Carbon Score</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProductProfiles.map((p, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{p.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{p.sku}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{p.category}</td>
                        <td className="px-4 py-2.5 text-right">{p.carbonScore} kg CO₂</td>
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
          <p className="text-[10px] text-muted-foreground">
            Carbon Transactions auto-generated from Purchase/Manufacturing/Fleet/Expenses
          </p>
        </div>
      )}

      {activeTab === "carbon-transactions" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Entry
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
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Department</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Source</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Amount</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.map((t, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5">{t.date}</td>
                        <td className="px-4 py-2.5">{t.department}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{t.source}</td>
                        <td className="px-4 py-2.5 text-right">{t.amount} {t.unit}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(t.status))}>
                            {t.status}
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

      {activeTab === "environmental-goals" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Goal
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <Edit className="h-3 w-3" /> Edit
            </Button>
            <Button size="sm" variant="destructive" className="h-7 text-xs gap-1">
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <Download className="h-3 w-3" /> Export ▾
            </Button>
            <div className="relative ml-auto">
              <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                className="pl-7 h-7 text-xs w-48"
                placeholder="Search goals..."
                value={goalSearch}
                onChange={(e) => setGoalSearch(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <HelpCircle className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Department</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Target CO₂s</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Current CO₂s</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Progress</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Deadline</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockGoals
                      .filter((g) => g.name.toLowerCase().includes(goalSearch.toLowerCase()))
                      .map((goal, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="px-4 py-2.5 font-medium">{goal.name}</td>
                          <td className="px-4 py-2.5">{goal.department}</td>
                          <td className="px-4 py-2.5">{goal.targetCO2}</td>
                          <td className="px-4 py-2.5">{goal.currentCO2}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${goal.progress}%` }}
                                />
                              </div>
                              <span>{goal.progress}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">{goal.deadline}</td>
                          <td className="px-4 py-2.5">
                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(goal.status))}>
                              {goal.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <p className="text-[10px] text-muted-foreground">
            Row actions: ✎ View • ✎ Edit • ✖ Delete • Carbon Transactions auto-generated from Purchase/Manufacturing/Fleet/Expenses
          </p>
        </div>
      )}
    </div>
  );
}
