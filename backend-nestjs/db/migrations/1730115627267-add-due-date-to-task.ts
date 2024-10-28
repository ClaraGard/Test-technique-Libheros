import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDueDateToTask1730115627267 implements MigrationInterface {
    name = 'AddDueDateToTask1730115627267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "dueDate" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "dueDate"`);
    }

}
