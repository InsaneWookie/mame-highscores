import {MigrationInterface, QueryRunner} from "typeorm";

export class passwordReset1565508832665 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN password_reset_token TEXT`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN password_reset_token`);
    }

}
