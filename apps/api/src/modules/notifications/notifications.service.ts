import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PaginatedResponse } from '../../common/helpers/pagination.helper';
import { parseQuery } from '../../common/helpers/query.helper';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string, query: any): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = parseQuery(query);
    const { isRead, type } = query;

    const where: any = { userId };
    if (isRead !== undefined && isRead !== '') where.isRead = isRead === 'true';
    if (type) where.type = type;

    const total = await this.prisma.notification.count({ where });
    const orderBy: any = {};
    if (sortBy === 'type') orderBy.type = sortOrder;
    else if (sortBy === 'isRead') orderBy.isRead = sortOrder;
    else orderBy.createdAt = sortOrder;

    const items = await this.prisma.notification.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.prisma.notification.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Notification not found');
    return item;
  }

  async markAsRead(id: string) {
    await this.findOne(id);
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: dto });
  }

  async update(id: string, dto: UpdateNotificationDto) {
    await this.findOne(id);
    return this.prisma.notification.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.notification.delete({ where: { id } });
  }
}
