import { Module } from '@nestjs/common';
import { ChallengeParticipationsController } from './challenge-participations.controller';
import { ChallengeParticipationsService } from './challenge-participations.service';

@Module({
  controllers: [ChallengeParticipationsController],
  providers: [ChallengeParticipationsService],
})
export class ChallengeParticipationsModule {}
