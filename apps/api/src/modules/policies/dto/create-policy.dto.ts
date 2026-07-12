import { IsString, IsOptional, IsEnum, IsDateString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePolicyDto {
  @ApiProperty({ example: 'Environmental Policy' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'GENERAL'] })
  @IsEnum(['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'GENERAL'] as const)
  category: string;

  @ApiProperty({ example: 'We are committed to reducing our environmental impact.' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({ example: '1.0' })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({ enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'] })
  @IsEnum(['DRAFT', 'ACTIVE', 'ARCHIVED'] as const)
  status: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  effectiveDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;
}
