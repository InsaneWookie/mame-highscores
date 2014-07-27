--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.4
-- Dumped by pg_dump version 9.3.4
-- Started on 2014-07-27 11:16:51 NZST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

DROP DATABASE "mame-highscores-sails";
--
-- TOC entry 2016 (class 1262 OID 31084)
-- Name: mame-highscores-sails; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "mame-highscores-sails" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE "mame-highscores-sails" OWNER TO postgres;

\connect "mame-highscores-sails"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 8 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2017 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 182 (class 3079 OID 11787)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2019 (class 0 OID 0)
-- Dependencies: 182
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 173 (class 1259 OID 31935)
-- Name: alias; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE alias (
    name text,
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    user_id integer
);


ALTER TABLE public.alias OWNER TO postgres;

--
-- TOC entry 172 (class 1259 OID 31933)
-- Name: alias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE alias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.alias_id_seq OWNER TO postgres;

--
-- TOC entry 2020 (class 0 OID 0)
-- Dependencies: 172
-- Name: alias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE alias_id_seq OWNED BY alias.id;


--
-- TOC entry 175 (class 1259 OID 31946)
-- Name: game; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE game (
    name text,
    full_name text,
    has_mapping boolean,
    play_count integer,
    clone_of text,
    last_played timestamp with time zone,
    letter text,
    "order" text,
    sort text,
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public.game OWNER TO postgres;

--
-- TOC entry 174 (class 1259 OID 31944)
-- Name: game_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE game_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_id_seq OWNER TO postgres;

--
-- TOC entry 2021 (class 0 OID 0)
-- Dependencies: 174
-- Name: game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE game_id_seq OWNED BY game.id;


--
-- TOC entry 177 (class 1259 OID 31957)
-- Name: rawscore; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE rawscore (
    bytes text,
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    game_id integer
);


ALTER TABLE public.rawscore OWNER TO postgres;

--
-- TOC entry 176 (class 1259 OID 31955)
-- Name: rawscore_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE rawscore_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rawscore_id_seq OWNER TO postgres;

--
-- TOC entry 2022 (class 0 OID 0)
-- Dependencies: 176
-- Name: rawscore_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE rawscore_id_seq OWNED BY rawscore.id;


--
-- TOC entry 179 (class 1259 OID 31968)
-- Name: score; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE score (
    name text,
    score text,
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    game_id integer,
    alias_id integer
);


ALTER TABLE public.score OWNER TO postgres;

--
-- TOC entry 178 (class 1259 OID 31966)
-- Name: score_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE score_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.score_id_seq OWNER TO postgres;

--
-- TOC entry 2023 (class 0 OID 0)
-- Dependencies: 178
-- Name: score_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE score_id_seq OWNED BY score.id;


--
-- TOC entry 181 (class 1259 OID 31979)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "user" (
    username text,
    password text,
    email text,
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 180 (class 1259 OID 31977)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 2024 (class 0 OID 0)
-- Dependencies: 180
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE user_id_seq OWNED BY "user".id;


--
-- TOC entry 1890 (class 2604 OID 31938)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY alias ALTER COLUMN id SET DEFAULT nextval('alias_id_seq'::regclass);


--
-- TOC entry 1891 (class 2604 OID 31949)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY game ALTER COLUMN id SET DEFAULT nextval('game_id_seq'::regclass);


--
-- TOC entry 1892 (class 2604 OID 31960)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY rawscore ALTER COLUMN id SET DEFAULT nextval('rawscore_id_seq'::regclass);


--
-- TOC entry 1893 (class 2604 OID 31971)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY score ALTER COLUMN id SET DEFAULT nextval('score_id_seq'::regclass);


--
-- TOC entry 1894 (class 2604 OID 31982)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "user" ALTER COLUMN id SET DEFAULT nextval('user_id_seq'::regclass);


--
-- TOC entry 1896 (class 2606 OID 31943)
-- Name: alias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY alias
    ADD CONSTRAINT alias_pkey PRIMARY KEY (id);


--
-- TOC entry 1898 (class 2606 OID 31954)
-- Name: game_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY game
    ADD CONSTRAINT game_pkey PRIMARY KEY (id);


--
-- TOC entry 1900 (class 2606 OID 31965)
-- Name: rawscore_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY rawscore
    ADD CONSTRAINT rawscore_pkey PRIMARY KEY (id);


--
-- TOC entry 1902 (class 2606 OID 31976)
-- Name: score_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY score
    ADD CONSTRAINT score_pkey PRIMARY KEY (id);


--
-- TOC entry 1904 (class 2606 OID 31987)
-- Name: user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 2018 (class 0 OID 0)
-- Dependencies: 8
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2014-07-27 11:16:51 NZST

--
-- PostgreSQL database dump complete
--

