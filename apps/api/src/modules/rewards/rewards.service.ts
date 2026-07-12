import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, status, page, limit, sortBy, sortOrder } = parseQuery(query);
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
    if (status !== undefined && status !== '') where.status = status === 'true';

    const total = await this.prisma.reward.count({ where });
    const orderBy: any = {};
    if (sortBy === 'pointCost') orderBy.pointCost = sortOrder;
    else if (sortBy === 'stock') orderBy.stock = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.name = sortOrder;

    const items = await this.prisma.reward.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.reward.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Reward not found');
    return item;
  }

  async create(dto: CreateRewardDto) {
    return this.prisma.reward.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateRewardDto) {
    await this.findOne(id);
    return this.prisma.reward.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.reward.delete({ where: { id } });
  }
}
