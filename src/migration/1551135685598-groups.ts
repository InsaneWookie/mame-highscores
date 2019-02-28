import { MigrationInterface, QueryRunner } from "typeorm";

export class groups1551135685598 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
        `CREATE TABLE "group" (
  id serial PRIMARY KEY,
  name VARCHAR,
  description VARCHAR,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone
)`
    );

    await queryRunner.query(
        `CREATE TABLE user_group (
  id serial PRIMARY KEY,
  group_id integer NOT NULL REFERENCES "group"(id),
  user_id integer NOT NULL REFERENCES "user"(id),
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone,
  UNIQUE (group_id, user_id)
)`
    );
    await queryRunner.query(
        `CREATE TABLE machine (
  id serial PRIMARY KEY,
  group_id integer NOT NULL REFERENCES "group"(id),
  api_key TEXT UNIQUE,
  secret_key TEXT,
  name TEXT,
  description TEXT,
  is_uploading_files BOOLEAN DEFAULT false NOT NULL, -- hack so we can allow only one file upload for a machine at a time
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone
)`
    );
    await queryRunner.query(
        `INSERT INTO "group" (name, description, "createdAt", "updatedAt") VALUES ('Default Group', 'Default group from migration', NOW(), NOW());`
    );
    await queryRunner.query(
        `INSERT INTO machine (group_id, name, description, "createdAt", "updatedAt") VALUES (1, 'Default Machine', 'Default machine from migration', NOW(), NOW());`
    );
    await queryRunner.query(
        `INSERT INTO user_group (group_id, user_id, "createdAt", "updatedAt") SELECT 1, id, NOW(), NOW() FROM "user";`
    );
    await queryRunner.query(
        `ALTER TABLE alias ADD COLUMN user_group_id integer ;`
    );
    await queryRunner.query(
        `UPDATE alias AS a
SET user_group_id = ug.id
FROM user_group ug
    WHERE a.user_id = ug.user_id
    AND ug.group_id = 1;`
    );
    await queryRunner.query(
        `ALTER TABLE alias ALTER COLUMN user_group_id SET NOT NULL;
ALTER TABLE alias ADD CONSTRAINT alias_user_group_id_fkey  foreign key (user_group_id) REFERENCES "user_group"(id);
ALTER TABLE alias DROP COLUMN user_id;`
    );
    await queryRunner.query(
        `ALTER TABLE "user" ADD COLUMN is_admin boolean DEFAULT false NOT NULL;`
    );
    await queryRunner.query(
        `ALTER TABLE "user" ADD COLUMN invite_code text DEFAULT NULL;`
    );
    await queryRunner.query(
        `CREATE UNIQUE INDEX unique_lower_username_idx ON "user" (LOWER(username));`
    );
    await queryRunner.query(
        `ALTER TABLE score ADD COLUMN machine_id integer REFERENCES machine(id);`
    );
    await queryRunner.query(
        `UPDATE score SET machine_id = 1;`
    );
    await queryRunner.query(
        `ALTER TABLE score ALTER COLUMN machine_id SET NOT NULL;`
    );
    await queryRunner.query(
        `ALTER TABLE rawscore ADD COLUMN machine_id integer REFERENCES machine(id);`
    );
    await queryRunner.query(
        `UPDATE rawscore SET machine_id = 1;`
    );
    await queryRunner.query(
        `ALTER TABLE rawscore ALTER COLUMN machine_id SET NOT NULL;`
    );
    await queryRunner.query(
      `TRUNCATE gameplayed`
    );
    await queryRunner.query(
        `ALTER TABLE gameplayed ADD COLUMN play_count integer NOT NULL DEFAULT 0;`
    );
    await queryRunner.query(
        `ALTER TABLE gameplayed ADD COLUMN machine_id integer NOT NULL REFERENCES machine(id);`
    );
    await queryRunner.query(
        `ALTER TABLE gameplayed ADD CONSTRAINT unique_game_id_machine_id UNIQUE (game_id, machine_id);`
    );
    await queryRunner.query(
        `INSERT INTO gameplayed (game_id, date_time, play_count, "createdAt", "updatedAt", machine_id)
SELECT id, last_played, play_count, now(), now(), 1 from game where last_played is not null;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
