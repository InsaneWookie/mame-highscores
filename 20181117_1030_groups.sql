BEGIN;

CREATE TABLE "group" (
  id serial PRIMARY KEY,
  name VARCHAR,
  description VARCHAR,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone
);


CREATE TABLE user_group (
  id serial PRIMARY KEY,
  group_id integer NOT NULL REFERENCES "group"(id),
  user_id integer NOT NULL REFERENCES "user"(id),
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone,
  UNIQUE (group_id, user_id)
);


CREATE TABLE machine (
  id serial PRIMARY KEY,
  group_id integer NOT NULL REFERENCES "group"(id),
  api_key TEXT UNIQUE,
  secret_key TEXT,
  name TEXT,
  description TEXT,
  is_uploading_files BOOLEAN DEFAULT false NOT NULL, -- hack so we can allow only one file upload for a machine at a time
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone
);

-- need a default group for all the users to migrate too
INSERT INTO "group" (name, description, "createdAt", "updatedAt") VALUES ('Default Group', 'Default group from migration', NOW(), NOW());


--need to insert a default machine to migrate all the scores to
INSERT INTO machine (group_id, name, description, "createdAt", "updatedAt") VALUES (1, 'Default Machine', 'Default machine from migration', NOW(), NOW());

INSERT INTO user_group (group_id, user_id, "createdAt", "updatedAt") SELECT 1, id, NOW(), NOW() FROM "user";


-- think alias needs to be tied to a user_group record (ie you can have different aliases per group)
ALTER TABLE alias ADD COLUMN user_group_id integer ;

UPDATE alias AS a
SET user_group_id = ug.id
FROM user_group ug
    WHERE a.user_id = ug.user_id
    AND ug.group_id = 1;


ALTER TABLE alias ALTER COLUMN user_group_id SET NOT NULL;
ALTER TABLE alias ADD CONSTRAINT alias_user_group_id_fkey  foreign key (user_group_id) REFERENCES "user_group"(id);
ALTER TABLE alias DROP COLUMN user_id;


ALTER TABLE "user" ADD COLUMN is_admin boolean DEFAULT false NOT NULL;
ALTER TABLE "user" ADD COLUMN invite_code text DEFAULT NULL;
-- ALTER TABLE "user" ADD CONSTRAINT unique_username UNIQUE (username);
CREATE UNIQUE INDEX unique_lower_username_idx ON "user" (LOWER(username));
-- ALTER TABLE "user" ALTER COLUMN username SET NOT NULL;

-- need a machine id on the score so we know what machine a score is created from
ALTER TABLE score ADD COLUMN machine_id integer REFERENCES machine(id);
UPDATE score SET machine_id = 1;
ALTER TABLE score ALTER COLUMN machine_id SET NOT NULL;


ALTER TABLE rawscore ADD COLUMN machine_id integer REFERENCES machine(id);
UPDATE rawscore SET machine_id = 1;
ALTER TABLE rawscore ALTER COLUMN machine_id SET NOT NULL;

TRUNCATE gameplayed;
ALTER TABLE gameplayed ADD COLUMN play_count integer NOT NULL DEFAULT 0;
ALTER TABLE gameplayed ADD COLUMN machine_id integer NOT NULL REFERENCES machine(id);

ALTER TABLE gameplayed ADD CONSTRAINT unique_game_id_machine_id UNIQUE (game_id, machine_id);

-- only allow one gameplayed record per machine per game
INSERT INTO gameplayed (game_id, date_time, play_count, "createdAt", "updatedAt", machine_id)
SELECT id, last_played, play_count, now(), now(), 1 from game where last_played is not null;


COMMIT;
