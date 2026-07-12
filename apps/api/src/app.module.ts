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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 100, ttl: 60000 }],
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    DepartmentsModule,
    CategoriesModule,
    EmissionFactorsModule,
    ProductProfilesModule,
    GoalsModule,
    PoliciesModule,
    BadgesModule,
    RewardsModule,
  ],
})
export class AppModule {}
