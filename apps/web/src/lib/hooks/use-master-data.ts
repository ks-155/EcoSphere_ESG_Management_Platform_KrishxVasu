import { createCrudHooks } from "./use-crud";
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
} from "@/lib/api/master-data";

export const {
  useList: useDepartments,
  useCreate: useCreateDepartment,
  useUpdate: useUpdateDepartment,
  useDelete: useDeleteDepartment,
} = createCrudHooks("departments", departmentsApi);

export const {
  useList: useCategories,
  useCreate: useCreateCategory,
  useUpdate: useUpdateCategory,
  useDelete: useDeleteCategory,
} = createCrudHooks("categories", categoriesApi);

export const {
  useList: useEmissionFactors,
  useCreate: useCreateEmissionFactor,
  useUpdate: useUpdateEmissionFactor,
  useDelete: useDeleteEmissionFactor,
} = createCrudHooks("emission-factors", emissionFactorsApi);

export const {
  useList: useProductProfiles,
  useCreate: useCreateProductProfile,
  useUpdate: useUpdateProductProfile,
  useDelete: useDeleteProductProfile,
} = createCrudHooks("product-profiles", productProfilesApi);

export const {
  useList: useGoals,
  useCreate: useCreateGoal,
  useUpdate: useUpdateGoal,
  useDelete: useDeleteGoal,
} = createCrudHooks("goals", goalsApi);

export const {
  useList: usePolicies,
  useCreate: useCreatePolicy,
  useUpdate: useUpdatePolicy,
  useDelete: useDeletePolicy,
} = createCrudHooks("policies", policiesApi);

export const {
  useList: useBadges,
  useCreate: useCreateBadge,
  useUpdate: useUpdateBadge,
  useDelete: useDeleteBadge,
} = createCrudHooks("badges", badgesApi);

export const {
  useList: useRewards,
  useCreate: useCreateReward,
  useUpdate: useUpdateReward,
  useDelete: useDeleteReward,
} = createCrudHooks("rewards", rewardsApi);

// ─── Phase 3: Carbon Management ─────────────────────────────
export const {
  useList: useCarbonTransactions,
  useCreate: useCreateCarbonTransaction,
  useUpdate: useUpdateCarbonTransaction,
  useDelete: useDeleteCarbonTransaction,
} = createCrudHooks("carbon-transactions", carbonTransactionsApi);

// ─── Phase 4: CSR & Challenges ──────────────────────────────
export const {
  useList: useCsrActivities,
  useCreate: useCreateCsrActivity,
  useUpdate: useUpdateCsrActivity,
  useDelete: useDeleteCsrActivity,
} = createCrudHooks("csr-activities", csrActivitiesApi);

export const {
  useList: useEmployeeParticipation,
  useCreate: useCreateEmployeeParticipation,
  useUpdate: useUpdateEmployeeParticipation,
  useDelete: useDeleteEmployeeParticipation,
} = createCrudHooks("employee-participation", employeeParticipationApi);

export const {
  useList: useChallenges,
  useCreate: useCreateChallenge,
  useUpdate: useUpdateChallenge,
  useDelete: useDeleteChallenge,
} = createCrudHooks("challenges", challengesApi);

export const {
  useList: useChallengeParticipation,
  useCreate: useCreateChallengeParticipation,
  useUpdate: useUpdateChallengeParticipation,
  useDelete: useDeleteChallengeParticipation,
} = createCrudHooks("challenge-participation", challengeParticipationApi);

// ─── Phase 5: Audits & Compliance ───────────────────────────
export const {
  useList: useAudits,
  useCreate: useCreateAudit,
  useUpdate: useUpdateAudit,
  useDelete: useDeleteAudit,
} = createCrudHooks("audits", auditsApi);

export const {
  useList: useComplianceIssues,
  useCreate: useCreateComplianceIssue,
  useUpdate: useUpdateComplianceIssue,
  useDelete: useDeleteComplianceIssue,
} = createCrudHooks("compliance-issues", complianceIssuesApi);
