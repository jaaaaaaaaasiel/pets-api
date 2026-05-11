import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/cache/cache.service';
import { logger } from 'src/config/logger';
import { FoundPet } from 'src/core/db/entities/found-pet.entity';
import { LostPet } from 'src/core/db/entities/lost-pet.entity';
import { EmailOptions } from 'src/core/interfaces/EmailOptions.interface';
import { FoundPetDTO } from 'src/core/interfaces/FoundPetDTO.interface';
import { generateEmailTemplate } from 'src/email/email-template.template';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';

const CACHE_KEY_ALL_FOUND_PETS = 'found_pet:all';

@Injectable()
export class FoundPetService {
    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        @InjectRepository(FoundPet)
        private readonly foudPetRepository: Repository<FoundPet>,
        private readonly emailService: EmailService,
        private readonly cacheService: CacheService
    ){}
    async createFoundPet(foundPet: FoundPetDTO): Promise<Boolean>{
        const newPet = this.foudPetRepository.create({
            species: foundPet.species,
            breed: foundPet.breed,
            color: foundPet.color,
            size: foundPet.size,
            description: foundPet.description,
            photo_url: foundPet.photo_url,
            finder_name: foundPet.finder_name,
            finder_email: foundPet.finder_email,
            finder_phone: foundPet.finder_phone,
            location: {
                type: 'Point',
                coordinates: [foundPet.location.lon, foundPet.location.lat]
            },
            address: foundPet.address
        });

        await this.foudPetRepository.save(newPet);
        const lostPets: LostPet[] = await this.lostPetRepository.query(`
            SELECT *,
                ST_X(location::geometry) AS lon,
                ST_Y(location::geometry) AS lat,
                ST_Distance(
                    location,
                    ST_SetSRID(ST_MakePoint(${foundPet.location.lon}, ${foundPet.location.lat}), 4326)::geography
                ) AS distance
                FROM lost_pet
                WHERE is_active = true
                AND ST_DWithin(
                    location,
                    ST_SetSRID(ST_MakePoint(${foundPet.location.lon}, ${foundPet.location.lat}), 4326)::geography,
                    500
                )
            ORDER BY distance ASC
        `) as LostPet[];

        if (lostPets.length == 0) {
            return false;
        }

        for (const lostPet of lostPets) {
            const template = generateEmailTemplate(newPet, lostPet);
            const options: EmailOptions = {
                to: lostPet.owner_email,
                subject: '¡Encontramos una mascota cerca de donde perdiste a la tuya!',
                html: template
            };
            const res = await this.emailService.sendEmail(options);
            return res;
        }
        
        return true;
    }

    async getFoundPets(): Promise<FoundPet[]> {
        try {
            logger.info('[FoundPetService] Consultando mascotas en cahché');
            const data = await this.cacheService.get<FoundPet[]>(CACHE_KEY_ALL_FOUND_PETS);
            if (data && data.length > 0) {
                logger.info(`[FoundPetService] Se encontraron ${data.length} mascotas en caché`);
                return data;
            }
            const foundPets = await this.foudPetRepository.find();
            logger.info(`[FoundPetService] Se obtuvieron ${foundPets.length} mascotas`);
            const foundPetsString = JSON.stringify(foundPets);
            await this.cacheService.set(CACHE_KEY_ALL_FOUND_PETS, foundPetsString);
            logger.info('[FoundPetService] Guardando mascotas en el cache');
            return foundPets;
        } catch (error) {
            logger.info('Error al traer las macotas');
            logger.error(error);
            return [];
        }
    }

    async getPetsByRadius(lat, lon, radiusInMeters): Promise<LostPet[]> {
        try {
            console.log(`Buscando mascotas en ${lat}, ${lon}, en un radio de ${radiusInMeters} metros`)
            const lostPets =  await this.lostPetRepository
                            .createQueryBuilder('lost_pet')
                            .where(`
                                    ST_DWithin(
                                        lost_pet.location::geography,
                                        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                                        :raidus
                                    )`,
                                    {lon, lat, radius: radiusInMeters}
                                )
                            .andWhere(`lost_pet.is_active = true`)
                            .getMany();
            console.log(`Se encontraron ${lostPets.length} mascotas activas en un radio de ${radiusInMeters} metros`);
            return lostPets;

        } catch (error) {
            console.log(`No se buscaron mascotas por radio debido a :: ${error}`)
            return [];
        }
    }
}
