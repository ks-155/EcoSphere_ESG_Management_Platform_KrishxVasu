import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EmployeeParticipationsService } from './employee-participations.service';
import { CreateEmployeeParticipationDto } from './dto/create-employee-participation.dto';
import { UpdateEmployeeParticipationDto } from './dto/update-employee-participation.dto';

@ApiTags('Employee Participations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/employee-participations')
export class EmployeeParticipationsController {
  constructor(private readonly service: EmployeeParticipationsService) {}

  @Get()
  @ApiOperation({ summary: 'List employee participations' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'csrActivityId', required: false })
  @ApiQuery({ name: 'approvalStatus', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get participation by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create employee participation' })
  create(@Body() dto: CreateEmployeeParticipationDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update participation' })
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeParticipationDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete participation' })
  remove(@Param('id') id: string) { return this.service.remove(id); }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve participation and award points' })
  approve(@Param('id') id: string) { return this.service.approve(id); }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject participation' })
  reject(@Param('id') id: string) { return this.service.reject(id); }
}
