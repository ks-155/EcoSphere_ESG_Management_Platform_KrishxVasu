import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmissionFactorDto {
  @ApiProperty({ example: 'Natural Gas' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Fuel' })
  @IsString()
  category: string;

  @ApiProperty({ example: 2.0 })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ enum: ['KG', 'TONNE', 'LITER', 'KWH', 'MWH'] })
  @IsEnum(['KG', 'TONNE', 'LITER', 'KWH', 'MWH'] as const)
  unit: string;

  @ApiPropertyOptional({ example: 'EPA' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  validFrom: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  validTo?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
