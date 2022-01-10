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
  id serial primary key,
  kind bike_kind,
  details varchar(255)
);

create table if not exists users (
     id serial primary key,
  uname varchar(255) not null,
  email varchar(255) unique not null,
   pass varchar(255) not null
);

create table if not exists users_bikes (
       uid int not null references users(id) on delete cascade,
       bid int not null references bikes(id) on delete cascade,
   checkin timestamp not null default current_timestamp,
  checkout timestamp not null default current_timestamp + interval '1 week',
  constraint ubid_pk primary key (uid, bid)
);

create table if not exists access_tokens (
  id serial primary key,
  uid integer not null references users(id) on delete cascade,
  token varchar(255) unique not null,
  created timestamp not null default current_timestamp,
  expires timestamp not null default current_timestamp + interval '2 days'
);

