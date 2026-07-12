// Master data models — Person B's Prisma schema + API must return these shapes

export interface Department {
  id: string;
  name: string;
  description?: string;
  code: string;
  status: boolean;
  headName?: string;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  type: "CSR_ACTIVITY" | "CHALLENGE";
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EmissionUnit = "KG" | "TONNE" | "LITER" | "KWH" | "MWH";

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  value: number;
  unit: EmissionUnit;
  source?: string;
  validFrom: string;
  validTo?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = "ELECTRONICS" | "FOOD" | "TEXTILE" | "PACKAGING" | "CHEMICAL" | "OTHER";

export interface ProductProfile {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  carbonFootprint?: number;
  waterUsage?: number;
  recyclable: boolean;
  complianceStatus: "COMPLIANT" | "NON_COMPLIANT" | "PENDING";
  description?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GoalType = "ENVIRONMENTAL" | "SOCIAL" | "GOVERNANCE";
export type GoalStatus = "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED" | "CANCELLED";
export type GoalTimeframe = "QUARTERLY" | "ANNUAL" | "MULTI_YEAR";

export interface Goal {
  id: string;
  name: string;
  description?: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: GoalStatus;
  departmentId?: string;
  timeframe: GoalTimeframe;
  createdAt: string;
  updatedAt: string;
}

export type PolicyCategory = "ENVIRONMENTAL" | "SOCIAL" | "GOVERNANCE" | "GENERAL";
export type PolicyStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface Policy {
  id: string;
  title: string;
  description?: string;
  category: PolicyCategory;
  content: string;
  version: string;
  status: PolicyStatus;
  effectiveDate: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export type BadgeCategory = "ENVIRONMENTAL" | "SOCIAL" | "GOVERNANCE" | "GENERAL";
export type UnlockType = "XP_THRESHOLD" | "CHALLENGE_COUNT" | "MANUAL";

export interface Badge {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  category: BadgeCategory;
  unlockType: UnlockType;
  unlockValue: number;
  xpReward: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  pointCost: number;
  stock: number;
  category: BadgeCategory;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Phase 3: Carbon Management ──────────────────────────────

export interface CarbonTransaction {
  id: string;
  date: string;
  sourceType: string;
  sourceId?: string;
  quantity: number;
  emissionFactorId?: string;
  co2Amount: number;
  departmentId: string;
  notes?: string;
  isManual: boolean;
  createdAt: string;
}

// ─── Phase 4: CSR & Challenges ───────────────────────────────

export interface CsrActivity {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  date: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EmployeeParticipation {
  id: string;
  employeeId: string;
  csrActivityId: string;
  proofUrl?: string;
  approvalStatus: ApprovalStatus;
  pointsEarned: number;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  xp: number;
  difficulty: Difficulty;
  evidenceRequired: boolean;
  deadline?: string;
  status: ChallengeStatus;
  createdAt: string;
  updatedAt: string;
}

export type ChallengeStatus = "DRAFT" | "ACTIVE" | "UNDER_REVIEW" | "COMPLETED" | "ARCHIVED";

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  employeeId: string;
  progress: number;
  evidenceUrl?: string;
  approvalStatus: ApprovalStatus;
  xpAwarded: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Phase 5: Audits & Compliance ────────────────────────────

export type AuditStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

export interface Audit {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: AuditStatus;
  createdAt: string;
  updatedAt: string;
}

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface ComplianceIssue {
  id: string;
  auditId?: string;
  severity: Severity;
  description: string;
  ownerId: string;
  dueDate: string;
  status: IssueStatus;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Person B's New Modules ─────────────────────────────────

export interface DepartmentScore {
  id: string;
  departmentId: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  totalScore: number;
  periodStart: string;
  periodEnd: string;
  department?: Department;
  createdAt: string;
}

export type NotificationType = "COMPLIANCE_ISSUE" | "CSR_APPROVAL" | "CHALLENGE_APPROVAL" | "POLICY_REMINDER" | "BADGE_UNLOCK" | "REWARD_REDEEMED";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PolicyAcknowledgement {
  id: string;
  policyId: string;
  employeeId: string;
  accepted: boolean;
  acceptedAt: string;
  policy?: Policy;
  employee?: { id: string; name: string; email: string };
}

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  pointsSpent: number;
  redeemedAt: string;
  user?: { id: string; name: string; email: string };
  reward?: Reward;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: string;
  user?: { id: string; name: string; email: string };
  badge?: Badge;
}

// ─── Dashboard types ────────────────────────────────────────

export interface DashboardOverview {
  totalDepartments: number;
  totalUsers: number;
  totalCarbon: number;
  totalCSRActivities: number;
  totalChallenges: number;
  totalBadgesAwarded: number;
  overallESGScore: number;
}

export interface EnvironmentalDashboard {
  carbonByDepartment: Array<{ departmentId: string; departmentName: string; totalCO2: number; transactionCount: number }>;
  carbonTrend: Array<{ month: string; totalCO2: number }>;
  goalsProgress: Array<{ id: string; name: string; targetValue: number; currentValue: number; status: string; deadline: string; progressPercent: number }>;
}

export interface SocialDashboard {
  csrParticipationStats: { total: number; approved: number; pending: number; rejected: number };
  challengeCompletionStats: { total: number; completed: number };
  topEmployees: Array<{ id: string; name: string; email: string; xp: number }>;
  participationTrend: Array<{ month: string; count: number }>;
}

export interface GovernanceDashboard {
  policyAcknowledgementRate: number;
  auditStatusBreakdown: Array<{ status: string; _count: number }>;
  complianceIssuesBySeverity: Array<{ severity: string; _count: number }>;
  issuesByStatus: Array<{ status: string; _count: number }>;
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

export interface ChallengeLeaderboardEntry {
  rank: number;
  employeeId: string;
  employee: { id: string; name: string; email: string };
  totalXp: number;
}
