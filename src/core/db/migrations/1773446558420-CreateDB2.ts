import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDB21773446558420 implements MigrationInterface {
    name = 'CreateDB21773446558420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lost_pet" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "species" character varying NOT NULL, "breed" character varying NOT NULL, "color" character varying NOT NULL, "size" character varying NOT NULL, "description" character varying NOT NULL, "photo_url" character varying NOT NULL, "owner_name" character varying NOT NULL, "owner_email" character varying NOT NULL, "owner_phone" character varying NOT NULL, "location" geometry(Point,4326) NOT NULL, "address" character varying NOT NULL, "lost_date" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e93154f3c554bba19e3515f1269" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "lost_pet"`);
    }

}
