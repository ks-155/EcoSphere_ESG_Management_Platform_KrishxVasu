import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentScoreDto } from './dto/create-department-score.dto';
import { UpdateDepartmentScoreDto } from './dto/update-department-score.dto';
import { CalculateScoreDto } from './dto/calculate-score.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class DepartmentScoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, page, limit, sortBy, sortOrder } = parseQuery(query);
    const { departmentId, periodStart, periodEnd } = query;

    const where: any = {};
    if (search) {
      where.OR = [
        { department: { name: { contains: search } } },
        { department: { code: { contains: search } } },
      ];
    }
    if (departmentId) where.departmentId = departmentId;
    if (periodStart || periodEnd) {
      where.periodStart = {};
      if (periodStart) where.periodStart.gte = new Date(periodStart);
      if (periodEnd) where.periodStart.lte = new Date(periodEnd);
    }

    const total = await this.prisma.departmentScore.count({ where });
    const orderBy: any = {};
    if (sortBy === 'totalScore') orderBy.totalScore = sortOrder;
    else if (sortBy === 'environmentalScore') orderBy.environmentalScore = sortOrder;
    else if (sortBy === 'socialScore') orderBy.socialScore = sortOrder;
    else if (sortBy === 'governanceScore') orderBy.governanceScore = sortOrder;
    else if (sortBy === 'periodStart') orderBy.periodStart = sortOrder;
    else orderBy.createdAt = sortOrder;

    const items = await this.prisma.departmentScore.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { department: true },
    });

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.departmentScore.findUnique({
      where: { id },
      include: { department: true },
    });
    if (!item) throw new NotFoundException('Department score not found');
    return item;
  }

  async create(dto: CreateDepartmentScoreDto) {
    const dept = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
    if (!dept) throw new NotFoundException('Department not found');

    return this.prisma.departmentScore.create({
      data: {
        departmentId: dto.departmentId,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        environmentalScore: dto.environmentalScore ?? 0,
        socialScore: dto.socialScore ?? 0,
        governanceScore: dto.governanceScore ?? 0,
        totalScore: dto.totalScore ?? 0,
      },
      include: { department: true },
    });
  }

  async update(id: string, dto: UpdateDepartmentScoreDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.periodStart) data.periodStart = new Date(dto.periodStart);
    if (dto.periodEnd) data.periodEnd = new Date(dto.periodEnd);
    return this.prisma.departmentScore.update({
      where: { id },
      data,
      include: { department: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.departmentScore.delete({ where: { id } });
  }

  async calculateScore(dto: CalculateScoreDto) {
    const dept = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
    if (!dept) throw new NotFoundException('Department not found');

    const org = await this.prisma.organization.findFirst();
    if (!org) throw new BadRequestException('Organization not configured');

    const periodStart = new Date(dto.periodStart);
    const periodEnd = new Date(dto.periodEnd);

    // === ENVIRONMENTAL SCORE ===
    // Carbon score: compare total CO2 in current period vs previous period (less = better)
    const currentCarbon = await this.prisma.carbonTransaction.aggregate({
      where: { departmentId: dto.departmentId, date: { gte: periodStart, lte: periodEnd } },
      _sum: { co2Amount: true },
    });

    const prevPeriodLength = periodEnd.getTime() - periodStart.getTime();
    const prevStart = new Date(periodStart.getTime() - prevPeriodLength);
    const prevEnd = new Date(periodStart.getTime() - 1);

    const prevCarbon = await this.prisma.carbonTransaction.aggregate({
      where: { departmentId: dto.departmentId, date: { gte: prevStart, lte: prevEnd } },
      _sum: { co2Amount: true },
    });

    const currentCO2 = currentCarbon._sum.co2Amount ?? 0;
    const prevCO2 = prevCarbon._sum.co2Amount ?? 0;

    let carbonScore = 100;
    if (prevCO2 > 0) {
      const reduction = ((prevCO2 - currentCO2) / prevCO2) * 100;
      carbonScore = Math.max(0, Math.min(100, reduction));
    } else if (currentCO2 > 0) {
      carbonScore = 0;
    }

    // Goals score: count achieved goals (each = +20, max 100)
    const achievedGoals = await this.prisma.environmentalGoal.count({
      where: {
        departmentId: dto.departmentId,
        status: 'ACHIEVED',
        deadline: { gte: periodStart, lte: periodEnd },
      },
    });
    const goalsScore = Math.min(100, achievedGoals * 20);

    const environmentalScore = (carbonScore + goalsScore) / 2;

    // === SOCIAL SCORE ===
    // Approved CSR participations (each = +10, max 100)
    const deptEmployeeIds = (
      await this.prisma.user.findMany({
        where: { departmentId: dto.departmentId },
        select: { id: true },
      })
    ).map((u) => u.id);

    const approvedCSR = await this.prisma.employeeParticipation.count({
      where: {
        employeeId: { in: deptEmployeeIds },
        approvalStatus: 'APPROVED',
        createdAt: { gte: periodStart, lte: periodEnd },
      },
    });
    const csrScore = Math.min(100, approvedCSR * 10);

    // Challenge completions (each = +15, max 100)
    const completedChallenges = await this.prisma.challengeParticipation.count({
      where: {
        employeeId: { in: deptEmployeeIds },
        approvalStatus: 'APPROVED',
        createdAt: { gte: periodStart, lte: periodEnd },
      },
    });
    const challengeScore = Math.min(100, completedChallenges * 15);

    const socialScore = (csrScore + challengeScore) / 2;

    // === GOVERNANCE SCORE ===
    // Policy acknowledgement rate: % of active policies acknowledged by dept employees
    const activePolicies = await this.prisma.esgPolicy.count({
      where: { status: 'ACTIVE' },
    });

    let policyAckRate = 0;
    if (activePolicies > 0 && deptEmployeeIds.length > 0) {
      const ackCount = await this.prisma.policyAcknowledgement.count({
        where: {
          employeeId: { in: deptEmployeeIds },
          policy: { status: 'ACTIVE' },
          acceptedAt: { gte: periodStart, lte: periodEnd },
        },
      });
      policyAckRate = Math.min(100, (ackCount / (activePolicies * deptEmployeeIds.length)) * 100);
    }

    // Audit compliance rate: % of issues resolved in dept
    const deptIssues = await this.prisma.complianceIssue.count({
      where: {
        ownerId: { in: deptEmployeeIds },
        createdAt: { gte: periodStart, lte: periodEnd },
      },
    });

    let complianceRate = 0;
    if (deptIssues > 0) {
      const resolvedIssues = await this.prisma.complianceIssue.count({
        where: {
          ownerId: { in: deptEmployeeIds },
          status: { in: ['RESOLVED', 'CLOSED'] },
          createdAt: { gte: periodStart, lte: periodEnd },
        },
      });
      complianceRate = (resolvedIssues / deptIssues) * 100;
    }

    const governanceScore = (policyAckRate + complianceRate) / 2;

    // === TOTAL SCORE ===
    const totalScore =
      (environmentalScore * org.esgWeightE +
        socialScore * org.esgWeightS +
        governanceScore * org.esgWeightG) /
      100;

    // Upsert
    const existing = await this.prisma.departmentScore.findFirst({
      where: {
        departmentId: dto.departmentId,
        periodStart,
        periodEnd,
      },
    });

    if (existing) {
      return this.prisma.departmentScore.update({
        where: { id: existing.id },
        data: {
          environmentalScore,
          socialScore,
          governanceScore,
          totalScore,
        },
        include: { department: true },
      });
    }

    return this.prisma.departmentScore.create({
      data: {
        departmentId: dto.departmentId,
        periodStart,
        periodEnd,
        environmentalScore,
        socialScore,
        governanceScore,
        totalScore,
      },
      include: { department: true },
    });
  }

  async getOrgScore() {
    const result = await this.prisma.departmentScore.aggregate({
      _avg: { totalScore: true },
    });
    return { overallScore: result._avg.totalScore ?? 0 };
  }
}
