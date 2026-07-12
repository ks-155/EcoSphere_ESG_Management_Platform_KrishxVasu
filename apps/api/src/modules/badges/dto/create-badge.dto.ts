import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBadgeDto {
  @ApiProperty({ example: 'Eco Starter' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: 'Begin your sustainability journey' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '/badges/eco-starter.png' })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiProperty({ enum: ['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'GENERAL'] })
  @IsEnum(['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE', 'GENERAL'] as const)
  category: string;

  @ApiProperty({ enum: ['XP_THRESHOLD', 'CHALLENGE_COUNT', 'MANUAL'] })
  @IsEnum(['XP_THRESHOLD', 'CHALLENGE_COUNT', 'MANUAL'] as const)
  unlockType: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unlockValue?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  xpReward?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
