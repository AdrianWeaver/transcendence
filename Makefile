GREEN=\033[0;32m
NC=\033[0m

FRONT_NAME=frontend
BACK_NAME=backend

all: frontend backend

frontend:
	@echo "${GREEN}Building Frontend...${NC}"
	@cd front && make
	@gnome-terminal -x bash -c "docker exec -ti frontend bash -c 'cd /app && npm run serve'; exec bash"

backend:
	@echo "${GREEN}Building Backend...${NC}"
	@cd backend && make
	@gnome-terminal -x bash -c "docker exec -ti backend bash -c 'cd /app && npm run start:dev'; exec bash"

clean_front:
	@cd front && make clean

clean_back:
	@cd backend && make clean

clean: clean_front clean_back

fclean_front:
	@cd front && make fclean

fclean_back:
	@cd backend && make fclean

fclean: fclean_front fclean_back

.PHONY: all frontend backend clean_front clean_back fclean_front fclean_back clean_all fclean_all


