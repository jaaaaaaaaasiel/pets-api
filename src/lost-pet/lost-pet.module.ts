import { Module } from '@nestjs/common';
import { LostPetService } from './lost-pet.service';
import { LostPetController } from './lost-pet.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports:[EmailModule, TypeOrmModule.forFeature([LostPet])],
  providers: [LostPetService, CacheService],
  controllers: [LostPetController]
  
})
export class LostPetModule {}
