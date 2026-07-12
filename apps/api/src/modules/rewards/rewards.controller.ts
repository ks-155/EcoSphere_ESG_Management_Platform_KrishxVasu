import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@ApiTags('Rewards')
@Controller('/api/rewards')
export class RewardsController {
  constructor(private readonly service: RewardsService) {}

  @Get()
  @ApiOperation({ summary: 'List rewards' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get reward by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create reward' })
  create(@Body() dto: CreateRewardDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reward' })
  update(@Param('id') id: string, @Body() dto: UpdateRewardDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reward' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
