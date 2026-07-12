import { Module } from '@nestjs/common';
import { ProductProfilesController } from './product-profiles.controller';
import { ProductProfilesService } from './product-profiles.service';

@Module({
  controllers: [ProductProfilesController],
  providers: [ProductProfilesService],
})
export class ProductProfilesModule {}
