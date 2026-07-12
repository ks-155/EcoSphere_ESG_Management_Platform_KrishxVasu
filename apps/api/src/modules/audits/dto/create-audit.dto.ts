import { IsString, IsOptional, IsDateString, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AuditStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class CreateAuditDto {
  @ApiProperty({ example: 'Annual ESG Audit' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ example: 'Comprehensive review of ESG practices' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-07-15T09:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ enum: AuditStatus, default: AuditStatus.PLANNED })
  @IsOptional()
  @IsEnum(AuditStatus)
  status?: AuditStatus;
}
