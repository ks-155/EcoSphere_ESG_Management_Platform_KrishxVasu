"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Leaf, TrendingDown, Target, FlaskConical } from "lucide-react";

export default function EnvironmentalDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "environmental"],
    queryFn: () => dashboardApi.getEnvironmental(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Environmental Dashboard" description="Track carbon emissions, environmental goals, and sustainability metrics" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse"><CardContent className="h-24" /></Card>
          ))}
        </div>
      </div>
    );
  }

  const totalCO2 = data?.carbonByDepartment.reduce((sum, d) => sum + d.totalCO2, 0) ?? 0;
  const goalsOnTrack = data?.goalsProgress.filter((g) => g.progressPercent >= 50).length ?? 0;
  const totalGoals = data?.goalsProgress.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Environmental Dashboard" description="Track carbon emissions, environmental goals, and sustainability metrics" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CO₂ Emissions</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCO2.toFixed(1)} tCO₂e</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments Tracked</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.carbonByDepartment.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">Active emission sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals On Track</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalsOnTrack}/{totalGoals}</div>
            <p className="text-xs text-muted-foreground">Goals at ≥50% progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emission Factors</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.emissionFactors.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">Active factors in use</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CO₂ by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.carbonByDepartment && data.carbonByDepartment.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.carbonByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="departmentName" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="totalCO2" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No carbon data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carbon Emissions Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.carbonTrend && data.carbonTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.carbonTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalCO2" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environmental Goals Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.goalsProgress && data.goalsProgress.length > 0 ? (
            <div className="space-y-4">
              {data.goalsProgress.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.currentValue}/{goal.targetValue} ({goal.progressPercent.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all"
                      style={{ width: `${Math.min(100, goal.progressPercent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No goals defined yet</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Emission Factors</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.emissionFactors && data.emissionFactors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium">Name</th>
                    <th className="py-2 text-left font-medium">Category</th>
                    <th className="py-2 text-right font-medium">Value</th>
                    <th className="py-2 text-left font-medium">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {data.emissionFactors.map((ef) => (
                    <tr key={ef.id} className="border-b last:border-0">
                      <td className="py-2">{ef.name}</td>
                      <td className="py-2">{ef.category}</td>
                      <td className="py-2 text-right">{ef.value}</td>
                      <td className="py-2">{ef.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No emission factors defined</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
