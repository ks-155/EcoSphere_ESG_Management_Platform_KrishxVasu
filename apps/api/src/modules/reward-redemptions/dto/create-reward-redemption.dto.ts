import { IsString, IsNumber, MinLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRewardRedemptionDto {
  @ApiProperty({ example: 'clx123abc456' })
  @IsString()
  @MinLength(1)
  userId: string;

  @ApiProperty({ example: 'clx789def012' })
  @IsString()
  @MinLength(1)
  rewardId: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(1)
  pointsSpent: number;
}
