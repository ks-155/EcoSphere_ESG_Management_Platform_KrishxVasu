import { Module } from '@nestjs/common';
import { UserBadgesController } from './user-badges.controller';
import { UserBadgesService } from './user-badges.service';

@Module({
  controllers: [UserBadgesController],
  providers: [UserBadgesService],
})
export class UserBadgesModule {}
