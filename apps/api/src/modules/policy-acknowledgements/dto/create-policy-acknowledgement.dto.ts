import { IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePolicyAcknowledgementDto {
  @ApiProperty({ example: 'clxxxxxx' })
  @IsString()
  policyId: string;

  @ApiProperty({ example: 'clxxxxxx' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  accepted: boolean;
}
