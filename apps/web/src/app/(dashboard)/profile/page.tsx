"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUserBadges, useRewardRedemptions } from "@/lib/hooks/use-master-data";
import { User, Mail, Building2, Shield, Trophy, Star, Gift, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { data: userBadges } = useUserBadges();
  const { data: redemptions } = useRewardRedemptions();

  const myBadges = userBadges?.data?.filter((ub: any) => ub.userId === user?.id) || [];
  const myRedemptions = redemptions?.data?.filter((r: any) => r.userId === user?.id) || [];

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ESG_MANAGER: "ESG Manager",
    DEPT_HEAD: "Department Head",
    EMPLOYEE: "Employee",
    AUDITOR: "Auditor",
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="View and manage your profile information" />

      {/* Profile Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                {user?.avatar && <AvatarImage src={user.avatar} />}
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-xl font-bold">{user?.name}</h3>
              <Badge variant="secondary" className="mt-2">
                {roleLabels[user?.role || ""] || user?.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your personal and organizational information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{user?.department || "Not assigned"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium">{roleLabels[user?.role || ""] || user?.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Star className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Experience Points</p>
                  <p className="text-sm font-medium">{user?.xp || 0} XP</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{user?.xp || 0}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{myBadges.length}</p>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{myRedemptions.length}</p>
              <p className="text-sm text-muted-foreground">Rewards Redeemed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" /> Earned Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myBadges.length === 0 ? (
            <p className="text-sm text-muted-foreground">No badges earned yet. Complete challenges and CSR activities to earn badges!</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {myBadges.map((ub: any) => (
                <div key={ub.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ub.badge?.name}</p>
                    <p className="text-xs text-muted-foreground">{ub.badge?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
