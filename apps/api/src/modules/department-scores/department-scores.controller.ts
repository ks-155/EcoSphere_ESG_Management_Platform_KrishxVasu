import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DepartmentScoresService } from './department-scores.service';
import { CreateDepartmentScoreDto } from './dto/create-department-score.dto';
import { UpdateDepartmentScoreDto } from './dto/update-department-score.dto';
import { CalculateScoreDto } from './dto/calculate-score.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Department Scores')
@Controller('/api/department-scores')
export class DepartmentScoresController {
  constructor(private readonly service: DepartmentScoresService) {}

  @Get()
  @ApiOperation({ summary: 'List department scores (paginated)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'periodStart', required: false })
  @ApiQuery({ name: 'periodEnd', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('org-score')
  @ApiOperation({ summary: 'Get overall organization ESG score' })
  getOrgScore() {
    return this.service.getOrgScore();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department score by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create department score' })
  create(@Body() dto: CreateDepartmentScoreDto) {
    return this.service.create(dto);
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate ESG score for a department and period (scoring engine)' })
  calculateScore(@Body() dto: CalculateScoreDto) {
    return this.service.calculateScore(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update department score' })
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentScoreDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete department score' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
