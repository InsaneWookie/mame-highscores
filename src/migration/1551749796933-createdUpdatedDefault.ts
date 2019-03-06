import {MigrationInterface, QueryRunner} from "typeorm";

export class createdUpdatedDefault1551749796933 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table "alias" alter column "createdAt" set default now()`);
        await queryRunner.query(`alter table "alias" alter column "updatedAt" set default now()`);
        await queryRunner.query(`alter table "game" alter column "createdAt" set default now()`);
        await queryRunner.query(`alter table "game" alter column "updatedAt" set default now()`);
        await queryRunner.query(`alter table "gameplayed" alter column "createdAt" set default now()`);
        await queryRunner.query(`alter table "gameplayed" alter column "updatedAt" set default now()`);
        await queryRunner.query(`alter table "group" alter column "createdAt" set default now()`);
        await queryRunner.query(`alter table "group" alter column "updatedAt" set default now()`);
        await queryRunner.query(`alter table "machine" alter column "createdAt" set default now()`);
        await queryRunner.query(`alter table "machine" alter column "updatedAt" set default now()`);
        await queryRunner.query(`alter table "mapping" alter column "createdAt" set default now()`);
        await queryRunner.query(`alter table "mapping" alter column "updatedAt" set default now()`);
        await queryRunner.query(`alter table "rawscore" alter column "createdAt" set default now()`);
        await queryRunner.query(`alter table "rawscore" alter column "updatedAt" set default now()`);
        await queryRunner.query(`alter table "score" alter column "createdAt" set default now()`);
        await queryRunner.query(`alter table "score" alter column "updatedAt" set default now()`);
        await queryRunner.query(`alter table "user" alter column "createdAt" set default now()`);
        await queryRunner.query(`alter table "user" alter column "updatedAt" set default now()`);
        await queryRunner.query(`alter table "user_group" alter column "createdAt" set default now()`);
        await queryRunner.query(`alter table "user_group" alter column "updatedAt" set default now()`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`alter table "alias" alter column "createdAt" drop default`);
        await queryRunner.query(`alter table "alias" alter column "updatedAt" drop default`);
        await queryRunner.query(`alter table "game" alter column "createdAt" drop default`);
        await queryRunner.query(`alter table "game" alter column "updatedAt" drop default`);
        await queryRunner.query(`alter table "gameplayed" alter column "createdAt" drop default`);
        await queryRunner.query(`alter table "gameplayed" alter column "updatedAt" drop default`);
        await queryRunner.query(`alter table "group" alter column "createdAt" drop default`);
        await queryRunner.query(`alter table "group" alter column "updatedAt" drop default`);
        await queryRunner.query(`alter table "machine" alter column "createdAt" drop default`);
        await queryRunner.query(`alter table "machine" alter column "updatedAt" drop default`);
        await queryRunner.query(`alter table "mapping" alter column "createdAt" drop default`);
        await queryRunner.query(`alter table "mapping" alter column "updatedAt" drop default`);
        await queryRunner.query(`alter table "rawscore" alter column "createdAt" drop default`);
        await queryRunner.query(`alter table "rawscore" alter column "updatedAt" drop default`);
        await queryRunner.query(`alter table "score" alter column "createdAt" drop default`);
        await queryRunner.query(`alter table "score" alter column "updatedAt" drop default`);
        await queryRunner.query(`alter table "user" alter column "createdAt" drop default`);
        await queryRunner.query(`alter table "user" alter column "updatedAt" drop default`);
        await queryRunner.query(`alter table "user_group" alter column "createdAt" drop default`);
        await queryRunner.query(`alter table "user_group" alter column "updatedAt" drop default`);
    }

}
