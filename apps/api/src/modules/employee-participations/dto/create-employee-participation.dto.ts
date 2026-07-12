import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '@prisma/client';

export class CreateEmployeeParticipationDto {
  @ApiProperty({ example: 'uXXXXXXX' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: 'clXXXXXXX' })
  @IsString()
  csrActivityId: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/proof.jpg' })
  @IsOptional()
  @IsString()
  proofUrl?: string;

  @ApiPropertyOptional({ enum: ApprovalStatus, default: ApprovalStatus.PENDING })
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointsEarned?: number;

  @ApiPropertyOptional({ example: '2026-07-10T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  completionDate?: string;
}
