import {MigrationInterface, QueryRunner} from "typeorm";

export class groupInviteCode1552191852308 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "group" ADD COLUMN invite_code TEXT UNIQUE `);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN invite_code`);
    }

}
