import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarbonTransactionDto } from './dto/create-carbon-transaction.dto';
import { UpdateCarbonTransactionDto } from './dto/update-carbon-transaction.dto';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class CarbonTransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { search, page, limit, sortBy, sortOrder, departmentId, startDate, endDate } = { ...parseQuery(query), departmentId: query.departmentId, startDate: query.startDate, endDate: query.endDate };

    const where: any = {};
    if (search) where.OR = [{ sourceType: { contains: search } }, { notes: { contains: search } }];
    if (departmentId) where.departmentId = departmentId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const total = await this.prisma.carbonTransaction.count({ where });
    const orderBy: any = {};
    if (sortBy === 'co2Amount') orderBy.co2Amount = sortOrder;
    else if (sortBy === 'date') orderBy.date = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.date = sortOrder;

    const items = await this.prisma.carbonTransaction.findMany({
      where, orderBy, skip: (page - 1) * limit, take: limit,
      include: { department: { select: { id: true, name: true, code: true } }, emissionFactor: { select: { id: true, name: true, value: true, unit: true } } },
    });

    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.carbonTransaction.findUnique({
      where: { id },
      include: { department: { select: { id: true, name: true, code: true } }, emissionFactor: true },
    });
    if (!item) throw new NotFoundException('Carbon transaction not found');
    return item;
  }

  async create(dto: CreateCarbonTransactionDto) {
    let co2Amount = dto.co2Amount ?? 0;
    if (dto.emissionFactorId && !dto.co2Amount) {
      const ef = await this.prisma.emissionFactor.findUnique({ where: { id: dto.emissionFactorId } });
      if (ef) co2Amount = dto.quantity * ef.value;
    }
    return this.prisma.carbonTransaction.create({
      data: { ...dto, date: dto.date ? new Date(dto.date) : new Date(), co2Amount } as any,
    });
  }

  async update(id: string, dto: UpdateCarbonTransactionDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    if (dto.emissionFactorId && dto.quantity) {
      const ef = await this.prisma.emissionFactor.findUnique({ where: { id: dto.emissionFactorId } });
      if (ef) data.co2Amount = dto.quantity * ef.value;
    }
    return this.prisma.carbonTransaction.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.carbonTransaction.delete({ where: { id } });
  }

  async getStats(query: any) {
    const { departmentId, startDate, endDate } = query;
    const where: any = {};
    if (departmentId) where.departmentId = departmentId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [totalCo2, count, byDepartment] = await Promise.all([
      this.prisma.carbonTransaction.aggregate({ where, _sum: { co2Amount: true }, _avg: { co2Amount: true } }),
      this.prisma.carbonTransaction.count({ where }),
      this.prisma.carbonTransaction.groupBy({ by: ['departmentId'], where, _sum: { co2Amount: true }, _count: true }),
    ]);

    return {
      totalCo2: totalCo2._sum.co2Amount || 0,
      avgPerTransaction: totalCo2._avg.co2Amount || 0,
      count,
      byDepartment,
    };
  }
}
