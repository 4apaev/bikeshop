insert into users ("name", "mail", "pass") values
  ('krote', 'krote@shoshi.dog', crypt('one', gen_salt('bf', 8))),
  ('tania', 'tania@shoshi.dog', crypt('two', gen_salt('bf', 8))),
  ('michael', 'michael@shoshi.dog', crypt('three', gen_salt('bf', 8)));

insert into bikes ("kind", "desc") values
  ('city', 'in good condition'),
  ('road', 'a bit used'),
  ('cruiser', 'trash');


insert into users_bikes (uid, bid) values (1, 3), (2, 1), (3, 2);