import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeParticipationDto } from './create-employee-participation.dto';

export class UpdateEmployeeParticipationDto extends PartialType(CreateEmployeeParticipationDto) {}
