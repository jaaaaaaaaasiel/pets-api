import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { Repository } from 'typeorm';
import { LostPetDTO } from 'src/core/interfaces/LostPetDTO.interface';
import { logger } from 'src/config/logger';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ALL_LOST_PETS = 'lost_pet:all'

@Injectable()
export class LostPetService {
    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly cacheService: CacheService
    ){ }
    
    async createLostPet(lostPet: LostPetDTO): Promise<Boolean>{
        try {
            const newPet = this.lostPetRepository.create({
            name: lostPet.name,
            species: lostPet.species,
            breed: lostPet.breed,
            color: lostPet.color,
            size: lostPet.size,
            description: lostPet.description,
            photo_url: lostPet.photo_url,
            owner_name: lostPet.owner_name,
            owner_email: lostPet.owner_email,
            owner_phone: lostPet.owner_phone,
            location: {
                type: 'Point',
                coordinates: [lostPet.location.lon, lostPet.location.lat]
            
            },
            address: lostPet.address
        });

        await this.lostPetRepository.save(newPet);
        return true;
        } catch (error) {
            return false;
        }
        
    }

        async getLostPets(): Promise<LostPet[]> {
            try {
                logger.info('[LostPetService] Consultando mascotas en cahché');
                const data = await this.cacheService.get<LostPet[]>(CACHE_KEY_ALL_LOST_PETS);
                if (data && data.length > 0) {
                    logger.info(`[LostPetService] Se encontraron ${data.length} mascotas en caché`);
                    return data;
                }
                const foundPets = await this.lostPetRepository.find();
                logger.info(`[LostPetService] Se obtuvieron ${foundPets.length} mascotas`);
                const foundPetsString = JSON.stringify(foundPets);
                await this.cacheService.set(CACHE_KEY_ALL_LOST_PETS, foundPetsString);
                logger.info('[LostPetService] Guardando mascotas en el cache');
                return foundPets;
            } catch (error) {
                logger.info('Error al traer las macotas');
                logger.error(error);
                return [];
            }
        }
}
