import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const org = await this.prisma.organization.findFirst();
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async updateSettings(dto: UpdateOrganizationDto) {
    const org = await this.prisma.organization.findFirst();
    if (!org) throw new NotFoundException('Organization not found');

    return this.prisma.organization.update({
      where: { id: org.id },
      data: dto,
    });
  }
}
