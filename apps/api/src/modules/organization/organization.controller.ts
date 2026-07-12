import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Organization')
@Controller('/api/organization')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Get('settings')
  @ApiOperation({ summary: 'Get organization ESG settings' })
  getSettings() {
    return this.service.getSettings();
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update organization ESG settings' })
  updateSettings(@Body() dto: UpdateOrganizationDto) {
    return this.service.updateSettings(dto);
  }
}
