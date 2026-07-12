import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductProfileDto {
  @ApiProperty({ example: 'Laptop Pro X1' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'LPT-001' })
  @IsString()
  @MinLength(1)
  sku: string;

  @ApiProperty({ enum: ['ELECTRONICS', 'FOOD', 'TEXTILE', 'PACKAGING', 'CHEMICAL', 'OTHER'] })
  @IsEnum(['ELECTRONICS', 'FOOD', 'TEXTILE', 'PACKAGING', 'CHEMICAL', 'OTHER'] as const)
  category: string;

  @ApiPropertyOptional({ example: 350.0 })
  @IsOptional()
  @IsNumber()
  carbonFootprint?: number;

  @ApiPropertyOptional({ example: 5000.0 })
  @IsOptional()
  @IsNumber()
  waterUsage?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  recyclable?: boolean;

  @ApiProperty({ enum: ['COMPLIANT', 'NON_COMPLIANT', 'PENDING'] })
  @IsEnum(['COMPLIANT', 'NON_COMPLIANT', 'PENDING'] as const)
  complianceStatus: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
