import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('/api/dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get ESG overview dashboard data' })
  getOverview() {
    return this.service.getOverview();
  }

  @Get('environmental')
  @ApiOperation({ summary: 'Get environmental dashboard data' })
  @ApiQuery({ name: 'start', required: false })
  @ApiQuery({ name: 'end', required: false })
  getEnvironmentalDashboard(@Query('start') start?: string, @Query('end') end?: string) {
    return this.service.getEnvironmentalDashboard({ start, end });
  }

  @Get('social')
  @ApiOperation({ summary: 'Get social dashboard data' })
  getSocialDashboard() {
    return this.service.getSocialDashboard();
  }

  @Get('governance')
  @ApiOperation({ summary: 'Get governance dashboard data' })
  getGovernanceDashboard() {
    return this.service.getGovernanceDashboard();
  }

  @Get('scores')
  @ApiOperation({ summary: 'Get department scores and org overall score' })
  getScores() {
    return this.service.getScores();
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get top employees by XP' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getLeaderboard(@Query('limit') limit?: string) {
    return this.service.getLeaderboard(limit ? parseInt(limit, 10) : 10);
  }
}
