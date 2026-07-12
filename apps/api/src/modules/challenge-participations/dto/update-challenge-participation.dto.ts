import { PartialType } from '@nestjs/swagger';
import { CreateChallengeParticipationDto } from './create-challenge-participation.dto';

export class UpdateChallengeParticipationDto extends PartialType(CreateChallengeParticipationDto) {}
