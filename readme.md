Inner Tube
==========

Cooperative bicycle workshop


# container
```
docker exec -it db psql -U $POSTGRES_USER
docker exec -it $POSTGRES_HOST psql -U $POSTGRES_USER
docker exec -it ${container_name:db} psql -U $POSTGRES_USER
```

# connect
`docker exec -it db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"`

# list dbs
`\l`

# connect to db
`\c {POSTGRES_DB}`

# list tables
`\dt`

# clean images
```
docker rmi -f $(docker images -a -q)
```


# docker exec
```
docker exec -it  bikeshop sh <
```