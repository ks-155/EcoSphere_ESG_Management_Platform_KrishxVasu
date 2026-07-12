import { IsString, IsOptional, IsNumber, IsEnum, IsUrl, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '@prisma/client';

export class CreateChallengeParticipationDto {
  @ApiProperty({ example: 'clXXXXXXX' })
  @IsString()
  challengeId: string;

  @ApiProperty({ example: 'uXXXXXXX' })
  @IsString()
  employeeId: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  progress?: number;

  @ApiPropertyOptional({ example: 'https://storage.example.com/evidence.jpg' })
  @IsOptional()
  @IsString()
  evidenceUrl?: string;

  @ApiPropertyOptional({ enum: ApprovalStatus, default: ApprovalStatus.PENDING })
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  xpAwarded?: number;
}
