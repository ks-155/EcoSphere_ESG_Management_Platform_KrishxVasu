import { apiClient } from "@/lib/api-client";

export interface OverviewData {
  totalDepartments: number;
  totalUsers: number;
  totalCarbon: number;
  totalCSRActivities: number;
  totalChallenges: number;
  totalBadgesAwarded: number;
  overallESGScore: number;
}

export interface EnvironmentalData {
  carbonByDepartment: Array<{
    departmentId: string;
    departmentName: string;
    totalCO2: number;
    transactionCount: number;
  }>;
  carbonTrend: Array<{ month: string; totalCO2: number }>;
  goalsProgress: Array<{
    id: string;
    name: string;
    targetValue: number;
    currentValue: number;
    status: string;
    deadline: string;
    progressPercent: number;
  }>;
  emissionFactors: Array<{
    id: string;
    name: string;
    category: string;
    value: number;
    unit: string;
  }>;
}

export interface SocialData {
  csrParticipationStats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  challengeCompletionStats: {
    total: number;
    completed: number;
  };
  topEmployees: Array<{
    id: string;
    name: string;
    email: string;
    xp: number;
    departmentId: string;
  }>;
  participationTrend: Array<{ month: string; count: number }>;
}

export interface GovernanceData {
  policyAcknowledgementRate: number;
  auditStatusBreakdown: Array<{ status: string; _count: number }>;
  complianceIssuesBySeverity: Array<{ severity: string; _count: number }>;
  issuesByStatus: Array<{ status: string; _count: number }>;
  complianceTrend: Array<{ month: string; resolvedCount: number }>;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  email: string;
  xp: number;
  departmentId: string;
  avatar?: string;
  badgeCount: number;
}

export interface ScoresData {
  departmentScores: any[];
  overallScore: number;
  scoreTrend: Array<{ month: string; avgScore: number }>;
}

export const dashboardApi = {
  getOverview: () =>
    apiClient.get<OverviewData>("/api/dashboard/overview").then((r) => r.data),

  getEnvironmental: (start?: string, end?: string) =>
    apiClient
      .get<EnvironmentalData>("/api/dashboard/environmental", { params: { start, end } })
      .then((r) => r.data),

  getSocial: () =>
    apiClient.get<SocialData>("/api/dashboard/social").then((r) => r.data),

  getGovernance: () =>
    apiClient.get<GovernanceData>("/api/dashboard/governance").then((r) => r.data),

  getScores: () =>
    apiClient.get<ScoresData>("/api/dashboard/scores").then((r) => r.data),

  getLeaderboard: (limit = 10) =>
    apiClient
      .get<LeaderboardEntry[]>("/api/dashboard/leaderboard", { params: { limit } })
      .then((r) => r.data),

  getOrgSettings: () =>
    apiClient.get<any>("/api/organization/settings").then((r) => r.data),

  updateOrgSettings: (data: any) =>
    apiClient.put<any>("/api/organization/settings", data).then((r) => r.data),
};
