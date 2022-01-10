Inner Tube
==========

Cooperative bicycle workshop


# connect to container
docker exec -it {container_name} psql -U {POSTGRES_USER}

# or connect to db
docker exec -it tube psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"

# list dbs
\l

# connect to db
\c {POSTGRES_DB}

# list db tables
\dt

# query (dont forget semi at the end)
select * from "users";


