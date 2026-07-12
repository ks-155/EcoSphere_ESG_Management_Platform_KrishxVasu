import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RewardRedemptionsService } from './reward-redemptions.service';
import { CreateRewardRedemptionDto } from './dto/create-reward-redemption.dto';
import { UpdateRewardRedemptionDto } from './dto/update-reward-redemption.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Reward Redemptions')
@Controller('/api/reward-redemptions')
export class RewardRedemptionsController {
  constructor(private readonly service: RewardRedemptionsService) {}

  @Get()
  @ApiOperation({ summary: 'List reward redemptions' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all redemptions for a user' })
  findByUserId(@Param('userId') userId: string) { return this.service.findByUserId(userId); }

  @Get(':id')
  @ApiOperation({ summary: 'Get reward redemption by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create reward redemption' })
  create(@Body() dto: CreateRewardRedemptionDto) { return this.service.create(dto); }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem a reward' })
  redeem(@Body() body: { userId: string; rewardId: string }) { return this.service.redeem(body.userId, body.rewardId); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reward redemption' })
  update(@Param('id') id: string, @Body() dto: UpdateRewardRedemptionDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reward redemption' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
