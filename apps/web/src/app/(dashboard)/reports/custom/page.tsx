"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Users,
  Shield,
  Calculator,
  FileBarChart,
  Play,
  Download,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const subTabs = [
  { id: "environmental", label: "Environmental" },
  { id: "social", label: "Social" },
  { id: "governance", label: "Governance" },
  { id: "esg-summary", label: "ESG Summary" },
  { id: "custom-builder", label: "Custom Builder" },
];

const reportTypes = [
  {
    id: "environmental",
    label: "Environmental Report",
    icon: Leaf,
    description: "Emissions, goals, vendor & product breakdown",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "social",
    label: "Social Report",
    icon: Users,
    description: "Diversity, CSR participation, training completion",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "governance",
    label: "Governance Report",
    icon: Shield,
    description: "Policies, audits, compliance & risk summary",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    id: "esg-summary",
    label: "ESG Summary",
    icon: Calculator,
    description: "Executive overview: all 4 scores + dept comparison",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const filterOptions = [
  { label: "Date Range", id: "date-range" },
  { label: "Department", id: "department" },
  { label: "Module", id: "module" },
  { label: "Employee", id: "employee" },
  { label: "Challenge", id: "challenge" },
  { label: "ESG Category", id: "esg-category" },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("environmental");
  const [generating, setGenerating] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleGenerate = (type: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGenerating(type);
    timerRef.current = setTimeout(() => setGenerating(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-semibold">Reports: Analytics &amp; Custom Report Builder</h1>
        <p className="text-xs text-muted-foreground">
          Generate environmental, social, governance and custom reports
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

      {/* Standard Report tabs */}
      {subTabs.slice(0, 4).map((tab) => {
        if (activeTab !== tab.id) return null;
        const report = reportTypes.find((r) => r.id === tab.id)!;
        const Icon = report.icon;
        return (
          <div key={tab.id} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {reportTypes.map((rt) => {
                const RtIcon = rt.icon;
                const isThis = rt.id === tab.id;
                return (
                  <Card
                    key={rt.id}
                    className={cn(
                      "hover:shadow-md transition-shadow cursor-pointer border-2",
                      isThis ? "border-[hsl(var(--sidebar-active))]" : "border-transparent"
                    )}
                    onClick={() => setActiveTab(rt.id)}
                  >
                    <CardContent className="p-4">
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-3", rt.bg)}>
                        <RtIcon className={cn("h-4 w-4", rt.color)} />
                      </div>
                      <p className="text-sm font-semibold mb-1">{rt.label}</p>
                      <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">{rt.description}</p>
                      <Button
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerate(rt.id);
                        }}
                        disabled={generating === rt.id}
                      >
                        {generating === rt.id ? "Generating..." : "Generate"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Preview placeholder */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className={cn("h-3.5 w-3.5", report.color)} />
                  {report.label} — Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-8">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className={cn("h-12 w-12 rounded-full flex items-center justify-center mb-3", report.bg)}>
                    <Icon className={cn("h-6 w-6", report.color)} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleGenerate(tab.id)}
                      disabled={generating === tab.id}
                    >
                      <Play className="h-3 w-3" />
                      {generating === tab.id ? "Generating..." : "Generate Report"}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                      <Download className="h-3 w-3" /> Export PDF
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                      <Download className="h-3 w-3" /> Export Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}

      {/* Custom Builder */}
      {activeTab === "custom-builder" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileBarChart className="h-3.5 w-3.5 text-muted-foreground" />
                Custom Report Builder: Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {filterOptions.map((f) => (
                  <button
                    key={f.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded border text-xs hover:bg-muted transition-colors"
                  >
                    {f.label}
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="h-7 text-xs gap-1">
                  <Play className="h-3 w-3" /> Run Report
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Download className="h-3 w-3" /> Export PDF
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Download className="h-3 w-3" /> Export Excel
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Download className="h-3 w-3" /> Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reportTypes.map((rt) => {
              const Icon = rt.icon;
              return (
                <Card key={rt.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-3", rt.bg)}>
                      <Icon className={cn("h-4 w-4", rt.color)} />
                    </div>
                    <p className="text-sm font-semibold mb-1">{rt.label}</p>
                    <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">{rt.description}</p>
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleGenerate(rt.id)}
                      disabled={generating === rt.id}
                    >
                      {generating === rt.id ? "Generating..." : "Generate"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
