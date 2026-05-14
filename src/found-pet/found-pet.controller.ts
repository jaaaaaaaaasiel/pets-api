import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoundPetService } from './found-pet.service';
import type { FoundPetDTO } from 'src/core/interfaces/FoundPetDTO.interface';

@Controller('found-pet')
export class FoundPetController {
    constructor(
        private readonly foundPetService: FoundPetService
    ){}

    @Post()
    async createFoundPet(@Body() foundPet: FoundPetDTO){
        const email = await this.foundPetService.createFoundPet(foundPet);
        const { lat, lon } = foundPet.location;
        const nearbyPets = await this.foundPetService.getPetsByRadius(lat, lon, 500);

        return {email, nearbyPets};
    }

    @Get()
    async getFoundPet(){
        const res = this.foundPetService.getFoundPets();
        return res;
    }

}
