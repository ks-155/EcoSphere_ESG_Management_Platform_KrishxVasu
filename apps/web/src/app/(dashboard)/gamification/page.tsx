"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared";
import { Trophy, Medal, Gift, TrendingUp, Star, Zap } from "lucide-react";
import Link from "next/link";

export default function GamificationHubPage() {
  const user = useAuthStore((s) => s.user);

  const { data: leaderboard } = useQuery({
    queryKey: ["dashboard", "leaderboard"],
    queryFn: () => dashboardApi.getLeaderboard(5),
  });

  const myRank = leaderboard?.find((e) => e.id === user?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gamification Hub"
        description="Track your progress, earn XP, and climb the leaderboard"
      />

      {/* User Progress Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{user?.name ?? "Employee"}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <strong>{user?.xp ?? 0}</strong> XP
                </span>
                <span className="flex items-center gap-1">
                  <Medal className="h-4 w-4 text-blue-500" />
                  Rank #{myRank?.rank ?? "-"}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-purple-500" />
                  {myRank?.badgeCount ?? 0} Badges
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/gamification/badges">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges</CardTitle>
              <Medal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myRank?.badgeCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">Badges earned</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/gamification/rewards">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rewards Store</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user?.xp ?? 0}</div>
              <p className="text-xs text-muted-foreground">Available XP to redeem</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/challenges/templates">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Challenges</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {leaderboard?.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Active challenges available</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Top 5 Leaderboard Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top Performers</CardTitle>
          <Link href="/gamification/leaderboard" className="text-sm text-primary hover:underline">
            View Full Leaderboard →
          </Link>
        </CardHeader>
        <CardContent>
          {leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((emp, i) => (
                <div key={emp.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        i === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : i === 1
                          ? "bg-gray-100 text-gray-800"
                          : i === 2
                          ? "bg-orange-100 text-orange-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.badgeCount} badges</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{emp.xp} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No leaderboard data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
