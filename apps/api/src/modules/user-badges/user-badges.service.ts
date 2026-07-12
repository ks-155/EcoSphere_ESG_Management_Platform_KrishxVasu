import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserBadgeDto } from './dto/create-user-badge.dto';
import { UpdateUserBadgeDto } from './dto/update-user-badge.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class UserBadgesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, status, page, limit, sortBy, sortOrder } = parseQuery(query);
    const where: any = {};
    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { badge: { name: { contains: search } } },
      ];
    }

    const total = await this.prisma.userBadge.count({ where });
    const orderBy: any = {};
    if (sortBy === 'awardedAt') orderBy.awardedAt = sortOrder;
    else orderBy.awardedAt = sortOrder;

    const items = await this.prisma.userBadge.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true, badge: true },
    });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.userBadge.findUnique({
      where: { id },
      include: { user: true, badge: true },
    });
    if (!item) throw new NotFoundException('User badge not found');
    return item;
  }

  async findByUserId(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { awardedAt: 'desc' },
    });
  }

  async create(dto: CreateUserBadgeDto) {
    const existing = await this.prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId: dto.userId, badgeId: dto.badgeId } },
    });
    if (existing) throw new ConflictException('User already has this badge');

    const [user, badge] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: dto.userId } }),
      this.prisma.badge.findUnique({ where: { id: dto.badgeId } }),
    ]);
    if (!user) throw new NotFoundException('User not found');
    if (!badge) throw new NotFoundException('Badge not found');

    return this.prisma.userBadge.create({
      data: { userId: dto.userId, badgeId: dto.badgeId },
      include: { user: true, badge: true },
    });
  }

  async update(id: string, dto: UpdateUserBadgeDto) {
    await this.findOne(id);
    return this.prisma.userBadge.update({
      where: { id },
      data: dto as any,
      include: { user: true, badge: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.userBadge.delete({ where: { id } });
  }

  async awardManualBadge(userId: string, badgeId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const badge = await this.prisma.badge.findUnique({ where: { id: badgeId } });
    if (!badge) throw new NotFoundException('Badge not found');

    const existing = await this.prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } },
    });
    if (existing) throw new ConflictException('User already has this badge');

    await this.prisma.$transaction([
      this.prisma.userBadge.create({
        data: { userId, badgeId },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: badge.xpReward } },
      }),
    ]);

    return this.prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } },
      include: { user: true, badge: true },
    });
  }

  async checkAndAwardBadges(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const earnedBadgeIds = (
      await this.prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } })
    ).map((ub) => ub.badgeId);

    const xpThresholdBadges = await this.prisma.badge.findMany({
      where: { unlockType: 'XP_THRESHOLD', status: true },
    });

    const challengeCountBadges = await this.prisma.badge.findMany({
      where: { unlockType: 'CHALLENGE_COUNT', status: true },
    });

    let completedChallengesCount: number | null = null;
    if (challengeCountBadges.length > 0) {
      completedChallengesCount = await this.prisma.challengeParticipation.count({
        where: { employeeId: userId, approvalStatus: 'APPROVED' },
      });
    }

    const newlyAwarded: any[] = [];

    for (const badge of xpThresholdBadges) {
      if (earnedBadgeIds.includes(badge.id)) continue;
      if (user.xp >= badge.unlockValue) {
        await this.prisma.$transaction([
          this.prisma.userBadge.create({
            data: { userId, badgeId: badge.id },
          }),
          this.prisma.user.update({
            where: { id: userId },
            data: { xp: { increment: badge.xpReward } },
          }),
        ]);
        newlyAwarded.push(badge.id);
      }
    }

    if (completedChallengesCount !== null) {
      for (const badge of challengeCountBadges) {
        if (earnedBadgeIds.includes(badge.id)) continue;
        if (completedChallengesCount >= badge.unlockValue) {
          await this.prisma.$transaction([
            this.prisma.userBadge.create({
              data: { userId, badgeId: badge.id },
            }),
            this.prisma.user.update({
              where: { id: userId },
              data: { xp: { increment: badge.xpReward } },
            }),
          ]);
          newlyAwarded.push(badge.id);
        }
      }
    }

    return {
      userId,
      newlyAwardedCount: newlyAwarded.length,
      newlyAwardedIds: newlyAwarded,
    };
  }
}
