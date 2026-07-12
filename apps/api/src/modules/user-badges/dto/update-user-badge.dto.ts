import { PartialType } from '@nestjs/swagger';
import { CreateUserBadgeDto } from './create-user-badge.dto';

export class UpdateUserBadgeDto extends PartialType(CreateUserBadgeDto) {}
