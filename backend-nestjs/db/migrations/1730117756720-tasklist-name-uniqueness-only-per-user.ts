import { MigrationInterface, QueryRunner } from "typeorm";

export class TasklistNameUniquenessOnlyPerUser1730117756720 implements MigrationInterface {
    name = 'TasklistNameUniquenessOnlyPerUser1730117756720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "dueDate"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "dueDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_list" DROP CONSTRAINT "UQ_bf9e3d194e38d52701bf9604db5"`);
        await queryRunner.query(`ALTER TABLE "task_list" ADD CONSTRAINT "UQ_925388845964eb8a71a1c0b70dd" UNIQUE ("userId", "name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_list" DROP CONSTRAINT "UQ_925388845964eb8a71a1c0b70dd"`);
        await queryRunner.query(`ALTER TABLE "task_list" ADD CONSTRAINT "UQ_bf9e3d194e38d52701bf9604db5" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "dueDate"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "dueDate" TIMESTAMP NOT NULL`);
    }

}
