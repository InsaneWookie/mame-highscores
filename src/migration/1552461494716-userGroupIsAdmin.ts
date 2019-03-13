import {MigrationInterface, QueryRunner} from "typeorm";

export class userGroupIsAdmin1552461494716 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_group" ADD COLUMN "is_admin" BOOLEAN NOT NULL DEFAULT false`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_group" DROP COLUMN "is_admin"`);
    }

}
