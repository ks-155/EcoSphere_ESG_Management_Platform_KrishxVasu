import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['ACTIVE'],
  ACTIVE: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['COMPLETED'],
  COMPLETED: [],
  ARCHIVED: [],
};

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, status, page, limit, sortBy, sortOrder } = parseQuery(query);
    const { categoryId, difficulty } = query;

    const where: any = {};
    if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
    if (status !== undefined && status !== '') where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (difficulty) where.difficulty = difficulty;

    const total = await this.prisma.challenge.count({ where });
    const orderBy: any = {};
    if (sortBy === 'xp') orderBy.xp = sortOrder;
    else if (sortBy === 'difficulty') orderBy.difficulty = sortOrder;
    else if (sortBy === 'deadline') orderBy.deadline = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.title = sortOrder;

    const items = await this.prisma.challenge.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.challenge.findUnique({
      where: { id },
      include: { category: true, _count: { select: { participations: true } } },
    });
    if (!item) throw new NotFoundException('Challenge not found');
    return item;
  }

  async create(dto: CreateChallengeDto) {
    const data: any = { ...dto };
    if (dto.deadline) data.deadline = new Date(dto.deadline);
    return this.prisma.challenge.create({ data });
  }

  async update(id: string, dto: UpdateChallengeDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.deadline) data.deadline = new Date(dto.deadline);
    return this.prisma.challenge.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: string) {
    const challenge = await this.findOne(id);
    const allowed = VALID_TRANSITIONS[challenge.status] ?? [];
    if (!allowed.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${challenge.status} to ${status}. Allowed: ${allowed.length ? allowed.join(', ') : 'none'}`,
      );
    }
    return this.prisma.challenge.update({ where: { id }, data: { status: status as any } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.challenge.delete({ where: { id } });
  }
}
