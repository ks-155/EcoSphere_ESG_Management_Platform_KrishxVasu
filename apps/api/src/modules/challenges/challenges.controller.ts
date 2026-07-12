import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Challenges')
@Controller('/api/challenges')
export class ChallengesController {
  constructor(private readonly service: ChallengesService) {}

  @Get()
  @ApiOperation({ summary: 'List challenges' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'difficulty', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get challenge by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @Roles('SUPER_ADMIN', 'ESG_MANAGER')
  @ApiOperation({ summary: 'Create challenge (ESG Manager+)' })
  create(@Body() dto: CreateChallengeDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ESG_MANAGER')
  @ApiOperation({ summary: 'Update challenge (ESG Manager+)' })
  update(@Param('id') id: string, @Body() dto: UpdateChallengeDto) { return this.service.update(id, dto); }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ESG_MANAGER', 'AUDITOR')
  @ApiOperation({ summary: 'Update challenge status (ESG Manager+)' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) { return this.service.updateStatus(id, status); }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete challenge (Admin only)' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
