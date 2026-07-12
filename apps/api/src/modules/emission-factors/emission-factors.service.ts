import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmissionFactorDto } from './dto/create-emission-factor.dto';
import { UpdateEmissionFactorDto } from './dto/update-emission-factor.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class EmissionFactorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, status, page, limit, sortBy, sortOrder } = parseQuery(query);
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search } }, { category: { contains: search } }];
    if (status !== undefined && status !== '') where.status = status === 'true';

    const total = await this.prisma.emissionFactor.count({ where });
    const orderBy: any = {};
    if (sortBy === 'category') orderBy.category = sortOrder;
    else if (sortBy === 'value') orderBy.value = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.name = sortOrder;

    const items = await this.prisma.emissionFactor.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.emissionFactor.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('EmissionFactor not found');
    return item;
  }

  async create(dto: CreateEmissionFactorDto) {
    return this.prisma.emissionFactor.create({ data: { ...dto, unit: dto.unit as any, validFrom: new Date(dto.validFrom), validTo: dto.validTo ? new Date(dto.validTo) : null } });
  }

  async update(id: string, dto: UpdateEmissionFactorDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.validFrom) data.validFrom = new Date(dto.validFrom);
    if (dto.validTo !== undefined) data.validTo = dto.validTo ? new Date(dto.validTo) : null;
    return this.prisma.emissionFactor.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.emissionFactor.delete({ where: { id } });
  }
}
