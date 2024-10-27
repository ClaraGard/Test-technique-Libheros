import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUsersTable1730023011205 implements MigrationInterface {
    name = 'FixUsersTable1730023011205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_list" DROP CONSTRAINT "FK_d34f2d64706c6a8188a6446678b"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "token" character varying(255), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task_list" ADD CONSTRAINT "FK_d34f2d64706c6a8188a6446678b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_list" DROP CONSTRAINT "FK_d34f2d64706c6a8188a6446678b"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "task_list" ADD CONSTRAINT "FK_d34f2d64706c6a8188a6446678b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
