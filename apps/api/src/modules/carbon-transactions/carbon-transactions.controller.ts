import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CarbonTransactionsService } from './carbon-transactions.service';
import { CreateCarbonTransactionDto } from './dto/create-carbon-transaction.dto';
import { UpdateCarbonTransactionDto } from './dto/update-carbon-transaction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Carbon Transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('/api/carbon-transactions')
export class CarbonTransactionsController {
  constructor(private readonly service: CarbonTransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'List carbon transactions' })
  findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get('stats')
  @ApiOperation({ summary: 'Get carbon transaction stats' })
  getStats(@Query() query: any) { return this.service.getStats(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get carbon transaction by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create carbon transaction' })
  create(@Body() dto: CreateCarbonTransactionDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update carbon transaction' })
  update(@Param('id') id: string, @Body() dto: UpdateCarbonTransactionDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete carbon transaction' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
