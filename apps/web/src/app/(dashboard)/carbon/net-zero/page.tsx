"use client";

import { PageHeader } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TrendingDown, Target, BarChart3 } from "lucide-react";

const stats = [
  { label: "Total Emissions", value: "12,450 kg CO\u2082", change: "-8%", icon: BarChart3, color: "text-blue-600" },
  { label: "Reduction Target", value: "50% by 2030", change: "On track", icon: Target, color: "text-green-600" },
  { label: "Offsets Purchased", value: "2,000 kg", change: "+15%", icon: TrendingDown, color: "text-purple-600" },
  { label: "Net Position", value: "10,450 kg", change: "-5%", icon: Leaf, color: "text-emerald-600" },
];

const milestones = [
  { year: 2025, target: "10% reduction", status: "Achieved" },
  { year: 2026, target: "20% reduction", status: "In Progress" },
  { year: 2028, target: "35% reduction", status: "Planned" },
  { year: 2030, target: "50% reduction (Net Zero)", status: "Target" },
];

export default function NetZeroPage() {
  return (
    <>
      <PageHeader title="Net Zero Target" description="Track progress toward carbon neutrality" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
                <p className="text-xs text-muted-foreground">{s.change} vs last period</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Net Zero Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((m) => (
              <div key={m.year} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <span className="font-medium">{m.year}</span>
                  <span className="ml-4 text-sm text-muted-foreground">{m.target}</span>
                </div>
                <span className={`text-sm font-medium ${m.status === "Achieved" ? "text-green-600" : m.status === "In Progress" ? "text-yellow-600" : "text-muted-foreground"}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
