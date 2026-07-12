import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { EmissionFactorsModule } from './modules/emission-factors/emission-factors.module';
import { ProductProfilesModule } from './modules/product-profiles/product-profiles.module';
import { GoalsModule } from './modules/goals/goals.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { BadgesModule } from './modules/badges/badges.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { ChallengeParticipationsModule } from './modules/challenge-participations/challenge-participations.module';
import { PolicyAcknowledgementsModule } from './modules/policy-acknowledgements/policy-acknowledgements.module';
import { AuditsModule } from './modules/audits/audits.module';
import { ComplianceIssuesModule } from './modules/compliance-issues/compliance-issues.module';
import { UserBadgesModule } from './modules/user-badges/user-badges.module';
import { RewardRedemptionsModule } from './modules/reward-redemptions/reward-redemptions.module';
import { DepartmentScoresModule } from './modules/department-scores/department-scores.module';
import { CarbonTransactionsModule } from './modules/carbon-transactions/carbon-transactions.module';
import { CsrActivitiesModule } from './modules/csr-activities/csr-activities.module';
import { EmployeeParticipationsModule } from './modules/employee-participations/employee-participations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 100, ttl: 60000 }],
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    OrganizationModule,
    CarbonTransactionsModule,
    CsrActivitiesModule,
    EmployeeParticipationsModule,
    NotificationsModule,
    DepartmentsModule,
    CategoriesModule,
    EmissionFactorsModule,
    ProductProfilesModule,
    GoalsModule,
    PoliciesModule,
    BadgesModule,
    RewardsModule,
    ChallengesModule,
    ChallengeParticipationsModule,
    PolicyAcknowledgementsModule,
    AuditsModule,
    ComplianceIssuesModule,
    UserBadgesModule,
    RewardRedemptionsModule,
    DepartmentScoresModule,
    DashboardModule,
  ],
})
export class AppModule {}
