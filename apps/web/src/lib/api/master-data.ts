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
} from "@/types/master-data";

// ─── Generic CRUD factory ─────────────────────────────────────
function createCrudApi<T>(basePath: string) {
  return {
    list: (params?: QueryParams) =>
      apiClient
        .get<PaginatedResponse<T>>(basePath, { params })
        .then((r) => r.data),

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

// ─── Resource APIs ─────────────────────────────────────────────
export const departmentsApi = createCrudApi<Department>("/api/departments");
export const categoriesApi = createCrudApi<Category>("/api/categories");
export const emissionFactorsApi = createCrudApi<EmissionFactor>("/api/emission-factors");
export const productProfilesApi = createCrudApi<ProductProfile>("/api/product-profiles");
export const goalsApi = createCrudApi<Goal>("/api/goals");
export const policiesApi = createCrudApi<Policy>("/api/policies");
export const badgesApi = createCrudApi<Badge>("/api/badges");
export const rewardsApi = createCrudApi<Reward>("/api/rewards");

// ─── Phase 3: Carbon Management ─────────────────────────────
export const carbonTransactionsApi = createCrudApi<CarbonTransaction>("/api/carbon-transactions");

// ─── Phase 4: CSR & Challenges ──────────────────────────────
export const csrActivitiesApi = createCrudApi<CsrActivity>("/api/csr-activities");
export const employeeParticipationApi = createCrudApi<EmployeeParticipation>("/api/employee-participation");
export const challengesApi = createCrudApi<Challenge>("/api/challenges");
export const challengeParticipationApi = createCrudApi<ChallengeParticipation>("/api/challenge-participation");

// ─── Phase 5: Audits & Compliance ───────────────────────────
export const auditsApi = createCrudApi<Audit>("/api/audits");
export const complianceIssuesApi = createCrudApi<ComplianceIssue>("/api/compliance-issues");
