import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentScoreDto } from './create-department-score.dto';

export class UpdateDepartmentScoreDto extends PartialType(CreateDepartmentScoreDto) {}
