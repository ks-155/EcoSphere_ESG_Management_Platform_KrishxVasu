import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export class CreateComplianceIssueDto {
  @ApiPropertyOptional({ example: 'clxxxxxx' })
  @IsOptional()
  @IsString()
  auditId?: string;

  @ApiProperty({ enum: Severity, example: Severity.MEDIUM })
  @IsEnum(Severity)
  severity: Severity;

  @ApiProperty({ example: 'Carbon emissions exceed threshold' })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({ example: 'clxxxxxx' })
  @IsString()
  ownerId: string;

  @ApiProperty({ example: '2026-08-15T00:00:00.000Z' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ enum: IssueStatus, default: IssueStatus.OPEN })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isOverdue?: boolean;
}
