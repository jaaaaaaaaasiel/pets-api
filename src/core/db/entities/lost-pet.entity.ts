import { PetSize } from "src/core/enums/PetSize.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Point } from "typeorm";

@Entity('lost_pet')
export class LostPet {
    @PrimaryGeneratedColumn()
    id!: number
    @Column()
    name: string
    @Column()
    species: string
    @Column()
    breed: string
    @Column()
    color: string
    @Column({type: 'varchar'})
    size: PetSize
    @Column()
    description: string
    @Column()
    photo_url: string
    @Column()
    owner_name: string
    @Column()
    owner_email: string
    @Column()
    owner_phone: string
    @Column({type:'geometry', spatialFeatureType:'Point', srid: 4326})
    location: Point
    @Column()
    address: string
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    lost_date: Date
    @CreateDateColumn()
    created_at: Date
    @UpdateDateColumn()
    updated_at: Date

}