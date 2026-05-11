import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { LostPetModule } from './lost-pet/lost-pet.module';
import { FoundPetModule } from './found-pet/found-pet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './core/db/data-source';
import { CacheService } from './cache/cache.service';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [EmailModule, LostPetModule, FoundPetModule, TypeOrmModule.forRoot(dataSourceOptions), CacheModule],
  controllers: [AppController],
  providers: [AppService, CacheService],
})
export class AppModule {}
