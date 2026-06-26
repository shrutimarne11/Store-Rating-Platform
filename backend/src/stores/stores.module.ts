import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { StoresService } from './stores.service';
import { UserStoresController } from './user-stores.controller';
import { RatingsModule } from '../ratings/ratings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), RatingsModule],
  controllers: [UserStoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
