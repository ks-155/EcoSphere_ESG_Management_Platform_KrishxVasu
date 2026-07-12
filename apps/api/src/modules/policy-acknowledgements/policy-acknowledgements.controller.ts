import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PolicyAcknowledgementsService } from './policy-acknowledgements.service';
import { CreatePolicyAcknowledgementDto } from './dto/create-policy-acknowledgement.dto';
import { UpdatePolicyAcknowledgementDto } from './dto/update-policy-acknowledgement.dto';

@ApiTags('Policy Acknowledgements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/policy-acknowledgements')
export class PolicyAcknowledgementsController {
  constructor(private readonly service: PolicyAcknowledgementsService) {}

  @Get()
  @ApiOperation({ summary: 'List policy acknowledgements' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get('policy/:policyId')
  @ApiOperation({ summary: 'Find acknowledgements by policy' })
  findByPolicyId(@Param('policyId') policyId: string) { return this.service.findByPolicyId(policyId); }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Find acknowledgements by employee' })
  findByEmployeeId(@Param('employeeId') employeeId: string) { return this.service.findByEmployeeId(employeeId); }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy acknowledgement by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create policy acknowledgement' })
  create(@Body() dto: CreatePolicyAcknowledgementDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update policy acknowledgement' })
  update(@Param('id') id: string, @Body() dto: UpdatePolicyAcknowledgementDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete policy acknowledgement' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
