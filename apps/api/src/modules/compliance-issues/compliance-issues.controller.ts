import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ComplianceIssuesService } from './compliance-issues.service';
import { CreateComplianceIssueDto } from './dto/create-compliance-issue.dto';
import { UpdateComplianceIssueDto } from './dto/update-compliance-issue.dto';

@ApiTags('Compliance Issues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/compliance-issues')
export class ComplianceIssuesController {
  constructor(private readonly service: ComplianceIssuesService) {}

  @Get()
  @ApiOperation({ summary: 'List compliance issues' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'auditId', required: false })
  @ApiQuery({ name: 'ownerId', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get compliance issue by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @Roles('SUPER_ADMIN', 'ESG_MANAGER', 'AUDITOR')
  @ApiOperation({ summary: 'Create compliance issue (Manager+)' })
  create(@Body() dto: CreateComplianceIssueDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ESG_MANAGER', 'AUDITOR')
  @ApiOperation({ summary: 'Update compliance issue (Manager+)' })
  update(@Param('id') id: string, @Body() dto: UpdateComplianceIssueDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ESG_MANAGER')
  @ApiOperation({ summary: 'Delete compliance issue (Manager+)' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
