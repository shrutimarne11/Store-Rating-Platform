import { Module } from '@nestjs/common';
import { StoreOwnerController } from './store-owner.controller';
import { StoreOwnerService } from './store-owner.service';
import { StoresModule } from '../stores/stores.module';
import { RatingsModule } from '../ratings/ratings.module';

@Module({
  imports: [StoresModule, RatingsModule],
  controllers: [StoreOwnerController],
  providers: [StoreOwnerService],
})
export class StoreOwnerModule {}
