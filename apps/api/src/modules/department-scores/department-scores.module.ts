import { Module } from '@nestjs/common';
import { DepartmentScoresController } from './department-scores.controller';
import { DepartmentScoresService } from './department-scores.service';

@Module({
  controllers: [DepartmentScoresController],
  providers: [DepartmentScoresService],
})
export class DepartmentScoresModule {}
