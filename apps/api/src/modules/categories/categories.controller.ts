import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('/api/categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List categories' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create category' })
  create(@Body() dto: CreateCategoryDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
