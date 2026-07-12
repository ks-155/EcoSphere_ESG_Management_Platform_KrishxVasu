import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class AuditsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, page, limit, sortBy, sortOrder } = parseQuery(query);
    const { status } = query;

    const where: any = {};
    if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
    if (status) where.status = status;

    const total = await this.prisma.audit.count({ where });
    const orderBy: any = {};
    if (sortBy === 'date') orderBy.date = sortOrder;
    else if (sortBy === 'status') orderBy.status = sortOrder;
    else orderBy.createdAt = sortOrder;

    const items = await this.prisma.audit.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { issues: true } } },
    });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.audit.findUnique({
      where: { id },
      include: { _count: { select: { issues: true } } },
    });
    if (!item) throw new NotFoundException('Audit not found');
    return item;
  }

  async create(dto: CreateAuditDto) {
    return this.prisma.audit.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateAuditDto) {
    await this.findOne(id);
    return this.prisma.audit.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.audit.delete({ where: { id } });
  }
}
