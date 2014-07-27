--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.4
-- Dumped by pg_dump version 9.3.4
-- Started on 2014-07-26 21:36:06 NZST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';

SET search_path = public, pg_catalog;

SET default_with_oids = false;

CREATE TABLE "user" (
    id serial PRIMARY KEY,
    username text,
    password text,
    email text,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);

CREATE TABLE alias (
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES "user" (id),
    name text,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


CREATE TABLE game (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    full_name text,
    has_mapping boolean DEFAULT FALSE,
    play_count integer DEFAULT 0,
    clone_of text,
    last_played timestamp without time zone,
    letter text,
    "order" text,
    sort text,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


CREATE TABLE rawscore (
    id serial PRIMARY KEY,
    game_id integer NOT NULL REFERENCES game (id),
    bytes text,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);


CREATE TABLE score (
    id serial PRIMARY KEY,
    game_id integer NOT NULL REFERENCES game (id),
    alias_id integer REFERENCES "alias" (id),
    name text,
    score text,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);

CREATE TABLE mapping (
    id serial PRIMARY KEY,
    game_id integer NOT NULL REFERENCES game (id),
    decoding json,
    "createdAt" timestamp without time zone,
    "updatedAt" timestamp without time zone
);





