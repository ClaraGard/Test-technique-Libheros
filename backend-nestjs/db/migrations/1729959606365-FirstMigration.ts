import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1729959606365 implements MigrationInterface {
    name = 'FirstMigration1729959606365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "shortDescription" character varying NOT NULL, "longDescription" text NOT NULL, "taskListId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_47fc40cc98de35bf7aaaaaeeac" ON "task" ("taskListId") `);
        await queryRunner.query(`CREATE TABLE "task_list" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "UQ_bf9e3d194e38d52701bf9604db5" UNIQUE ("name"), CONSTRAINT "PK_e9f70d01f59395c1dfdc633ae37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d34f2d64706c6a8188a6446678" ON "task_list" ("userId") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "token" character varying(255), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_47fc40cc98de35bf7aaaaaeeac5" FOREIGN KEY ("taskListId") REFERENCES "task_list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_list" ADD CONSTRAINT "FK_d34f2d64706c6a8188a6446678b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_list" DROP CONSTRAINT "FK_d34f2d64706c6a8188a6446678b"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_47fc40cc98de35bf7aaaaaeeac5"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d34f2d64706c6a8188a6446678"`);
        await queryRunner.query(`DROP TABLE "task_list"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47fc40cc98de35bf7aaaaaeeac"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
