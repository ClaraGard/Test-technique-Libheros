import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsCompletedToTasks1730055179018 implements MigrationInterface {
    name = 'AddIsCompletedToTasks1730055179018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "isCompleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "isCompleted"`);
    }

}
