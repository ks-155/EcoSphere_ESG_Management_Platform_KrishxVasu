import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({ example: 'Extra PTO Day' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: 'One additional paid time off day' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '/rewards/pto.png' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(1)
  pointCost: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ enum: ['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'GENERAL'] })
  @IsEnum(['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'GENERAL'] as const)
  category: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
