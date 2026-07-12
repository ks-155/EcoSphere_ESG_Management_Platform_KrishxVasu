import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, status, page, limit, sortBy, sortOrder } = parseQuery(query);
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
    if (status !== undefined && status !== '') where.status = status;

    const total = await this.prisma.environmentalGoal.count({ where });
    const orderBy: any = {};
    if (sortBy === 'deadline') orderBy.deadline = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.name = sortOrder;

    const items = await this.prisma.environmentalGoal.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.environmentalGoal.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Goal not found');
    return item;
  }

  async create(dto: CreateGoalDto) {
    return this.prisma.environmentalGoal.create({
      data: {
        ...dto,
        deadline: dto.deadline ? new Date(dto.deadline) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        currentValue: dto.currentValue ?? 0,
        status: dto.status ?? 'NOT_STARTED',
        timeframe: dto.timeframe ?? 'ANNUAL',
      } as any,
    });
  }

  async update(id: string, dto: UpdateGoalDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.deadline) data.deadline = new Date(dto.deadline);
    return this.prisma.environmentalGoal.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.environmentalGoal.delete({ where: { id } });
  }
}
