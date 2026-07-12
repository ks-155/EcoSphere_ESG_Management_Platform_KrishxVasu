import { IsString, IsDateString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateScoreDto {
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
}
