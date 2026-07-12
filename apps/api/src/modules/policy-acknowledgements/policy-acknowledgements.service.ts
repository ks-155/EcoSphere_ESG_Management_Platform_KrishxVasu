import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePolicyAcknowledgementDto } from './dto/create-policy-acknowledgement.dto';
import { UpdatePolicyAcknowledgementDto } from './dto/update-policy-acknowledgement.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class PolicyAcknowledgementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, page, limit, sortBy, sortOrder } = parseQuery(query);

    const where: any = {};
    if (search) {
      where.OR = [
        { policy: { title: { contains: search } } },
        { employee: { name: { contains: search } } },
      ];
    }

    const total = await this.prisma.policyAcknowledgement.count({ where });
    const orderBy: any = {};
    if (sortBy === 'acceptedAt') orderBy.acceptedAt = sortOrder;
    else orderBy.acceptedAt = sortOrder;

    const items = await this.prisma.policyAcknowledgement.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { policy: true, employee: true },
    });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.policyAcknowledgement.findUnique({
      where: { id },
      include: { policy: true, employee: true },
    });
    if (!item) throw new NotFoundException('Policy Acknowledgement not found');
    return item;
  }

  async findByPolicyId(policyId: string) {
    return this.prisma.policyAcknowledgement.findMany({
      where: { policyId },
      include: { employee: true },
    });
  }

  async findByEmployeeId(employeeId: string) {
    return this.prisma.policyAcknowledgement.findMany({
      where: { employeeId },
      include: { policy: true },
    });
  }

  async create(dto: CreatePolicyAcknowledgementDto) {
    return this.prisma.policyAcknowledgement.create({ data: dto as any });
  }

  async update(id: string, dto: UpdatePolicyAcknowledgementDto) {
    await this.findOne(id);
    return this.prisma.policyAcknowledgement.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.policyAcknowledgement.delete({ where: { id } });
  }
}
