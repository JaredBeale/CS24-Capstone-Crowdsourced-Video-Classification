--
-- PostgreSQL database dump
--

-- Dumped from database version 11.6 (Ubuntu 11.6-1.pgdg16.04+1)
-- Dumped by pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: labels; Type: TABLE; Schema: public;
--

CREATE TABLE "public"."labels" (
    "id" integer NOT NULL,
    "labeltitle" character varying(255) NOT NULL
);

--
-- Name: labels_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE "public"."labels_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE "public"."labels_id_seq" OWNED BY "public"."labels"."id";


--
-- Name: users; Type: TABLE; Schema: public;
--

CREATE TABLE "public"."users" (
    "id" integer NOT NULL,
    "username" character varying(255) NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE "public"."users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";


--
-- Name: videos; Type: TABLE; Schema: public;
--

CREATE TABLE "public"."videos" (
    "id" integer NOT NULL,
    "filetitle" character varying(255) NOT NULL
);


--
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE "public"."videos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: leagihugzrfqmo
--

ALTER SEQUENCE "public"."videos_id_seq" OWNED BY "public"."videos"."id";


--
-- Name: votes; Type: TABLE; Schema: public;
--

CREATE TABLE "public"."votes" (
    "id" integer NOT NULL,
    "userid" integer NOT NULL,
    "videoid" integer NOT NULL,
    "labelid" integer NOT NULL
);


--
-- Name: votes_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE "public"."votes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE "public"."votes_id_seq" OWNED BY "public"."votes"."id";


--
-- Name: labels id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY "public"."labels" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."labels_id_seq"'::"regclass");


--
-- Name: users id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");


--
-- Name: videos id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY "public"."videos" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."videos_id_seq"'::"regclass");


--
-- Name: votes id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY "public"."votes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."votes_id_seq"'::"regclass");


--
-- Name: labels labels_pkey; Type: CONSTRAINT; Schema: public; Owner: leagihugzrfqmo
--

ALTER TABLE ONLY "public"."labels"
    ADD CONSTRAINT "labels_pkey" PRIMARY KEY ("id");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: leagihugzrfqmo
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: leagihugzrfqmo
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");


--
-- Name: videos videos_filetitle_key; Type: CONSTRAINT; Schema: public; Owner: leagihugzrfqmo
--

ALTER TABLE ONLY "public"."videos"
    ADD CONSTRAINT "videos_filetitle_key" UNIQUE ("filetitle");


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: leagihugzrfqmo
--

ALTER TABLE ONLY "public"."videos"
    ADD CONSTRAINT "videos_pkey" PRIMARY KEY ("id");


--
-- Name: votes votes_labelid_userid_videoid_key; Type: CONSTRAINT; Schema: public; Owner: leagihugzrfqmo
--

ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_labelid_userid_videoid_key" UNIQUE ("labelid", "userid", "videoid");


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: leagihugzrfqmo
--

ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_pkey" PRIMARY KEY ("id");


--
-- Name: votes votes_labelid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: leagihugzrfqmo
--

ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_labelid_fkey" FOREIGN KEY ("labelid") REFERENCES "public"."labels"("id") ON DELETE CASCADE;


--
-- Name: votes votes_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: leagihugzrfqmo
--

ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE CASCADE;


--
-- Name: votes votes_videoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: leagihugzrfqmo
--

ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_videoid_fkey" FOREIGN KEY ("videoid") REFERENCES "public"."videos"("id") ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
-- (NOTE: manually altered to avoid "OWNER" statements specific to Heroku and to remove values for tables.)
-- (this file to be used in creation of testing database)

