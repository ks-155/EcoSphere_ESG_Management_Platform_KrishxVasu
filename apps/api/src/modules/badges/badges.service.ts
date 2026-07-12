import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, status, page, limit, sortBy, sortOrder } = parseQuery(query);
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
    if (status !== undefined && status !== '') where.status = status === 'true';

    const total = await this.prisma.badge.count({ where });
    const orderBy: any = {};
    if (sortBy === 'category') orderBy.category = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.name = sortOrder;

    const items = await this.prisma.badge.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.badge.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Badge not found');
    return item;
  }

  async create(dto: CreateBadgeDto) {
    return this.prisma.badge.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateBadgeDto) {
    await this.findOne(id);
    return this.prisma.badge.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.badge.delete({ where: { id } });
  }
}
