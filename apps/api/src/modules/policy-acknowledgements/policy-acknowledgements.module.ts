import { Module } from '@nestjs/common';
import { PolicyAcknowledgementsController } from './policy-acknowledgements.controller';
import { PolicyAcknowledgementsService } from './policy-acknowledgements.service';

@Module({
  controllers: [PolicyAcknowledgementsController],
  providers: [PolicyAcknowledgementsService],
})
export class PolicyAcknowledgementsModule {}
