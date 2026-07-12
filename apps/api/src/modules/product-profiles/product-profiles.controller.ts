import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductProfilesService } from './product-profiles.service';
import { CreateProductProfileDto } from './dto/create-product-profile.dto';
import { UpdateProductProfileDto } from './dto/update-product-profile.dto';

@ApiTags('Product Profiles')
@Controller('/api/product-profiles')
export class ProductProfilesController {
  constructor(private readonly service: ProductProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'List product profiles' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get product profile by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create product profile' })
  create(@Body() dto: CreateProductProfileDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product profile' })
  update(@Param('id') id: string, @Body() dto: UpdateProductProfileDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product profile' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
