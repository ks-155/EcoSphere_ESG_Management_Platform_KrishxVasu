import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse, QueryParams } from "@/types/api";
import type {
  Department,
  Category,
  EmissionFactor,
  ProductProfile,
  Goal,
  Policy,
  Badge,
  Reward,
  CarbonTransaction,
  CsrActivity,
  EmployeeParticipation,
  Challenge,
  ChallengeParticipation,
  Audit,
  ComplianceIssue,
  DepartmentScore,
  Notification,
  PolicyAcknowledgement,
  RewardRedemption,
  UserBadge,
  DashboardOverview,
  EnvironmentalDashboard,
  SocialDashboard,
  GovernanceDashboard,
  LeaderboardEntry,
  ChallengeLeaderboardEntry,
} from "@/types/master-data";

function createCrudApi<T>(basePath: string) {
  return {
    list: (params?: QueryParams) =>
      apiClient.get<PaginatedResponse<T>>(basePath, { params }).then((r) => r.data),
    getById: (id: string) =>
      apiClient.get<T>(`${basePath}/${id}`).then((r) => r.data),
    create: (data: Partial<T>) =>
      apiClient.post<T>(basePath, data).then((r) => r.data),
    update: (id: string, data: Partial<T>) =>
      apiClient.patch<T>(`${basePath}/${id}`, data).then((r) => r.data),
    remove: (id: string) =>
      apiClient.delete(`${basePath}/${id}`).then((r) => r.data),
  };
}

export const departmentsApi = createCrudApi<Department>("/api/departments");
export const categoriesApi = createCrudApi<Category>("/api/categories");
export const emissionFactorsApi = createCrudApi<EmissionFactor>("/api/emission-factors");
export const productProfilesApi = createCrudApi<ProductProfile>("/api/product-profiles");
export const goalsApi = createCrudApi<Goal>("/api/goals");
export const policiesApi = createCrudApi<Policy>("/api/policies");
export const badgesApi = createCrudApi<Badge>("/api/badges");
export const rewardsApi = createCrudApi<Reward>("/api/rewards");
export const carbonTransactionsApi = createCrudApi<CarbonTransaction>("/api/carbon-transactions");
export const csrActivitiesApi = createCrudApi<CsrActivity>("/api/csr-activities");
export const challengesApi = createCrudApi<Challenge>("/api/challenges");
export const auditsApi = createCrudApi<Audit>("/api/audits");
export const complianceIssuesApi = createCrudApi<ComplianceIssue>("/api/compliance-issues");

// ─── Employee Participations (with approve/reject) ──────────
export const employeeParticipationApi = {
  ...createCrudApi<EmployeeParticipation>("/api/employee-participations"),
  approve: (id: string) =>
    apiClient.post<EmployeeParticipation>(`/api/employee-participations/${id}/approve`).then((r) => r.data),
  reject: (id: string) =>
    apiClient.post<EmployeeParticipation>(`/api/employee-participations/${id}/reject`).then((r) => r.data),
};

// ─── Challenge Participations (with approve/reject/leaderboard) ─
export const challengeParticipationApi = {
  ...createCrudApi<ChallengeParticipation>("/api/challenge-participations"),
  approve: (id: string) =>
    apiClient.post<ChallengeParticipation>(`/api/challenge-participations/${id}/approve`).then((r) => r.data),
  reject: (id: string) =>
    apiClient.post<ChallengeParticipation>(`/api/challenge-participations/${id}/reject`).then((r) => r.data),
  leaderboard: () =>
    apiClient.get<ChallengeLeaderboardEntry[]>("/api/challenge-participations/leaderboard").then((r) => r.data),
};

// ─── Department Scores ──────────────────────────────────────
export const departmentScoresApi = {
  ...createCrudApi<DepartmentScore>("/api/department-scores"),
  orgScore: () =>
    apiClient.get<{ overallScore: number }>("/api/department-scores/org-score").then((r) => r.data),
  calculate: (data: { departmentId: string; periodStart: string; periodEnd: string }) =>
    apiClient.post<DepartmentScore>("/api/department-scores/calculate", data).then((r) => r.data),
};

// ─── Notifications ──────────────────────────────────────────
export const notificationsApi = {
  ...createCrudApi<Notification>("/api/notifications"),
  byUser: (userId: string, params?: QueryParams & { isRead?: string; type?: string }) =>
    apiClient.get<PaginatedResponse<Notification>>(`/api/notifications/user/${userId}`, { params }).then((r) => r.data),
  unreadCount: (userId: string) =>
    apiClient.get<{ count: number }>(`/api/notifications/unread-count/${userId}`).then((r) => r.data),
  markAsRead: (id: string) =>
    apiClient.patch<Notification>(`/api/notifications/${id}/read`).then((r) => r.data),
  markAllAsRead: (userId: string) =>
    apiClient.patch<{ count: number }>(`/api/notifications/read-all/${userId}`).then((r) => r.data),
};

// ─── Policy Acknowledgements ────────────────────────────────
export const policyAcknowledgementsApi = createCrudApi<PolicyAcknowledgement>("/api/policy-acknowledgements");

// ─── Reward Redemptions ─────────────────────────────────────
export const rewardRedemptionsApi = {
  ...createCrudApi<RewardRedemption>("/api/reward-redemptions"),
  byUser: (userId: string) =>
    apiClient.get<RewardRedemption[]>(`/api/reward-redemptions/user/${userId}`).then((r) => r.data),
  redeem: (userId: string, rewardId: string) =>
    apiClient.post<RewardRedemption>("/api/reward-redemptions/redeem", { userId, rewardId }).then((r) => r.data),
};

// ─── User Badges ────────────────────────────────────────────
export const userBadgesApi = {
  ...createCrudApi<UserBadge>("/api/user-badges"),
  byUser: (userId: string) =>
    apiClient.get<UserBadge[]>(`/api/user-badges/user/${userId}`).then((r) => r.data),
  checkAndAward: (userId: string) =>
    apiClient.post<{ userId: string; newlyAwardedCount: number; newlyAwardedIds: string[] }>(`/api/user-badges/check/${userId}`).then((r) => r.data),
};

// ─── Dashboard ──────────────────────────────────────────────
export const dashboardApi = {
  overview: () =>
    apiClient.get<DashboardOverview>("/api/dashboard/overview").then((r) => r.data),
  environmental: (params?: { start?: string; end?: string }) =>
    apiClient.get<EnvironmentalDashboard>("/api/dashboard/environmental", { params }).then((r) => r.data),
  social: () =>
    apiClient.get<SocialDashboard>("/api/dashboard/social").then((r) => r.data),
  governance: () =>
    apiClient.get<GovernanceDashboard>("/api/dashboard/governance").then((r) => r.data),
  leaderboard: (limit?: number) =>
    apiClient.get<LeaderboardEntry[]>("/api/dashboard/leaderboard", { params: { limit } }).then((r) => r.data),
};
