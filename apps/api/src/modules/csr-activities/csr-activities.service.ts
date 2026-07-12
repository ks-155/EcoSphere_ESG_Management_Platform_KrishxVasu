import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCsrActivityDto } from './dto/create-csr-activity.dto';
import { UpdateCsrActivityDto } from './dto/update-csr-activity.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class CsrActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, page, limit, sortBy, sortOrder } = parseQuery(query);
    const { categoryId, status } = query;

    const where: any = {};
    if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
    if (categoryId) where.categoryId = categoryId;
    if (status !== undefined && status !== '') where.status = status === 'true';

    const total = await this.prisma.csrActivity.count({ where });
    const orderBy: any = {};
    if (sortBy === 'date') orderBy.date = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.title = sortOrder;

    const items = await this.prisma.csrActivity.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true },
    });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.csrActivity.findUnique({
      where: { id },
      include: { category: true, _count: { select: { participations: true } } },
    });
    if (!item) throw new NotFoundException('CSR Activity not found');
    return item;
  }

  async create(dto: CreateCsrActivityDto) {
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    else data.date = new Date();
    if (!dto.categoryId) {
      const cat = await this.prisma.category.findFirst({ where: { type: 'CSR_ACTIVITY' } });
      if (cat) data.categoryId = cat.id;
    }
    return this.prisma.csrActivity.create({ data });
  }

  async update(id: string, dto: UpdateCsrActivityDto) {
    await this.findOne(id);
    return this.prisma.csrActivity.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.csrActivity.delete({ where: { id } });
  }
}
