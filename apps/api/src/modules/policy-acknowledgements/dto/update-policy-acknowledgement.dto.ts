import { PartialType } from '@nestjs/swagger';
import { CreatePolicyAcknowledgementDto } from './create-policy-acknowledgement.dto';

export class UpdatePolicyAcknowledgementDto extends PartialType(CreatePolicyAcknowledgementDto) {}
