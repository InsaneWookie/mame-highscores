
-- CREATE USER "mame-highscores" WITH PASSWORD 'mame-highscores';
-- CREATE DATABASE "mame-highscores" WITH OWNER "mame-highscores";


CREATE TABLE scores (
    id        	SERIAL,
    userid		integer, --TODO
    name        varchar(128) NOT NULL DEFAULT '',
   	score       varchar(128) NOT NULL DEFAULT '0',
    date_time   timestamp DEFAULT NOW()
);
