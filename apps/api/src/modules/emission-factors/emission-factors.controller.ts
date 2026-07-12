import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EmissionFactorsService } from './emission-factors.service';
import { CreateEmissionFactorDto } from './dto/create-emission-factor.dto';
import { UpdateEmissionFactorDto } from './dto/update-emission-factor.dto';

@ApiTags('Emission Factors')
@Controller('/api/emission-factors')
export class EmissionFactorsController {
  constructor(private readonly service: EmissionFactorsService) {}

  @Get()
  @ApiOperation({ summary: 'List emission factors' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get emission factor by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create emission factor' })
  create(@Body() dto: CreateEmissionFactorDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update emission factor' })
  update(@Param('id') id: string, @Body() dto: UpdateEmissionFactorDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete emission factor' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
