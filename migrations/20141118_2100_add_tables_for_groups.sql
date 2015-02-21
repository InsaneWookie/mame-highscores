BEGIN;

CREATE TABLE "group" (
  id serial PRIMARY KEY,
  name VARCHAR,
  description VARCHAR,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone
);

-- need a default group for all the users to migrate too
INSERT INTO "group" (name, description, "createdAt", "updatedAt") VALUES ('Default Group', 'Default group from migration', NOW(), NOW());

-- user

CREATE TABLE user_group (
  id serial PRIMARY KEY,
  group_id integer NOT NULL REFERENCES "group"(id),
  user_id integer NOT NULL REFERENCES "user"(id),
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone
);


INSERT INTO user_group (group_id, user_id, "createdAt", "updatedAt") SELECT 1, id, NOW(), NOW() FROM "user";

CREATE TABLE machine (
  id serial PRIMARY KEY,
  api_key TEXT UNIQUE,
  secret_key TEXT,
  name TEXT,
  description TEXT,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone
);

--need to insert a default machine to migrate all the scores to
-- TODO: probably only need to insert default machine if there are any scores

INSERT INTO machine (name, description, "createdAt", "updatedAt") VALUES ('Default Machine', 'Default machine from migration', NOW(), NOW());


-- a user is assigned an alias on a machine
-- this allows multiple users to have the same alias but not on the same machine
-- this also means that the user needs to add the same alias to every machine they want to use (assuming its not
-- already taken)
-- TODO: unique constraint on user_id, machine_id, alias
CREATE TABLE user_machine (
  id serial PRIMARY KEY,
  group_id integer,
  user_id integer,
  machine_id integer,
  alias varchar,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone
);

-- we are bascally converting the alias table into this with some new columns
INSERT INTO user_machine (user_id, group_id, machine_id, alias, "createdAt", "updatedAt")
SELECT user_id, 1, 1, name, NOW(), NOW() FROM alias;

ALTER TABLE "user" ADD COLUMN is_admin boolean DEFAULT false NOT NULL;

-- need a machine id on the score so we know what machine a score is for
ALTER TABLE score ADD COLUMN machine_id integer REFERENCES machine(id);
UPDATE score SET machine_id = 1;

-- convert the alias id into a var char as we are useding the name of the alias as the id now
ALTER TABLE score DROP CONSTRAINT score_alias_id_fkey;
ALTER TABLE score ADD COLUMN alias VARCHAR;

ALTER TABLE score DROP COLUMN rank;


ALTER TABLE rawscore ADD COLUMN machine_id integer REFERENCES machine(id);
UPDATE rawscore SET machine_id = 1;

ALTER TABLE gameplayed ADD COLUMN machine_id integer REFERENCES machine(id);
UPDATE gameplayed SET machine_id = 1;



UPDATE score s 
SET alias = a.name
FROM alias a
WHERE a.id = s.alias_id;

ALTER TABLE score DROP COLUMN alias_id;
-- ALTER TABLE score RENAME COLUMN alias TO alias_id

-- alias is no longer needed as the user_machine takes care of that
DROP TABLE alias;

COMMIT;


--SELECT * FROM user_machine um, score s
--WHERE
--um.group_id = 1 AND
--um.user_id = 5 AND
--um.machine_id = s.machine_id AND
--um.alias = s.alias
