import { Module } from '@nestjs/common';
import { CarbonTransactionsController } from './carbon-transactions.controller';
import { CarbonTransactionsService } from './carbon-transactions.service';

@Module({
  controllers: [CarbonTransactionsController],
  providers: [CarbonTransactionsService],
})
export class CarbonTransactionsModule {}
