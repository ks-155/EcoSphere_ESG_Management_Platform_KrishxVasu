import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateReportDto, ReportModule } from './dto/generate-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generate(dto: GenerateReportDto) {
    const { departmentId, startDate, endDate, module, employeeId } = dto;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const dateFilter: any = {};
    if (start || end) {
      if (start) dateFilter.gte = start;
      if (end) dateFilter.lte = end;
    }

    const result: any = { generatedAt: new Date().toISOString(), filters: dto, sections: [] };

    if (!module || module === ReportModule.ALL || module === ReportModule.CARBON) {
      const where: any = {};
      if (departmentId) where.departmentId = departmentId;
      if (start || end) where.date = dateFilter;

      const transactions = await this.prisma.carbonTransaction.findMany({
        where,
        include: { department: { select: { name: true } }, emissionFactor: { select: { name: true } } },
        orderBy: { date: 'desc' },
      });

      const totalCO2 = transactions.reduce((sum, t) => sum + t.co2Amount, 0);
      const byDepartment = await this.prisma.carbonTransaction.groupBy({
        by: ['departmentId'],
        where,
        _sum: { co2Amount: true },
        _count: true,
      });

      result.sections.push({
        name: 'Carbon Emissions',
        summary: { totalTransactions: transactions.length, totalCO2, departmentCount: byDepartment.length },
        breakdown: byDepartment.map((d) => ({ departmentId: d.departmentId, totalCO2: d._sum.co2Amount ?? 0, count: d._count })),
        records: transactions.slice(0, 200),
      });
    }

    if (!module || module === ReportModule.ALL || module === ReportModule.CSR) {
      const where: any = {};
      if (employeeId) where.employeeId = employeeId;

      const participations = await this.prisma.employeeParticipation.findMany({
        where,
        include: { employee: { select: { name: true } }, csrActivity: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
      });

      const byStatus = await this.prisma.employeeParticipation.groupBy({
        by: ['approvalStatus'],
        _count: true,
      });

      result.sections.push({
        name: 'CSR Participation',
        summary: {
          total: participations.length,
          approved: byStatus.find((s) => s.approvalStatus === 'APPROVED')?._count ?? 0,
          pending: byStatus.find((s) => s.approvalStatus === 'PENDING')?._count ?? 0,
          rejected: byStatus.find((s) => s.approvalStatus === 'REJECTED')?._count ?? 0,
        },
        breakdown: byStatus.map((s) => ({ status: s.approvalStatus, count: s._count })),
        records: participations.slice(0, 200),
      });
    }

    if (!module || module === ReportModule.ALL || module === ReportModule.CHALLENGES) {
      const where: any = {};
      if (employeeId) where.employeeId = employeeId;

      const participations = await this.prisma.challengeParticipation.findMany({
        where,
        include: { challenge: { select: { title: true, xp: true } }, employee: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      });

      const totalXpAwarded = participations
        .filter((p) => p.approvalStatus === 'APPROVED')
        .reduce((sum, p) => sum + p.xpAwarded, 0);

      result.sections.push({
        name: 'Challenge Completions',
        summary: { total: participations.length, totalXpAwarded },
        records: participations.slice(0, 200),
      });
    }

    if (!module || module === ReportModule.ALL || module === ReportModule.AUDITS) {
      const audits = await this.prisma.audit.findMany({ orderBy: { date: 'desc' } });
      const byStatus = await this.prisma.audit.groupBy({ by: ['status'], _count: true });

      result.sections.push({
        name: 'Audits',
        summary: { total: audits.length },
        breakdown: byStatus.map((s) => ({ status: s.status, count: s._count })),
        records: audits.slice(0, 200),
      });
    }

    if (!module || module === ReportModule.ALL || module === ReportModule.COMPLIANCE) {
      const issues = await this.prisma.complianceIssue.findMany({
        include: { audit: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
      });

      const bySeverity = await this.prisma.complianceIssue.groupBy({ by: ['severity'], _count: true });
      const overdue = issues.filter((i) => !i.isOverdue === false || new Date(i.dueDate) < new Date()).length;

      result.sections.push({
        name: 'Compliance Issues',
        summary: { total: issues.length, overdue },
        breakdown: bySeverity.map((s) => ({ severity: s.severity, count: s._count })),
        records: issues.slice(0, 200),
      });
    }

    if (!module || module === ReportModule.ALL || module === ReportModule.GAMIFICATION) {
      const topEmployees = await this.prisma.user.findMany({
        orderBy: { xp: 'desc' },
        take: 50,
        select: { id: true, name: true, email: true, xp: true, departmentId: true },
      });

      const badgeCounts = await Promise.all(
        topEmployees.map(async (emp) => ({
          ...emp,
          badges: await this.prisma.userBadge.count({ where: { userId: emp.id } }),
        })),
      );

      result.sections.push({
        name: 'Gamification Leaderboard',
        summary: { totalEmployees: topEmployees.length },
        records: badgeCounts,
      });
    }

    return result;
  }
}
