import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryParams } from "@/types/api";
import { toast } from "@/components/ui/use-toast";
import {
  departmentsApi,
  categoriesApi,
  emissionFactorsApi,
  productProfilesApi,
  goalsApi,
  policiesApi,
  badgesApi,
  rewardsApi,
  carbonTransactionsApi,
  csrActivitiesApi,
  employeeParticipationApi,
  challengesApi,
  challengeParticipationApi,
  auditsApi,
  complianceIssuesApi,
  departmentScoresApi,
  notificationsApi,
  policyAcknowledgementsApi,
  rewardRedemptionsApi,
  userBadgesApi,
  dashboardApi,
} from "@/lib/api/master-data";

interface CrudApi<T> {
  list: (params?: QueryParams) => Promise<any>;
  getById: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

function createCrudHooks<T>(resourceKey: string, api: CrudApi<T>) {
  const queryKey = resourceKey;

  function useList(params?: QueryParams) {
    return useQuery({ queryKey: [queryKey, "list", params], queryFn: () => api.list(params) });
  }

  function useGetById(id: string) {
    return useQuery({ queryKey: [queryKey, id], queryFn: () => api.getById(id), enabled: !!id });
  }

  function useCreate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (data: Partial<T>) => api.create(data),
      onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast({ title: "Created successfully", variant: "success" }); },
      onError: (e: any) => toast({ title: "Failed to create", description: e?.response?.data?.message || "An error occurred", variant: "destructive" }),
    });
  }

  function useUpdate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => api.update(id, data),
      onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast({ title: "Updated successfully", variant: "success" }); },
      onError: (e: any) => toast({ title: "Failed to update", description: e?.response?.data?.message || "An error occurred", variant: "destructive" }),
    });
  }

  function useDelete() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => api.remove(id),
      onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast({ title: "Deleted successfully", variant: "success" }); },
      onError: (e: any) => toast({ title: "Failed to delete", description: e?.response?.data?.message || "An error occurred", variant: "destructive" }),
    });
  }

  return { useList, useGetById, useCreate, useUpdate, useDelete };
}

export const { useList: useDepartments, useCreate: useCreateDepartment, useUpdate: useUpdateDepartment, useDelete: useDeleteDepartment } = createCrudHooks("departments", departmentsApi);
export const { useList: useCategories, useCreate: useCreateCategory, useUpdate: useUpdateCategory, useDelete: useDeleteCategory } = createCrudHooks("categories", categoriesApi);
export const { useList: useEmissionFactors, useCreate: useCreateEmissionFactor, useUpdate: useUpdateEmissionFactor, useDelete: useDeleteEmissionFactor } = createCrudHooks("emission-factors", emissionFactorsApi);
export const { useList: useProductProfiles, useCreate: useCreateProductProfile, useUpdate: useUpdateProductProfile, useDelete: useDeleteProductProfile } = createCrudHooks("product-profiles", productProfilesApi);
export const { useList: useGoals, useCreate: useCreateGoal, useUpdate: useUpdateGoal, useDelete: useDeleteGoal } = createCrudHooks("goals", goalsApi);
export const { useList: usePolicies, useCreate: useCreatePolicy, useUpdate: useUpdatePolicy, useDelete: useDeletePolicy } = createCrudHooks("policies", policiesApi);
export const { useList: useBadges, useCreate: useCreateBadge, useUpdate: useUpdateBadge, useDelete: useDeleteBadge } = createCrudHooks("badges", badgesApi);
export const { useList: useRewards, useCreate: useCreateReward, useUpdate: useUpdateReward, useDelete: useDeleteReward } = createCrudHooks("rewards", rewardsApi);
export const { useList: useCarbonTransactions, useCreate: useCreateCarbonTransaction, useUpdate: useUpdateCarbonTransaction, useDelete: useDeleteCarbonTransaction } = createCrudHooks("carbon-transactions", carbonTransactionsApi);
export const { useList: useCsrActivities, useCreate: useCreateCsrActivity, useUpdate: useUpdateCsrActivity, useDelete: useDeleteCsrActivity } = createCrudHooks("csr-activities", csrActivitiesApi);
export const { useList: useChallenges, useCreate: useCreateChallenge, useUpdate: useUpdateChallenge, useDelete: useDeleteChallenge } = createCrudHooks("challenges", challengesApi);
export const { useList: useAudits, useCreate: useCreateAudit, useUpdate: useUpdateAudit, useDelete: useDeleteAudit } = createCrudHooks("audits", auditsApi);
export const { useList: useComplianceIssues, useCreate: useCreateComplianceIssue, useUpdate: useUpdateComplianceIssue, useDelete: useDeleteComplianceIssue } = createCrudHooks("compliance-issues", complianceIssuesApi);

// ─── Employee Participation (with approve/reject) ───────────
export const { useList: useEmployeeParticipations, useCreate: useCreateEmployeeParticipation, useUpdate: useUpdateEmployeeParticipation, useDelete: useDeleteEmployeeParticipation } = createCrudHooks("employee-participations", employeeParticipationApi);

