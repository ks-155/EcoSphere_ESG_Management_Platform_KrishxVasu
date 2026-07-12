import { IsString, IsOptional, IsNumber, IsDateString, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentScoreDto {
  @ApiProperty({ example: 'clXXXXXXX' })
  @IsString()
  @MinLength(1)
  departmentId: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  @IsDateString()
  periodStart: string;

  @ApiProperty({ example: '2026-06-30T23:59:59.999Z' })
  @IsDateString()
  periodEnd: string;

  @ApiPropertyOptional({ example: 85.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  environmentalScore?: number;

  @ApiPropertyOptional({ example: 72.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  socialScore?: number;

  @ApiPropertyOptional({ example: 90.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  governanceScore?: number;

  @ApiPropertyOptional({ example: 82.3 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalScore?: number;
}
