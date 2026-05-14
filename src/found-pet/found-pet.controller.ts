import { Body, Controller, Post } from '@nestjs/common';
import { FoundPetService } from './found-pet.service';
import type { FoundPetDTO } from 'src/core/interfaces/FoundPetDTO.interface';

@Controller('found-pet')
export class FoundPetController {
    constructor(
        private readonly foundPetService: FoundPetService
    ){}

    @Post()
    async createFoundPet(@Body() foundPet: FoundPetDTO){
        const res = await this.foundPetService.createFoundPet(foundPet);
        const lat = foundPet.location.lat;
        const lon = foundPet.location.lon;
        this.foundPetService.getPetsByRadius(lat, lon, 500);
        return res;
    }

}
