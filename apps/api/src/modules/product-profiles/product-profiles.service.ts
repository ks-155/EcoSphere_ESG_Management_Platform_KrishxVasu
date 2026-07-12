import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductProfileDto } from './dto/create-product-profile.dto';
import { UpdateProductProfileDto } from './dto/update-product-profile.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class ProductProfilesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, status, page, limit, sortBy, sortOrder } = parseQuery(query);
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search } }, { sku: { contains: search } }, { description: { contains: search } }];
    if (status !== undefined && status !== '') where.status = status === 'true';

    const total = await this.prisma.productProfile.count({ where });
    const orderBy: any = {};
    if (sortBy === 'sku') orderBy.sku = sortOrder;
    else if (sortBy === 'category') orderBy.category = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.name = sortOrder;

    const items = await this.prisma.productProfile.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.productProfile.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('ProductProfile not found');
    return item;
  }

  async create(dto: CreateProductProfileDto) {
    return this.prisma.productProfile.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateProductProfileDto) {
    await this.findOne(id);
    return this.prisma.productProfile.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productProfile.delete({ where: { id } });
  }
}
