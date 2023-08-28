include .env

all: up

up:
	@docker run --name postgresDB -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -p 5432:5432 -d postgres

showpwd: 
	@echo ${POSTGRES_PASSWORD}

clean:
	@docker rmi $(shell docker images -q)
	@docker system prune -f