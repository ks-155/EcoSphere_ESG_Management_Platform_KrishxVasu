import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateComplianceIssueDto } from './dto/create-compliance-issue.dto';
import { UpdateComplianceIssueDto } from './dto/update-compliance-issue.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class ComplianceIssuesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, page, limit, sortBy, sortOrder } = parseQuery(query);
    const { severity, status, auditId, ownerId } = query;

    const where: any = {};
    if (search) where.OR = [{ description: { contains: search } }];
    if (severity) where.severity = severity;
    if (status) where.status = status;
    if (auditId) where.auditId = auditId;
    if (ownerId) where.ownerId = ownerId;

    const total = await this.prisma.complianceIssue.count({ where });
    const orderBy: any = {};
    if (sortBy === 'dueDate') orderBy.dueDate = sortOrder;
    else if (sortBy === 'severity') orderBy.severity = sortOrder;
    else if (sortBy === 'status') orderBy.status = sortOrder;
    else orderBy.createdAt = sortOrder;

    const items = await this.prisma.complianceIssue.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { audit: true, owner: true },
    });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.complianceIssue.findUnique({
      where: { id },
      include: { audit: true, owner: true },
    });
    if (!item) throw new NotFoundException('Compliance Issue not found');

    const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'RESOLVED' && item.status !== 'CLOSED';
    if (isOverdue !== item.isOverdue) {
      return this.prisma.complianceIssue.update({
        where: { id },
        data: { isOverdue },
        include: { audit: true, owner: true },
      });
    }
    return item;
  }

  async create(dto: CreateComplianceIssueDto) {
    const isOverdue = dto.isOverdue ?? (new Date(dto.dueDate) < new Date() && (!dto.status || dto.status === 'OPEN' || dto.status === 'IN_PROGRESS'));
    return this.prisma.complianceIssue.create({ data: { ...dto as any, isOverdue } });
  }

  async update(id: string, dto: UpdateComplianceIssueDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.dueDate || dto.status) {
      const current = await this.prisma.complianceIssue.findUnique({ where: { id } });
      if (current) {
        const dueDate = dto.dueDate ? new Date(dto.dueDate) : current.dueDate;
        const status = dto.status || current.status;
        data.isOverdue = new Date(dueDate) < new Date() && status !== 'RESOLVED' && status !== 'CLOSED';
      }
    }
    return this.prisma.complianceIssue.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.complianceIssue.delete({ where: { id } });
  }
}
