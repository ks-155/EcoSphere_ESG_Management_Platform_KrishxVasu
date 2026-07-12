import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeParticipationDto } from './dto/create-employee-participation.dto';
import { UpdateEmployeeParticipationDto } from './dto/update-employee-participation.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';
import { ApprovalStatus } from '@prisma/client';

@Injectable()
export class EmployeeParticipationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, page, limit, sortBy, sortOrder } = parseQuery(query);
    const { employeeId, csrActivityId, approvalStatus } = query;

    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (csrActivityId) where.csrActivityId = csrActivityId;
    if (approvalStatus) where.approvalStatus = approvalStatus;

    const total = await this.prisma.employeeParticipation.count({ where });
    const orderBy: any = {};
    if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else if (sortBy === 'pointsEarned') orderBy.pointsEarned = sortOrder;
    else orderBy.createdAt = sortOrder;

    const items = await this.prisma.employeeParticipation.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { employee: true, csrActivity: true },
    });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.employeeParticipation.findUnique({
      where: { id },
      include: { employee: true, csrActivity: true },
    });
    if (!item) throw new NotFoundException('Employee Participation not found');
    return item;
  }

  async create(dto: CreateEmployeeParticipationDto) {
    return this.prisma.employeeParticipation.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateEmployeeParticipationDto) {
    await this.findOne(id);
    return this.prisma.employeeParticipation.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.employeeParticipation.delete({ where: { id } });
  }

  async approve(id: string) {
    const participation = await this.findOne(id);

    if (participation.approvalStatus === ApprovalStatus.APPROVED) {
      throw new ConflictException('Participation already approved');
    }

    const updated = await this.prisma.employeeParticipation.update({
      where: { id },
      data: { approvalStatus: ApprovalStatus.APPROVED },
      include: { employee: true, csrActivity: true },
    });

    await this.prisma.user.update({
      where: { id: updated.employeeId },
      data: { xp: { increment: updated.pointsEarned } },
    });

    await this.prisma.notification.create({
      data: {
        userId: updated.employeeId,
        type: 'CSR_APPROVAL',
        title: 'CSR Activity Approved',
        message: `Your participation in "${updated.csrActivity.title}" has been approved. ${updated.pointsEarned} points awarded.`,
      },
    });

    return updated;
  }

  async reject(id: string) {
    const participation = await this.findOne(id);

    if (participation.approvalStatus === ApprovalStatus.REJECTED) {
      throw new ConflictException('Participation already rejected');
    }

    return this.prisma.employeeParticipation.update({
      where: { id },
      data: { approvalStatus: ApprovalStatus.REJECTED },
      include: { employee: true, csrActivity: true },
    });
  }
}
