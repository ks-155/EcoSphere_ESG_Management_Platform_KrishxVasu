import { Module } from '@nestjs/common';
import { RewardRedemptionsController } from './reward-redemptions.controller';
import { RewardRedemptionsService } from './reward-redemptions.service';

@Module({
  controllers: [RewardRedemptionsController],
  providers: [RewardRedemptionsService],
})
export class RewardRedemptionsModule {}
