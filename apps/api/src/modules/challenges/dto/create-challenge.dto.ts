import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChallengeDto {
  @ApiProperty({ example: 'Zero Waste Week' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ example: 'Complete a week without generating waste' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'catXXXXXXX' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  xp: number;

  @ApiProperty({ enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM' })
  @IsEnum(['EASY', 'MEDIUM', 'HARD'] as const)
  difficulty: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  evidenceRequired: boolean;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiProperty({ enum: ['DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'ARCHIVED'], default: 'DRAFT' })
  @IsEnum(['DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'ARCHIVED'] as const)
  status: string;
}
