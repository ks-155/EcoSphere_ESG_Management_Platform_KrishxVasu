import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { department: { select: { name: true } } },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.formatAuthResponse(user);
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        organizationId: dto.organizationId,
      },
      include: { department: { select: { name: true } } },
    });

    return this.formatAuthResponse(user);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        xp: true,
        avatar: true,
        departmentId: true,
        organizationId: true,
        department: { select: { name: true, code: true } },
        ownedBadges: {
          include: { badge: { select: { name: true, description: true, icon: true } } },
          take: 10,
          orderBy: { awardedAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      departmentId: user.departmentId,
      departmentName: user.department?.name || null,
      avatarUrl: user.avatar,
      xp: user.xp,
      badges: user.ownedBadges.map(ub => ({
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
      })),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { department: { select: { name: true } } },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.formatAuthResponse(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout() {
    return { success: true };
  }

  private formatAuthResponse(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        departmentId: user.departmentId || undefined,
        departmentName: user.department?.name || undefined,
        avatarUrl: user.avatar || undefined,
      },
      tokens: {
        accessToken: this.jwt.sign(payload, { expiresIn: '15m' }),
        refreshToken: this.jwt.sign(payload, { expiresIn: '7d' }),
      },
    };
  }
}
