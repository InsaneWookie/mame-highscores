
-- CREATE USER "mame-highscores" WITH PASSWORD 'mame-highscores';
-- CREATE DATABASE "mame-highscores" WITH OWNER "mame-highscores";


CREATE TABLE scores (
    id        	SERIAL,
    user_id		integer, --TODO
    game_id		integer, --TODO
    game_name 	text, --TODO: this will be removed and replaced with game_id
    name        varchar(128) NOT NULL DEFAULT '',
   	score       varchar(128) NOT NULL DEFAULT '0',
    date_time   timestamp DEFAULT NOW()
);
