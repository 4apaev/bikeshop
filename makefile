PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

all: down up migrate test start

up:
	docker-compose up --build -d
down:
	docker-compose down
migrate:
	node db/migrate.js
test:
	c8 --check-coverage mocha ./tests/*.spec.js
start:
	node index.js

.PHONY: all down up migrate test start

