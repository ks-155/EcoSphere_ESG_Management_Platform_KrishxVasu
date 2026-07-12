import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuditsService } from './audits.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';

@ApiTags('Audits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/audits')
export class AuditsController {
  constructor(private readonly service: AuditsService) {}

  @Get()
  @ApiOperation({ summary: 'List audits' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @Roles('SUPER_ADMIN', 'ESG_MANAGER', 'AUDITOR')
  @ApiOperation({ summary: 'Create audit (Auditor+)' })
  create(@Body() dto: CreateAuditDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ESG_MANAGER', 'AUDITOR')
  @ApiOperation({ summary: 'Update audit (Auditor+)' })
  update(@Param('id') id: string, @Body() dto: UpdateAuditDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ESG_MANAGER')
  @ApiOperation({ summary: 'Delete audit (Manager+)' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
