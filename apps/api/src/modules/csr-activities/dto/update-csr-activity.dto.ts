import { PartialType } from '@nestjs/swagger';
import { CreateCsrActivityDto } from './create-csr-activity.dto';

export class UpdateCsrActivityDto extends PartialType(CreateCsrActivityDto) {}
