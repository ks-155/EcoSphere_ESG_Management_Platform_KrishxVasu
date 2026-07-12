import { IsString, IsOptional, IsBoolean, IsDateString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCsrActivityDto {
  @ApiProperty({ example: 'Beach Cleanup Drive' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ example: 'Annual coastal cleanup event' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'clxxxxxx' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: '2026-07-15T09:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
