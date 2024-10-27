import { MigrationInterface, QueryRunner } from "typeorm";

export class TokenStringToText1730033435378 implements MigrationInterface {
    name = 'TokenStringToText1730033435378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "token" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "token" character varying(255)`);
    }

}
