import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalDepartments,
      totalUsers,
      carbonAgg,
      totalCSRActivities,
      totalChallenges,
      totalBadges,
      orgScore,
    ] = await Promise.all([
      this.prisma.department.count(),
      this.prisma.user.count(),
      this.prisma.carbonTransaction.aggregate({ _sum: { co2Amount: true } }),
      this.prisma.csrActivity.count(),
      this.prisma.challenge.count(),
      this.prisma.userBadge.count(),
      this.prisma.departmentScore.aggregate({ _avg: { totalScore: true } }),
    ]);

    return {
      totalDepartments,
      totalUsers,
      totalCarbon: carbonAgg._sum.co2Amount ?? 0,
      totalCSRActivities,
      totalChallenges,
      totalBadgesAwarded: totalBadges,
      overallESGScore: orgScore._avg.totalScore ?? 0,
    };
  }

  async getEnvironmentalDashboard(period?: { start?: string; end?: string }) {
    const where: any = {};
    if (period?.start || period?.end) {
      where.date = {};
      if (period.start) where.date.gte = new Date(period.start);
      if (period.end) where.date.lte = new Date(period.end);
    }

    const carbonByDepartment = await this.prisma.carbonTransaction.groupBy({
      by: ['departmentId'],
      where,
      _sum: { co2Amount: true },
      _count: true,
    });

    const depts = await this.prisma.department.findMany({ select: { id: true, name: true } });
    const deptMap = new Map(depts.map((d) => [d.id, d.name]));

    const carbonByDepartmentChart = carbonByDepartment.map((d) => ({
      departmentId: d.departmentId,
      departmentName: deptMap.get(d.departmentId) ?? 'Unknown',
      totalCO2: d._sum.co2Amount ?? 0,
      transactionCount: d._count,
    }));

    // Carbon trend: group by month
    const allTransactions = await this.prisma.carbonTransaction.findMany({
      where,
      select: { date: true, co2Amount: true },
      orderBy: { date: 'asc' },
    });

    const trendMap = new Map<string, number>();
    for (const t of allTransactions) {
      const key = t.date.toISOString().slice(0, 7);
      trendMap.set(key, (tMapGet(trendMap, key) ?? 0) + t.co2Amount);
    }
    const carbonTrend = Array.from(trendMap.entries()).map(([month, totalCO2]) => ({ month, totalCO2 }));

    const goals = await this.prisma.environmentalGoal.findMany({
      select: { id: true, name: true, targetValue: true, currentValue: true, status: true, deadline: true },
    });
    const goalsProgress = goals.map((g) => ({
      ...g,
      progressPercent: g.targetValue > 0 ? Math.min(100, (g.currentValue / g.targetValue) * 100) : 0,
    }));

    const emissionFactors = await this.prisma.emissionFactor.findMany({
      where: { status: true },
      select: { id: true, name: true, category: true, value: true, unit: true },
    });

    return {
      carbonByDepartment: carbonByDepartmentChart,
      carbonTrend,
      goalsProgress,
      emissionFactors,
    };
  }

  async getSocialDashboard() {
    const [totalCSR, approvedCSR, pendingCSR, rejectedCSR] = await Promise.all([
      this.prisma.employeeParticipation.count(),
      this.prisma.employeeParticipation.count({ where: { approvalStatus: 'APPROVED' } }),
      this.prisma.employeeParticipation.count({ where: { approvalStatus: 'PENDING' } }),
      this.prisma.employeeParticipation.count({ where: { approvalStatus: 'REJECTED' } }),
    ]);

    const totalChallenges = await this.prisma.challengeParticipation.count();
    const completedChallenges = await this.prisma.challengeParticipation.count({
      where: { approvalStatus: 'APPROVED' },
    });

    const topEmployees = await this.prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 10,
      select: { id: true, name: true, email: true, xp: true, departmentId: true },
    });

    // Participation trend: CSR by month
    const allCSR = await this.prisma.employeeParticipation.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    const csrTrendMap = new Map<string, number>();
    for (const p of allCSR) {
      const key = p.createdAt.toISOString().slice(0, 7);
      csrTrendMap.set(key, (tMapGet(csrTrendMap, key) ?? 0) + 1);
    }
    const participationTrend = Array.from(csrTrendMap.entries()).map(([month, count]) => ({ month, count }));

    return {
      csrParticipationStats: { total: totalCSR, approved: approvedCSR, pending: pendingCSR, rejected: rejectedCSR },
      challengeCompletionStats: { total: totalChallenges, completed: completedChallenges },
      topEmployees,
      participationTrend,
    };
  }

  async getGovernanceDashboard() {
    const activePolicies = await this.prisma.esgPolicy.count({ where: { status: 'ACTIVE' } });
    const totalAcks = await this.prisma.policyAcknowledgement.count({ where: { accepted: true } });
    const totalEmployees = await this.prisma.user.count();

    const policyAcknowledgementRate =
      activePolicies > 0 && totalEmployees > 0
        ? Math.min(100, (totalAcks / (activePolicies * totalEmployees)) * 100)
        : 0;

    const auditStatusBreakdown = await this.prisma.audit.groupBy({
      by: ['status'],
      _count: true,
    });

    const complianceBySeverity = await this.prisma.complianceIssue.groupBy({
      by: ['severity'],
      _count: true,
    });

    const issuesByStatus = await this.prisma.complianceIssue.groupBy({
      by: ['status'],
      _count: true,
    });

    // Compliance trend: issues resolved by month
    const resolvedIssues = await this.prisma.complianceIssue.findMany({
      where: { status: { in: ['RESOLVED', 'CLOSED'] } },
      select: { updatedAt: true },
      orderBy: { updatedAt: 'asc' },
    });
    const trendMap = new Map<string, number>();
    for (const issue of resolvedIssues) {
      const key = issue.updatedAt.toISOString().slice(0, 7);
      trendMap.set(key, (tMapGet(trendMap, key) ?? 0) + 1);
    }
    const complianceTrend = Array.from(trendMap.entries()).map(([month, resolvedCount]) => ({
      month,
      resolvedCount,
    }));

    return {
      policyAcknowledgementRate,
      auditStatusBreakdown,
      complianceIssuesBySeverity: complianceBySeverity,
      issuesByStatus,
      complianceTrend,
    };
  }

  async getScores() {
    const scores = await this.prisma.departmentScore.findMany({
      include: { department: { select: { id: true, name: true, code: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const orgResult = await this.prisma.departmentScore.aggregate({
      _avg: { totalScore: true },
    });

    const trendMap = new Map<string, number[]>();
    for (const s of scores) {
      const key = s.periodStart.toISOString().slice(0, 7);
      const arr = trendMap.get(key) ?? [];
      arr.push(s.totalScore);
      trendMap.set(key, arr);
    }
    const scoreTrend = Array.from(trendMap.entries()).map(([month, scores]) => ({
      month,
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    }));

    return {
      departmentScores: scores,
      overallScore: orgResult._avg.totalScore ?? 0,
      scoreTrend,
    };
  }

  async getLeaderboard(limit: number = 10) {
    const employees = await this.prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: limit,
      select: { id: true, name: true, email: true, xp: true, departmentId: true, avatar: true },
    });

    const leaderboard = await Promise.all(
      employees.map(async (emp, index) => {
        const badgeCount = await this.prisma.userBadge.count({ where: { userId: emp.id } });
        return {
          rank: index + 1,
          ...emp,
          badgeCount,
        };
      }),
    );

    return leaderboard;
  }
}

function tMapGet<K, V>(map: Map<K, V>, key: K): V | undefined {
  return map.get(key);
}
