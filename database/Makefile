include .env

all: up

up:
	@docker build -t postgres_image .
	@docker run --name postgresDB -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -p 5432:5432 -d postgres_image

clean:
	@docker rm $(shell docker ps -a -q) -f
	@docker rmi -f $(shell docker images -q)
	@docker system prune -f

.PHONY: all up clean 