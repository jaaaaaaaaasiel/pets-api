import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFoundPet1773445770738 implements MigrationInterface {
    name = 'CreateFoundPet1773445770738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "found_pet" ("id" SERIAL NOT NULL, "species" character varying NOT NULL, "breed" character varying NOT NULL, "color" character varying NOT NULL, "size" character varying NOT NULL, "description" character varying NOT NULL, "photo_url" character varying NOT NULL, "finder_name" character varying NOT NULL, "finder_email" character varying NOT NULL, "finder_phone" character varying NOT NULL, "location" geometry(Point,4326) NOT NULL, "address" character varying NOT NULL, "lost_date" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_71a8770507298fc9e00d94f8236" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "finder_name"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "finder_email"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "finder_phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "finder_phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "finder_email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "finder_name" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "found_pet"`);
    }

}
