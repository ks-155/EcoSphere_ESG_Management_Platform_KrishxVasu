import { Module } from '@nestjs/common';
import { EmployeeParticipationsController } from './employee-participations.controller';
import { EmployeeParticipationsService } from './employee-participations.service';

@Module({
  controllers: [EmployeeParticipationsController],
  providers: [EmployeeParticipationsService],
})
export class EmployeeParticipationsModule {}
