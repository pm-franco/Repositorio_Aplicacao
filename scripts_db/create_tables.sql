-- Table: public.user_table

-- DROP TABLE IF EXISTS public.user_table;

CREATE TABLE IF NOT EXISTS public.user_table
(
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    role character varying(255) COLLATE pg_catalog."default",
    university character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT user_table_pkey PRIMARY KEY (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_table
    OWNER to postgres;
    
-- Table: public.artwork

CREATE SEQUENCE artwork_artwork_id_seq;
-- DROP TABLE IF EXISTS public.artwork;

CREATE TABLE IF NOT EXISTS public.artwork
(
    artwork_id bigint NOT NULL DEFAULT nextval('artwork_artwork_id_seq'::regclass),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    image bytea NOT NULL,
    author character varying COLLATE pg_catalog."default",
    art_type character varying COLLATE pg_catalog."default" NOT NULL,
    date date,
    source character varying COLLATE pg_catalog."default" NOT NULL,
    inv_number character varying COLLATE pg_catalog."default" NOT NULL,
    super_category character varying COLLATE pg_catalog."default" NOT NULL,
    category character varying COLLATE pg_catalog."default" NOT NULL,
    matter character varying COLLATE pg_catalog."default" NOT NULL,
    width double precision NOT NULL,
    height double precision NOT NULL,
    pixel_width double precision NOT NULL,
    pixel_height double precision NOT NULL,
    inserted_by character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT artwork_pkey PRIMARY KEY (artwork_id),
    CONSTRAINT artwork_inserted_by_fkey FOREIGN KEY (inserted_by)
        REFERENCES public.user_table (email) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.artwork
    OWNER to postgres;
-- Index: idx_artwork_inserted_by

CREATE INDEX IF NOT EXISTS idx_artwork_inserted_by
    ON public.artwork USING btree
    (inserted_by COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: idx_artwork_name


CREATE INDEX IF NOT EXISTS idx_artwork_name
    ON public.artwork USING btree
    (name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
    
    
-- Table: public.extra_info

-- DROP TABLE IF EXISTS public.extra_info;

CREATE SEQUENCE extra_info_extra_id_seq;

CREATE TABLE IF NOT EXISTS public.extra_info
(
    extra_id bigint NOT NULL DEFAULT nextval('extra_info_extra_id_seq'::regclass),
    artwork_id bigint NOT NULL,
    pdfs bytea[],
    links character varying[] COLLATE pg_catalog."default",
    info character varying[] COLLATE pg_catalog."default",
    CONSTRAINT extra_info_pkey PRIMARY KEY (extra_id),
    CONSTRAINT extra_info_artwork_id_fkey FOREIGN KEY (artwork_id)
        REFERENCES public.artwork (artwork_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.extra_info
    OWNER to postgres;
    
    
-- Table: public.zoom_point


CREATE SEQUENCE zoom_point_zoom_id_seq;
-- DROP TABLE IF EXISTS public.zoom_point;

CREATE TABLE IF NOT EXISTS public.zoom_point
(
    zoom_id bigint NOT NULL DEFAULT nextval('zoom_point_zoom_id_seq'::regclass),
    position_x double precision NOT NULL,
    position_y double precision NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    file_size real,
    image bytea NOT NULL,
    metric_width real NOT NULL,
    metric_height real NOT NULL,
    artwork_id bigint NOT NULL,
    layer_name character varying COLLATE pg_catalog."default" NOT NULL,
    author character varying COLLATE pg_catalog."default" NOT NULL,
    date date,
    technique character varying COLLATE pg_catalog."default",
    copyrights character varying[] COLLATE pg_catalog."default",
    materials character varying[] COLLATE pg_catalog."default",
    CONSTRAINT zoom_point_pkey PRIMARY KEY (zoom_id),
    CONSTRAINT zoom_point_artwork_id_fkey FOREIGN KEY (artwork_id)
        REFERENCES public.artwork (artwork_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.zoom_point
    OWNER to postgres;
-- Index: idx_zoom_point_layer

CREATE INDEX IF NOT EXISTS idx_zoom_point_layer
    ON public.zoom_point USING btree
    (layer_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
    
    
-- Table: public.equipment
CREATE SEQUENCE equipment_equip_id_seq;
-- DROP TABLE IF EXISTS public.equipment;

CREATE TABLE IF NOT EXISTS public.equipment
(
    equip_id bigint NOT NULL DEFAULT nextval('equipment_equip_id_seq'::regclass),
    zoom_point_id bigint NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    characteristics character varying[] COLLATE pg_catalog."default",
    licenses character varying[] COLLATE pg_catalog."default",
    CONSTRAINT equipment_pkey PRIMARY KEY (equip_id),
    CONSTRAINT equipment_zoom_point_id_fkey FOREIGN KEY (zoom_point_id)
        REFERENCES public.zoom_point (zoom_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.equipment
    OWNER to postgres;