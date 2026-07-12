import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Reports')
@Controller('/api/reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a custom ESG report with filters' })
  generate(@Body() dto: GenerateReportDto) {
    return this.service.generate(dto);
  }
}
