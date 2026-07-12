import { Module } from '@nestjs/common';
import { ComplianceIssuesController } from './compliance-issues.controller';
import { ComplianceIssuesService } from './compliance-issues.service';

@Module({
  controllers: [ComplianceIssuesController],
  providers: [ComplianceIssuesService],
})
export class ComplianceIssuesModule {}
