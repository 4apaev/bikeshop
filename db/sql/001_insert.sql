insert into users (uname, email, pass) values
  ('krote', 'krote@shoshi.dog', crypt('one', gen_salt('bf', 8))),
  ('tania', 'tania@shoshi.dog', crypt('two', gen_salt('bf', 8))),
  ('michael', 'michael@shoshi.dog', crypt('three', gen_salt('bf', 8)));

insert into bikes (kind, details) values
  ('city', 'in good condition'),
  ('road', 'a bit used'),
  ('cruiser', 'trash');