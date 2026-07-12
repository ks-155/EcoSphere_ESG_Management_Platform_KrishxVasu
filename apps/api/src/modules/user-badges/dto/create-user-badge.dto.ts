import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserBadgeDto {
  @ApiProperty({ example: 'clx123abc456' })
  @IsString()
  @MinLength(1)
  userId: string;

  @ApiProperty({ example: 'clx789def012' })
  @IsString()
  @MinLength(1)
  badgeId: string;
}
