import { IsString, IsOptional, IsBoolean, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Energy' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['CSR_ACTIVITY', 'CHALLENGE'] })
  @IsEnum(['CSR_ACTIVITY', 'CHALLENGE'] as const)
  type: 'CSR_ACTIVITY' | 'CHALLENGE';

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
