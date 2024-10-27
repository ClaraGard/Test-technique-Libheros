import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedTokenFromDb1730033804721 implements MigrationInterface {
    name = 'RemovedTokenFromDb1730033804721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "token" text`);
    }

}
