import { PartialType } from '@nestjs/swagger';
import { CreateCarbonTransactionDto } from './create-carbon-transaction.dto';

export class UpdateCarbonTransactionDto extends PartialType(CreateCarbonTransactionDto) {}
