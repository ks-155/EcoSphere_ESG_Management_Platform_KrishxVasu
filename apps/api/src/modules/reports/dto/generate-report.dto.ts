import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ReportModule {
  CARBON = 'CARBON',
  CSR = 'CSR',
  CHALLENGES = 'CHALLENGES',
  AUDITS = 'AUDITS',
  COMPLIANCE = 'COMPLIANCE',
  GAMIFICATION = 'GAMIFICATION',
  ALL = 'ALL',
}

export class GenerateReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: ReportModule })
  @IsOptional()
  @IsEnum(ReportModule)
  module?: ReportModule;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employeeId?: string;
}
