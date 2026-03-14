import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDB1773444998848 implements MigrationInterface {
    name = 'CreateDB1773444998848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lost_pet" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "species" character varying NOT NULL, "breed" character varying NOT NULL, "color" character varying NOT NULL, "size" character varying NOT NULL, "description" character varying NOT NULL, "photo_url" character varying NOT NULL, "owner_name" character varying NOT NULL, "owner_email" character varying NOT NULL, "owner_phone" character varying NOT NULL, "location" geometry(Point,4326) NOT NULL, "address" character varying NOT NULL, "lost_date" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e93154f3c554bba19e3515f1269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "owner_name"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "owner_email"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "owner_phone"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "owner_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "owner_email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "owner_phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "finder_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "finder_email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "finder_phone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "finder_phone"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "finder_email"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "finder_name"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "owner_phone"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "owner_email"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "owner_name"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "owner_phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "owner_email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "owner_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lost_pet" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "lost_pet"`);
    }

}
