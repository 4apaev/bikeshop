create extension if not exists pgcrypto;

DO $$
begin
  if not exists (select 1 from pg_type where typname = 'bike_kind') then
    create type bike_kind as enum (
      'city',
      'road',
      'mountain',
      'cruiser',
      'electric',
      'folding',
      'fixie'
    );
  end if;
end$$;

create table if not exists bikes (
    id  serial primary key,
  kind  bike_kind,
 "desc" varchar(255),
  free  boolean not null default FALSE
);

create table if not exists users (
    id  serial primary key,
  mail varchar not null unique,
  name varchar not null,
  pass varchar not null
);

create table if not exists users_bikes (
       uid       int not null references users(id) on delete cascade,
       bid       int not null references bikes(id) on delete cascade,
   checkin timestamp not null default current_timestamp,
  checkout timestamp not null default current_timestamp + interval '1 week',
  constraint ubid_pk primary key (uid, bid)
);

create table if not exists access_tokens (
       id    serial primary key,
      uid   integer not null references users(id) on delete cascade,
    token   varchar not null unique,
  created timestamp not null default current_timestamp,
  expires timestamp not null default current_timestamp + interval '2 days'
);
