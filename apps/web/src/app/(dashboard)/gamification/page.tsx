"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trophy,
  Medal,
  Star,
  Zap,
  Recycle,
  Car,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const subTabs = [
  { id: "challenges", label: "Challenges" },
  { id: "participation", label: "Challenge Participation" },
  { id: "badges", label: "Badges" },
  { id: "rewards", label: "Rewards" },
  { id: "leaderboard", label: "Leaderboard" },
];

const challengeStages = ["Draft", "Active", "Under Review", "Completed", "Archived"];

const mockChallenges = [
  {
    name: "Sustainability Sprint",
    xp: 200,
    difficulty: "Hard",
    deadline: "07/20",
    status: "Active",
    icon: Zap,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Recycle Challenge",
    xp: 80,
    difficulty: "Easy",
    deadline: "07/15",
    status: "Active",
    icon: Recycle,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Commute Green Woe",
    xp: 120,
    difficulty: "Medium",
    deadline: "07/25",
    status: "Draft",
    icon: Car,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const mockBadges = [
  { name: "Green Beginner", color: "bg-emerald-500/20 text-emerald-600", icon: "🌱" },
  { name: "Carbon Saver", color: "bg-blue-500/20 text-blue-600", icon: "💧" },
  { name: "Sustainability Champion", color: "bg-violet-500/20 text-violet-600", icon: "🏆" },
  { name: "Team Player", color: "bg-amber-500/20 text-amber-600", icon: "🤝" },
];

const mockLeaderboard = [
  { rank: 1, name: "Manufacturing Dept", xp: 4820 },
  { rank: 2, name: "Aditi Rao", xp: 3910 },
  { rank: 3, name: "Corporate Dept", xp: 3505 },
  { rank: 4, name: "Karan Shah", xp: 2840 },
  { rank: 5, name: "Raj Verma", xp: 2610 },
];

const mockParticipation = [
  { employee: "Aditi Rao", challenge: "Sustainability Sprint", proof: "photo.jpg", xp: 200, status: "Completed" },
  { employee: "Karan Shah", challenge: "Recycle Challenge", proof: "video.mp4", xp: 80, status: "Under Review" },
  { employee: "Meena Kumar", challenge: "Commute Green Woe", proof: "—", xp: 0, status: "Active" },
];

const mockRewards = [
  { name: "Gift Voucher ₹500", xpCost: 500, available: 20, status: "Active" },
  { name: "Extra Leave Day", xpCost: 1000, available: 10, status: "Active" },
  { name: "Eco Hamper", xpCost: 750, available: 15, status: "Active" },
];

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "draft": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "under review": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "completed": return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
    case "archived": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState("challenges");

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-semibold">Gamification: Challenges, Badges &amp; Leaderboard</h1>
        <p className="text-xs text-muted-foreground">
          Drive employee engagement through challenges, badges, rewards and leaderboards
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

      {/* Challenges */}
      {activeTab === "challenges" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Challenge
            </Button>
          </div>

          {/* Stage pipeline */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {challengeStages.map((stage) => (
              <div
                key={stage}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-medium whitespace-nowrap",
                  stage === "Active" ? "bg-emerald-500 text-white" :
                  stage === "Under Review" ? "bg-blue-500 text-white" :
                  stage === "Completed" ? "bg-violet-500 text-white" :
                  "bg-muted text-muted-foreground"
                )}
              >
                {stage}
              </div>
            ))}
          </div>

          {/* Challenge cards */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {mockChallenges.map((ch) => {
              const Icon = ch.icon;
              return (
                <Card key={ch.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", ch.bg)}>
                        <Icon className={cn("h-4 w-4", ch.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight">{ch.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          XP: {ch.xp} • {ch.difficulty}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Deadline {ch.deadline}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(ch.status))}>
                        {ch.status}
                      </span>
                      <Button size="sm" className="h-6 text-[10px] px-3 bg-orange-500 hover:bg-orange-600 text-white">
                        Join Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Badges + Leaderboard side by side */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Medal className="h-3.5 w-3.5 text-muted-foreground" /> Badge Gallery
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {mockBadges.map((badge) => (
                    <div
                      key={badge.name}
                      className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium", badge.color)}
                    >
                      <span>{badge.icon}</span>
                      {badge.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" /> Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-1">
                  <div className="grid grid-cols-3 text-[10px] text-muted-foreground font-medium mb-1">
                    <span>Rank</span>
                    <span>Employee/Dept</span>
                    <span className="text-right">XP</span>
                  </div>
                  {mockLeaderboard.slice(0, 3).map((e) => (
                    <div key={e.rank} className="grid grid-cols-3 text-xs py-1 border-b last:border-0">
                      <span className="font-bold text-muted-foreground">{e.rank}</span>
                      <span>{e.name}</span>
                      <span className="text-right font-medium">{e.xp.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Challenge Participation */}
      {activeTab === "participation" && (
        <div className="space-y-3">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Employee</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Challenge</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Proof</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">XP Earned</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockParticipation.map((p, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{p.employee}</td>
                        <td className="px-4 py-2.5">{p.challenge}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{p.proof}</td>
                        <td className="px-4 py-2.5 text-right">{p.xp}</td>
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
        </div>
      )}

      {/* Badges */}
      {activeTab === "badges" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Badge
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {mockBadges.map((badge) => (
              <Card key={badge.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-2xl", badge.color)}>
                    {badge.icon}
                  </div>
                  <p className="text-xs font-semibold text-center">{badge.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rewards */}
      {activeTab === "rewards" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> New Reward
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Reward</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">XP Cost</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Available</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRewards.map((r, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium">{r.name}</td>
                        <td className="px-4 py-2.5 text-right">{r.xpCost} XP</td>
                        <td className="px-4 py-2.5 text-right">{r.available}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getStatusColor(r.status))}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <Button size="sm" className="h-5 text-[10px] px-2">Redeem</Button>
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

      {/* Leaderboard */}
      {activeTab === "leaderboard" && (
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5 text-amber-500" /> Full Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Rank</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Employee / Dept</th>
                      <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLeaderboard.map((e) => (
                      <tr key={e.rank} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-bold text-muted-foreground">
                          {e.rank === 1 ? "🥇" : e.rank === 2 ? "🥈" : e.rank === 3 ? "🥉" : `#${e.rank}`}
                        </td>
                        <td className="px-4 py-2.5 font-medium">{e.name}</td>
                        <td className="px-4 py-2.5 text-right">{e.xp.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
