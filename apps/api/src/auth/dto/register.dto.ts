import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@ecosphere.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'org-id' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({ example: 'VIEWER', enum: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'VIEWER'] })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: 'dept-id' })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional({ example: 'IT' })
  @IsOptional()
  @IsString()
  department?: string;
}
