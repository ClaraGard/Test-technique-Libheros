import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreationDateToTask1730152997066 implements MigrationInterface {
    name = 'AddCreationDateToTask1730152997066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "creationDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "creationDate"`);
    }

}
