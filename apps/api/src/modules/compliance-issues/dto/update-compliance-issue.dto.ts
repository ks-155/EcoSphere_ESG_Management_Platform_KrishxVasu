import { PartialType } from '@nestjs/swagger';
import { CreateComplianceIssueDto } from './create-compliance-issue.dto';

export class UpdateComplianceIssueDto extends PartialType(CreateComplianceIssueDto) {}
