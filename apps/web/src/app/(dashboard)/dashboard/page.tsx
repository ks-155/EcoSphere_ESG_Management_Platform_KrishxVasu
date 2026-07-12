"use client";

import { useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  LogIn,
  Plus,
  Swords,
  FileBarChart,
  ArrowUpRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import {
  useDashboardOverview,
  useDashboardEnvironmental,
} from "@/lib/hooks/use-master-data";

const EmissionsTrendChart = dynamic(
  () => import("./_charts/emissions-trend").then((m) => m.EmissionsTrendChart),
  { ssr: false, loading: () => <div className="h-[200px] skeleton" /> }
);

const DeptRankingChart = dynamic(
  () => import("./_charts/dept-ranking").then((m) => m.DeptRankingChart),
  { ssr: false, loading: () => <div className="h-[200px] skeleton" /> }
);

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "6px",
  fontSize: "12px",
} as const;

function KpiTile({ kpi }: { kpi: { label: string; value: string; trend: string; up: boolean; color: string; borderColor: string } }) {
  return (
    <Card className={cn("border-l-4 card-hover cursor-pointer", kpi.borderColor)}>
      <CardHeader className="pb-1 pt-3 px-4">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {kpi.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 px-4">
        <div className={cn("text-2xl font-bold", kpi.color)}>{kpi.value}</div>
        <div className="flex items-center gap-1 mt-1">
          {kpi.up ? (
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={cn("text-xs", kpi.up ? "text-emerald-500" : "text-red-500")}>
            {kpi.trend} vs last month
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

const MemoKpiTile = memo(KpiTile);

export default function DashboardPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: overview } = useDashboardOverview();
  const { data: envData } = useDashboardEnvironmental();

  const kpiTiles = useMemo(() => [
    {
      label: "Environmental Score",
      value: overview?.overallESGScore != null ? `${Math.round(overview.overallESGScore * 0.82)} / 100` : "82 / 100",
      trend: "+3%",
      up: true,
      color: "text-emerald-500",
      borderColor: "border-l-emerald-500",
    },
    {
      label: "Social Score",
      value: "74 / 100",
      trend: "+1%",
      up: true,
      color: "text-blue-500",
      borderColor: "border-l-blue-500",
    },
    {
      label: "Governance Score",
      value: `${overview?.overallESGScore != null ? Math.round(overview.overallESGScore * 0.88) : 88} / 100`,
      trend: "+5%",
      up: true,
      color: "text-violet-500",
      borderColor: "border-l-violet-500",
    },
    {
      label: "Overall ESG Score",
      value: overview?.overallESGScore != null ? `${Math.round(overview.overallESGScore)} / 100` : "81 / 100",
      trend: "+2%",
      up: true,
      color: "text-orange-500",
      borderColor: "border-l-orange-500",
    },
  ], [overview?.overallESGScore]);

  const emissionsTrend = useMemo(() => {
    if (envData?.carbonTrend?.length) {
      return envData.carbonTrend.map((d) => ({ month: d.month, value: d.totalCO2 }));
    }
    return [
      { month: "Jan", value: 420 }, { month: "Feb", value: 380 },
      { month: "Mar", value: 450 }, { month: "Apr", value: 390 },
      { month: "May", value: 340 }, { month: "Jun", value: 310 },
      { month: "Jul", value: 360 }, { month: "Aug", value: 290 },
      { month: "Sep", value: 320 }, { month: "Oct", value: 280 },
      { month: "Nov", value: 260 }, { month: "Dec", value: 240 },
    ];
  }, [envData?.carbonTrend]);

  const deptRanking = useMemo(() => {
    if (envData?.carbonByDepartment?.length) {
      return envData.carbonByDepartment.slice(0, 5).map((d) => ({
        name: d.departmentName.slice(0, 4),
        value: Math.round(100 - d.totalCO2 / 10),
      }));
    }
    return [
      { name: "Biz", value: 88 }, { name: "Mfg", value: 72 },
      { name: "Logi", value: 65 }, { name: "Corp", value: 91 },
      { name: "R&D", value: 78 },
    ];
  }, [envData?.carbonByDepartment]);

  const recentActivity = useMemo(() => [
    { icon: "✓", text: "Priya completed 'Zero Waste Week'", type: "success" },
    { icon: "⚠", text: "New compliance issue in Logistics", type: "warning" },
    { icon: "📊", text: "47 new Carbon Transactions logged", type: "info" },
    { icon: "✓", text: "R&D acknowledged Anti-Corruption Policy", type: "success" },
  ], []);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <LogIn className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">Welcome to EcoSphere ESG</h2>
        <p className="mb-6 text-muted-foreground">Please log in to view the dashboard.</p>
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-semibold">Executive Overview</h1>
        <p className="text-xs text-muted-foreground">
          Live KPI tiles • trend arrows • click-through to module
        </p>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpiTiles.map((kpi) => (
          <MemoKpiTile key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Emissions Trend */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              Emissions Trend (12 mo)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <EmissionsTrendChart data={emissionsTrend} tooltipStyle={tooltipStyle} />
          </CardContent>
        </Card>

        {/* Department ESG Ranking */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
              Department ESG Ranking
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <DeptRankingChart data={deptRanking} tooltipStyle={tooltipStyle} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Recent Activity + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-2">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span
                  className={cn(
                    "mt-0.5 h-4 w-4 flex items-center justify-center rounded-full text-[10px] shrink-0",
                    item.type === "success" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                    item.type === "warning" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    item.type === "info" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  )}
                >
                  {item.icon}
                </span>
                <span className="text-muted-foreground leading-relaxed">{item.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-2">
            <Link href="/carbon/entries">
              <Button className="w-full justify-start text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white" size="sm">
                <Plus className="mr-2 h-3.5 w-3.5" />
                Log Carbon Data
              </Button>
            </Link>
            <Link href="/gamification">
              <Button className="w-full justify-start text-xs h-8 bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                <Swords className="mr-2 h-3.5 w-3.5" />
                Start Challenge
              </Button>
            </Link>
            <Link href="/reports/custom">
              <Button variant="outline" className="w-full justify-start text-xs h-8" size="sm">
                <FileBarChart className="mr-2 h-3.5 w-3.5" />
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
