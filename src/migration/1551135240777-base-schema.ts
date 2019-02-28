import { MigrationInterface, QueryRunner } from "typeorm";

export class baseSchema1551135240777 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {

    await queryRunner.query(
        `CREATE TABLE "user" (
                id serial PRIMARY KEY,
                username text,
                password text,
                email text,
                "createdAt" timestamp with time zone,
                "updatedAt" timestamp with time zone
            )`);
    await queryRunner.query(`CREATE TABLE alias (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES "user" (id),
    name text,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
)`);
    await queryRunner.query(`CREATE TABLE game (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    full_name text,
    has_mapping boolean DEFAULT FALSE,
    decoded_on timestamp with time zone,
    play_count integer NOT NULL DEFAULT 0,
    clone_of integer REFERENCES game (id),
    clone_of_name text,
    last_played timestamp with time zone,
    letter text,
    "order" text,
    sort text,
    year text,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
)`);
    await queryRunner.query(`CREATE TABLE rawscore (
    id serial PRIMARY KEY,
    game_id integer NOT NULL REFERENCES game (id),
    file_type text,
    bytes text,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
)`);
    await queryRunner.query(`CREATE TABLE score (
    id serial PRIMARY KEY,
    game_id integer NOT NULL REFERENCES game (id),
    alias_id integer REFERENCES "alias" (id),
    name text,
    score text,
    rank integer,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
)`);
    await queryRunner.query(`CREATE TABLE mapping (
    id serial PRIMARY KEY,
    game_id integer NOT NULL REFERENCES game (id),
    decoding json,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
)`);
    await queryRunner.query(`CREATE TABLE gameplayed (
  id serial PRIMARY KEY,
  game_id integer NOT NULL REFERENCES game (id),
  date_time timestamp with time zone NOT NULL DEFAULT NOW(),
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone
)`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
