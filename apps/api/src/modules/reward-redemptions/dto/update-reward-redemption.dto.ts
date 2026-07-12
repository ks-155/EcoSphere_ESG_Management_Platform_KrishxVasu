import { PartialType } from '@nestjs/swagger';
import { CreateRewardRedemptionDto } from './create-reward-redemption.dto';

export class UpdateRewardRedemptionDto extends PartialType(CreateRewardRedemptionDto) {}
