import { IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NotificationType {
  COMPLIANCE_ISSUE = 'COMPLIANCE_ISSUE',
  CSR_APPROVAL = 'CSR_APPROVAL',
  CHALLENGE_APPROVAL = 'CHALLENGE_APPROVAL',
  POLICY_REMINDER = 'POLICY_REMINDER',
  BADGE_UNLOCK = 'BADGE_UNLOCK',
  REWARD_REDEEMED = 'REWARD_REDEEMED',
}

export class CreateNotificationDto {
  @ApiProperty({ example: 'clxxxxxx' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.POLICY_REMINDER })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'Policy Review Required' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ example: 'Please review the updated ESG policy.' })
  @IsString()
  @MinLength(1)
  message: string;

  @ApiPropertyOptional({ example: '/policies/clxxxxxx' })
  @IsOptional()
  @IsString()
  link?: string;
}
