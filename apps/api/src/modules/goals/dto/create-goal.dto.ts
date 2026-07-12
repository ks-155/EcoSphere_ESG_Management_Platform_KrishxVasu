import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({ example: 'Reduce Carbon Emissions' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: 'Cut Scope 1+2 emissions by 20%' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE'] })
  @IsEnum(['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE'] as const)
  type: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  targetValue: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentValue?: number;

  @ApiProperty({ example: '%' })
  @IsString()
  @MinLength(1)
  unit: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  deadline: string;

  @ApiProperty({ enum: ['NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'CANCELLED'] })
  @IsEnum(['NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'CANCELLED'] as const)
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiProperty({ enum: ['QUARTERLY', 'ANNUAL', 'MULTI_YEAR'] })
  @IsEnum(['QUARTERLY', 'ANNUAL', 'MULTI_YEAR'] as const)
  timeframe: string;
}
