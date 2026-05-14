import { Module } from '@nestjs/common';
import { FoundPetService } from './found-pet.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/db/entities/found-pet.entity';
import { FoundPetController } from './found-pet.controller';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports:[EmailModule, TypeOrmModule.forFeature([FoundPet, LostPet])],
  providers: [FoundPetService, CacheService],
  controllers: [FoundPetController]
})
export class FoundPetModule {}
