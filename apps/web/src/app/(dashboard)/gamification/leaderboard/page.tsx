"use client";

import { PageHeader } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { useChallengeLeaderboard } from "@/lib/hooks/use-master-data";

const rankIcons = [Trophy, Medal, Award];

export default function LeaderboardPage() {
  const { data, isLoading } = useChallengeLeaderboard();

  return (
    <>
      <PageHeader title="Challenge Leaderboard" description="Top employees by challenge XP" />
      <Card>
        <CardHeader><CardTitle>Rankings</CardTitle></CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {data && data.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet</p>}
          {data && data.length > 0 && (
            <div className="space-y-3">
              {data.map((entry) => {
                const RankIcon = rankIcons[entry.rank - 1] || Trophy;
                return (
                  <div key={entry.employeeId} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                      <RankIcon className={`h-5 w-5 ${entry.rank === 1 ? "text-yellow-500" : entry.rank === 2 ? "text-gray-400" : entry.rank === 3 ? "text-orange-500" : "text-muted-foreground"}`} />
                      <span className="font-medium">#{entry.rank}</span>
                      <span>{entry.employee?.name || entry.employeeId}</span>
                    </div>
                    <span className="font-bold">{entry.totalXp} XP</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
