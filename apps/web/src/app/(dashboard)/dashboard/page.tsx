"use client";

import { PageHeader } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, Leaf, Trophy, Award, BarChart3, Activity, Shield, Target, LogIn } from "lucide-react";
import { useDashboardOverview, useDashboardEnvironmental, useDashboardSocial, useDashboardGovernance, useDashboardLeaderboard } from "@/lib/hooks/use-master-data";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const iconMap: Record<string, any> = { Building2, Users, Leaf, Trophy, Award, BarChart3, Activity };

const overviewCards = [
  { key: "totalDepartments", label: "Departments", icon: "Building2", color: "text-blue-600" },
  { key: "totalUsers", label: "Users", icon: "Users", color: "text-green-600" },
  { key: "totalCarbon", label: "CO\u2082 (kg)", icon: "Leaf", color: "text-emerald-600" },
  { key: "totalCSRActivities", label: "CSR Activities", icon: "Activity", color: "text-purple-600" },
  { key: "totalChallenges", label: "Challenges", icon: "Trophy", color: "text-orange-600" },
  { key: "totalBadgesAwarded", label: "Badges Awarded", icon: "Award", color: "text-yellow-600" },
];

export default function DashboardPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: overview } = useDashboardOverview();
  const { data: envData } = useDashboardEnvironmental();
  const { data: socialData } = useDashboardSocial();
  const { data: govData } = useDashboardGovernance();
  const { data: leaderboard } = useDashboardLeaderboard(5);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LogIn className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">Welcome to EcoSphere ESG</h2>
        <p className="mb-6 text-muted-foreground">Please log in to view the dashboard.</p>
        <Link href="/login"><Button>Go to Login</Button></Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Dashboard" description="ESG performance at a glance" />
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {overviewCards.map((c) => {
          const Icon = iconMap[c.icon];
          return (
            <Card key={c.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{c.label}</CardTitle>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(overview as any)?.[c.key] ?? "-"}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {overview?.overallESGScore != null && (
        <Card className="mt-4">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-600" />
              <span className="font-medium">Overall ESG Score</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{overview.overallESGScore.toFixed(1)}%</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="environmental" className="mt-6">
        <TabsList>
          <TabsTrigger value="environmental"><Leaf className="mr-2 h-4 w-4" />Environmental</TabsTrigger>
          <TabsTrigger value="social"><Users className="mr-2 h-4 w-4" />Social</TabsTrigger>
          <TabsTrigger value="governance"><Shield className="mr-2 h-4 w-4" />Governance</TabsTrigger>
          <TabsTrigger value="leaderboard"><BarChart3 className="mr-2 h-4 w-4" />Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="environmental" className="space-y-4">
          {envData?.carbonByDepartment && envData.carbonByDepartment.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Carbon by Department</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {envData.carbonByDepartment.map((d) => (
                    <div key={d.departmentId} className="flex justify-between border-b pb-1">
                      <span>{d.departmentName}</span>
                      <span className="font-medium">{d.totalCO2.toFixed(1)} kg</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {envData?.goalsProgress && envData.goalsProgress.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Goals Progress</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {envData.goalsProgress.map((g) => (
                    <div key={g.id}>
                      <div className="flex justify-between text-sm"><span>{g.name}</span><span>{g.progressPercent.toFixed(0)}%</span></div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.min(g.progressPercent, 100)}%` }} /></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          {socialData && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader><CardTitle>CSR Participation</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Total</span><span>{socialData.csrParticipationStats.total}</span></div>
                    <div className="flex justify-between text-green-600"><span>Approved</span><span>{socialData.csrParticipationStats.approved}</span></div>
                    <div className="flex justify-between text-yellow-600"><span>Pending</span><span>{socialData.csrParticipationStats.pending}</span></div>
                    <div className="flex justify-between text-red-600"><span>Rejected</span><span>{socialData.csrParticipationStats.rejected}</span></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Challenge Completion</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{socialData.challengeCompletionStats.completed}/{socialData.challengeCompletionStats.total}</div>
                  <p className="text-xs text-muted-foreground">challenges completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Top Employees</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    {socialData.topEmployees.slice(0, 5).map((e) => (
                      <div key={e.id} className="flex justify-between"><span>{e.name}</span><span className="font-medium">{e.xp} XP</span></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          {govData && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader><CardTitle>Policy Ack Rate</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(govData.policyAcknowledgementRate * 100).toFixed(0)}%</div>
                </CardContent>
              </Card>
              {govData.auditStatusBreakdown.map((b) => (
                <Card key={b.status}>
                  <CardHeader><CardTitle>Audits: {b.status}</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold">{b._count}</div></CardContent>
                </Card>
              ))}
              {govData.complianceIssuesBySeverity.map((b) => (
                <Card key={b.severity}>
                  <CardHeader><CardTitle>{b.severity} Issues</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold">{b._count}</div></CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader><CardTitle>Top Employees</CardTitle></CardHeader>
            <CardContent>
              {leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.map((e) => (
                    <div key={e.id} className="flex items-center justify-between border-b pb-1">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-bold text-muted-foreground">#{e.rank}</span>
                        <span>{e.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{e.badgeCount} badges</span>
                        <span className="font-medium">{e.xp} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No data</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
