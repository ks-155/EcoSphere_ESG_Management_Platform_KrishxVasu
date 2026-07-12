import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRewardRedemptionDto } from './dto/create-reward-redemption.dto';
import { UpdateRewardRedemptionDto } from './dto/update-reward-redemption.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class RewardRedemptionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, status, page, limit, sortBy, sortOrder } = parseQuery(query);
    const where: any = {};
    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { reward: { name: { contains: search } } },
      ];
    }

    const total = await this.prisma.rewardRedemption.count({ where });
    const orderBy: any = {};
    if (sortBy === 'redeemedAt') orderBy.redeemedAt = sortOrder;
    else if (sortBy === 'pointsSpent') orderBy.pointsSpent = sortOrder;
    else orderBy.redeemedAt = sortOrder;

    const items = await this.prisma.rewardRedemption.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true, reward: true },
    });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.rewardRedemption.findUnique({
      where: { id },
      include: { user: true, reward: true },
    });
    if (!item) throw new NotFoundException('Reward redemption not found');
    return item;
  }

  async findByUserId(userId: string) {
    return this.prisma.rewardRedemption.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  async create(dto: CreateRewardRedemptionDto) {
    const [user, reward] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: dto.userId } }),
      this.prisma.reward.findUnique({ where: { id: dto.rewardId } }),
    ]);
    if (!user) throw new NotFoundException('User not found');
    if (!reward) throw new NotFoundException('Reward not found');

    return this.prisma.rewardRedemption.create({
      data: {
        userId: dto.userId,
        rewardId: dto.rewardId,
        pointsSpent: dto.pointsSpent,
      },
      include: { user: true, reward: true },
    });
  }

  async update(id: string, dto: UpdateRewardRedemptionDto) {
    await this.findOne(id);
    return this.prisma.rewardRedemption.update({
      where: { id },
      data: dto as any,
      include: { user: true, reward: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.rewardRedemption.delete({ where: { id } });
  }

  async redeem(userId: string, rewardId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const reward = await this.prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new NotFoundException('Reward not found');
    if (!reward.status) throw new ConflictException('Reward is not active');
    if (reward.stock <= 0) throw new ConflictException('Reward is out of stock');
    if (user.xp < reward.pointCost) {
      throw new ConflictException(`Insufficient XP. Required: ${reward.pointCost}, Available: ${user.xp}`);
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { xp: { decrement: reward.pointCost } },
      }),
      this.prisma.reward.update({
        where: { id: rewardId },
        data: { stock: { decrement: 1 } },
      }),
      this.prisma.rewardRedemption.create({
        data: {
          userId,
          rewardId,
          pointsSpent: reward.pointCost,
        },
      }),
    ]);

    return this.prisma.rewardRedemption.findFirst({
      where: { userId, rewardId },
      orderBy: { redeemedAt: 'desc' },
      include: { user: true, reward: true },
    });
  }
}
