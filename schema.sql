
-- CREATE USER "mame-highscores" WITH PASSWORD 'mame-highscores';
-- CREATE DATABASE "mame-highscores" WITH OWNER "mame-highscores";

/*
DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id 		SERIAL PRIMARY KEY ,
	username varchar(128) NOT NULL,
	password varchar(512) NOT NULL,
	initials varchar(128), --probably want to allow more than one

);
*/
DROP TABLE IF EXISTS games CASCADE;
CREATE TABLE games (
	-- id 			SERIAL,
	game_id		varchar(64) PRIMARY KEY, --make this the primary key
	game_name 	varchar(512),
	has_mapping	boolean DEFAULT true NOT NULL
);


DROP TABLE IF EXISTS scores CASCADE;
CREATE TABLE scores (
    id        	SERIAL PRIMARY KEY ,
--    user_id		integer REFERENCES users(id) , --TODO
    game_id		varchar(64) REFERENCES games(game_id), --TODO
    --game_name 	text, --TODO: this will be removed and replaced with game_id
    name        varchar(128) NOT NULL DEFAULT '',
   	score       varchar(128) NOT NULL DEFAULT '0',
   	extra_data  json, --maybe hstore will work fine
    date_time   timestamp DEFAULT NOW()
);
