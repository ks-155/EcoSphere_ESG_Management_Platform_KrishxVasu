import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class PoliciesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, status, page, limit, sortBy, sortOrder } = parseQuery(query);
    const where: any = {};
    if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
    if (status !== undefined && status !== '') where.status = status;

    const total = await this.prisma.esgPolicy.count({ where });
    const orderBy: any = {};
    if (sortBy === 'category') orderBy.category = sortOrder;
    else if (sortBy === 'effectiveDate') orderBy.effectiveDate = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.title = sortOrder;

    const items = await this.prisma.esgPolicy.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.esgPolicy.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Policy not found');
    return item;
  }

  async create(dto: CreatePolicyDto) {
    return this.prisma.esgPolicy.create({
      data: {
        ...dto,
        category: dto.category ?? 'GENERAL',
        status: dto.status ?? 'DRAFT',
        effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : new Date(),
      } as any,
    });
  }

  async update(id: string, dto: UpdatePolicyDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.effectiveDate) data.effectiveDate = new Date(dto.effectiveDate);
    return this.prisma.esgPolicy.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.esgPolicy.delete({ where: { id } });
  }
}
