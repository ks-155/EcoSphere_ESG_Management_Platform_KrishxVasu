import { Module } from '@nestjs/common';
import { CsrActivitiesController } from './csr-activities.controller';
import { CsrActivitiesService } from './csr-activities.service';

@Module({
  controllers: [CsrActivitiesController],
  providers: [CsrActivitiesService],
})
export class CsrActivitiesModule {}
