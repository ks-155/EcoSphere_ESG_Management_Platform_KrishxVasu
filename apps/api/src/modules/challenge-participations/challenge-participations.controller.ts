import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChallengeParticipationsService } from './challenge-participations.service';
import { CreateChallengeParticipationDto } from './dto/create-challenge-participation.dto';
import { UpdateChallengeParticipationDto } from './dto/update-challenge-participation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Challenge Participations')
@Controller('/api/challenge-participations')
export class ChallengeParticipationsController {
  constructor(private readonly service: ChallengeParticipationsService) {}

  @Get()
  @ApiOperation({ summary: 'List challenge participations' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'challengeId', required: false })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'approvalStatus', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  getLeaderboard() { return this.service.getLeaderboard(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get participation by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create challenge participation' })
  create(@Body() dto: CreateChallengeParticipationDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update participation' })
  update(@Param('id') id: string, @Body() dto: UpdateChallengeParticipationDto) { return this.service.update(id, dto); }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve participation and award XP' })
  approve(@Param('id') id: string) { return this.service.approve(id); }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject participation' })
  reject(@Param('id') id: string) { return this.service.reject(id); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete participation' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
