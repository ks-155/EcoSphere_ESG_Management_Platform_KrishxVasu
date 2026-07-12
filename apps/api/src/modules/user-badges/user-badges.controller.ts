import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserBadgesService } from './user-badges.service';
import { CreateUserBadgeDto } from './dto/create-user-badge.dto';
import { UpdateUserBadgeDto } from './dto/update-user-badge.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('User Badges')
@Controller('/api/user-badges')
export class UserBadgesController {
  constructor(private readonly service: UserBadgesService) {}

  @Get()
  @ApiOperation({ summary: 'List user badges' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all badges for a user' })
  findByUserId(@Param('userId') userId: string) { return this.service.findByUserId(userId); }

  @Get(':id')
  @ApiOperation({ summary: 'Get user badge by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create user badge' })
  create(@Body() dto: CreateUserBadgeDto) { return this.service.create(dto); }

  @Post('check/:userId')
  @ApiOperation({ summary: 'Trigger auto-check and award eligible badges' })
  checkAndAwardBadges(@Param('userId') userId: string) { return this.service.checkAndAwardBadges(userId); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user badge' })
  update(@Param('id') id: string, @Body() dto: UpdateUserBadgeDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user badge' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
