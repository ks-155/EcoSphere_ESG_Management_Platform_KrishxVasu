import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CsrActivitiesService } from './csr-activities.service';
import { CreateCsrActivityDto } from './dto/create-csr-activity.dto';
import { UpdateCsrActivityDto } from './dto/update-csr-activity.dto';

@ApiTags('CSR Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/csr-activities')
export class CsrActivitiesController {
  constructor(private readonly service: CsrActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List CSR activities' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get CSR activity by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create CSR activity' })
  create(@Body() dto: CreateCsrActivityDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update CSR activity' })
  update(@Param('id') id: string, @Body() dto: UpdateCsrActivityDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete CSR activity' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
