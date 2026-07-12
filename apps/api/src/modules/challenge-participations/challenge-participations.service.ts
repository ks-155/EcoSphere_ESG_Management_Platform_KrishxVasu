import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChallengeParticipationDto } from './dto/create-challenge-participation.dto';
import { UpdateChallengeParticipationDto } from './dto/update-challenge-participation.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';
import { ApprovalStatus } from '@prisma/client';

@Injectable()
export class ChallengeParticipationsService {
  constructor(private prisma: PrismaService, private events: EventEmitter2) {}

  async findAll(query: any): Promise<PaginatedResponse<any>> {
    const { search, page, limit, sortBy, sortOrder } = parseQuery(query);
    const { challengeId, employeeId, approvalStatus } = query;

    const where: any = {};
    if (challengeId) where.challengeId = challengeId;
    if (employeeId) where.employeeId = employeeId;
    if (approvalStatus) where.approvalStatus = approvalStatus;

    const total = await this.prisma.challengeParticipation.count({ where });
    const orderBy: any = {};
    if (sortBy === 'xpAwarded') orderBy.xpAwarded = sortOrder;
    else if (sortBy === 'progress') orderBy.progress = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else orderBy.createdAt = sortOrder;

    const items = await this.prisma.challengeParticipation.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { challenge: true, employee: true },
    });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.challengeParticipation.findUnique({
      where: { id },
      include: { challenge: true, employee: true },
    });
    if (!item) throw new NotFoundException('Challenge Participation not found');
    return item;
  }

  async create(dto: CreateChallengeParticipationDto) {
    return this.prisma.challengeParticipation.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateChallengeParticipationDto) {
    await this.findOne(id);
    return this.prisma.challengeParticipation.update({ where: { id }, data: dto as any });
  }

  async approve(id: string) {
    const participation = await this.findOne(id);

    if (participation.approvalStatus === ApprovalStatus.APPROVED) {
      throw new ConflictException('Participation already approved');
    }

    const updated = await this.prisma.challengeParticipation.update({
      where: { id },
      data: { approvalStatus: ApprovalStatus.APPROVED, xpAwarded: participation.challenge.xp },
      include: { challenge: true, employee: true },
    });

    await this.prisma.user.update({
      where: { id: updated.employeeId },
      data: { xp: { increment: updated.xpAwarded } },
    });

    await this.prisma.notification.create({
      data: {
        userId: updated.employeeId,
        type: 'CHALLENGE_APPROVAL',
        title: 'Challenge Completed',
        message: `You completed "${updated.challenge.title}" and earned ${updated.xpAwarded} XP!`,
      },
    });

    const badges = await this.prisma.badge.findMany({ where: { status: true } });
    const newlyAwarded: string[] = [];

    for (const badge of badges) {
      const hasBadge = await this.prisma.userBadge.findFirst({
        where: { userId: updated.employeeId, badgeId: badge.id },
      });
      if (hasBadge) continue;

      const user = await this.prisma.user.findUnique({ where: { id: updated.employeeId } });
      let qualifies = false;

      if (badge.unlockType === 'CHALLENGE_COUNT') {
        const count = await this.prisma.challengeParticipation.count({
          where: { employeeId: updated.employeeId, approvalStatus: ApprovalStatus.APPROVED },
        });
        qualifies = count >= badge.unlockValue;
      } else if (badge.unlockType === 'XP_THRESHOLD') {
        qualifies = (user?.xp ?? 0) >= badge.unlockValue;
      }

      if (qualifies) {
        await this.prisma.$transaction([
          this.prisma.userBadge.create({ data: { userId: updated.employeeId, badgeId: badge.id } }),
          this.prisma.user.update({ where: { id: updated.employeeId }, data: { xp: { increment: badge.xpReward } } }),
        ]);
        newlyAwarded.push(badge.id);

        await this.prisma.notification.create({
          data: {
            userId: updated.employeeId,
            type: 'BADGE_UNLOCK',
            title: 'Badge Earned!',
            message: `You earned the "${badge.name}" badge! +${badge.xpReward} XP.`,
          },
        });
      }
    }

    this.events.emit('challenge.completed', {
      userId: updated.employeeId,
      challengeId: updated.challengeId,
      xpAwarded: updated.xpAwarded,
      newlyAwarded,
    });

    return updated;
  }

  async reject(id: string) {
    const participation = await this.findOne(id);

    if (participation.approvalStatus === ApprovalStatus.REJECTED) {
      throw new ConflictException('Participation already rejected');
    }

    return this.prisma.challengeParticipation.update({
      where: { id },
      data: { approvalStatus: ApprovalStatus.REJECTED },
      include: { challenge: true, employee: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.challengeParticipation.delete({ where: { id } });
  }

  async getLeaderboard() {
    const results = await this.prisma.challengeParticipation.groupBy({
      by: ['employeeId'],
      where: { approvalStatus: ApprovalStatus.APPROVED },
      _sum: { xpAwarded: true },
      orderBy: { _sum: { xpAwarded: 'desc' } },
    });

    const leaderboard = await Promise.all(
      results.map(async (r, index) => {
        const employee = await this.prisma.user.findUnique({ where: { id: r.employeeId } });
        return {
          rank: index + 1,
          employeeId: r.employeeId,
          employee,
          totalXp: r._sum.xpAwarded ?? 0,
        };
      }),
    );

    return leaderboard;
  }
}