export function useApproveParticipation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeParticipationApi.approve(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["employee-participations"] }); toast({ title: "Approved", variant: "success" }); },
    onError: (e: any) => toast({ title: "Failed to approve", description: e?.response?.data?.message, variant: "destructive" }),
  });
}

export function useRejectParticipation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeParticipationApi.reject(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["employee-participations"] }); toast({ title: "Rejected", variant: "destructive" }); },
    onError: (e: any) => toast({ title: "Failed to reject", description: e?.response?.data?.message, variant: "destructive" }),
  });
}

// ─── Challenge Participation (with approve/reject/leaderboard) ─
export const { useList: useChallengeParticipations } = createCrudHooks("challenge-participations", challengeParticipationApi);

export function useApproveChallengeParticipation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => challengeParticipationApi.approve(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["challenge-participations"] }); toast({ title: "Approved", variant: "success" }); },
    onError: (e: any) => toast({ title: "Failed to approve", description: e?.response?.data?.message, variant: "destructive" }),
  });
}

export function useRejectChallengeParticipation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => challengeParticipationApi.reject(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["challenge-participations"] }); toast({ title: "Rejected", variant: "destructive" }); },
    onError: (e: any) => toast({ title: "Failed to reject", description: e?.response?.data?.message, variant: "destructive" }),
  });
}

export function useChallengeLeaderboard() {
  return useQuery({
    queryKey: ["challenge-leaderboard"],
    queryFn: () => challengeParticipationApi.leaderboard(),
  });
}

// ─── Department Scores ──────────────────────────────────────
export const { useList: useDepartmentScores } = createCrudHooks("department-scores", departmentScoresApi);

export function useCalculateScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { departmentId: string; periodStart: string; periodEnd: string }) => departmentScoresApi.calculate(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["department-scores"] }); toast({ title: "Score calculated", variant: "success" }); },
    onError: (e: any) => toast({ title: "Calculation failed", description: e?.response?.data?.message, variant: "destructive" }),
  });
}

export function useOrgScore() {
  return useQuery({
    queryKey: ["org-score"],
    queryFn: () => departmentScoresApi.orgScore(),
  });
}

// ─── Notifications ──────────────────────────────────────────
export function useNotifications(userId: string, params?: QueryParams & { isRead?: string; type?: string }) {
  return useQuery({
    queryKey: ["notifications", userId, params],
    queryFn: () => notificationsApi.byUser(userId, params),
    enabled: !!userId,
  });
}

export function useUnreadCount(userId: string) {
  return useQuery({
    queryKey: ["unread-count", userId],
    queryFn: () => notificationsApi.unreadCount(userId),
    enabled: !!userId,
    refetchInterval: 30000,
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => notificationsApi.markAllAsRead(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// ─── Policy Acknowledgements ────────────────────────────────
export const { useList: usePolicyAcknowledgements } = createCrudHooks("policy-acknowledgements", policyAcknowledgementsApi);

// ─── Reward Redemptions ─────────────────────────────────────
export const { useList: useRewardRedemptions } = createCrudHooks("reward-redemptions", rewardRedemptionsApi);

export function useRedeemReward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, rewardId }: { userId: string; rewardId: string }) => rewardRedemptionsApi.redeem(userId, rewardId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["reward-redemptions"] }); toast({ title: "Reward redeemed", variant: "success" }); },
    onError: (e: any) => toast({ title: "Redemption failed", description: e?.response?.data?.message, variant: "destructive" }),
  });
}

// ─── User Badges ────────────────────────────────────────────
export const { useList: useUserBadges } = createCrudHooks("user-badges", userBadgesApi);

export function useCheckAndAwardBadges() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => userBadgesApi.checkAndAward(userId),
    onSuccess: (data) => { qc.invalidateQueries({ queryKey: ["user-badges"] }); toast({ title: `${data.newlyAwardedCount} badge(s) awarded`, variant: "success" }); },
    onError: (e: any) => toast({ title: "Failed to check badges", description: e?.response?.data?.message, variant: "destructive" }),
  });
}

// ─── Dashboard ──────────────────────────────────────────────
export function useDashboardOverview() {
  return useQuery({ queryKey: ["dashboard-overview"], queryFn: () => dashboardApi.overview() });
}

export function useDashboardEnvironmental(params?: { start?: string; end?: string }) {
  return useQuery({ queryKey: ["dashboard-environmental", params], queryFn: () => dashboardApi.environmental(params) });
}

export function useDashboardSocial() {
  return useQuery({ queryKey: ["dashboard-social"], queryFn: () => dashboardApi.social() });
}

export function useDashboardGovernance() {
  return useQuery({ queryKey: ["dashboard-governance"], queryFn: () => dashboardApi.governance() });
}

export function useDashboardLeaderboard(limit?: number) {
  return useQuery({ queryKey: ["dashboard-leaderboard", limit], queryFn: () => dashboardApi.leaderboard(limit) });
}
