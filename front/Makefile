DEV_IMAGE_NAME = dev_front

#exec debug set to -i to see verbose or empty for no vebose
LOG = -i
# Installed application modules return 0 if exist 
# In our case we want not exist before installing the app
DEV_APP_INSTALLED = $(shell ls ./app/node_modules 2>&1 | grep -i "no such file" | wc -w)
DEV_APP_INSTALLATION_LOCKER = $(shell ls ./app/package-lock.json 2>&1 | grep -i "no such file" | wc -w)
APP_HOST_DIR = $(shell pwd)/app

RED=\033[0;31m
BG_RED=\033[0;41m
GREEN=\033[0;32m
ORANGE=\033[0;33m
NC=\033[0m

all:
ifeq ($(DEV_APP_INSTALLATION_LOCKER), 0)
	@echo "Starting the dev server"
	@make -s -C . already_launch_serve
	@make -s -C . start_container
# @echo "$(ORANGE)Show help ? [y/n]$(NC)"
# @read -r answer; \
	# if [ "$$answer" = "y" ] || [ "$$answer" = "Y" ]; then \
	# 	make -s -C . show_help_after_install; \
	# fi
	@echo "$(GREEN)Happy coding inside your host folder !!!$(NC)"
else
	@make install
endif

show_help_after_install:
	@clear -x
	@echo "[STEP 1/4] You can now enter into the Dev server with :\n\t$(GREEN)docker exec -ti frontend /bin/bash"
	@echo "$(NC)\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el;
	@echo "[STEP 2/4] then type inside container promt:"
	@echo "\t$(GREEN)cd /app && npm run serve"
	@echo "$(NC)\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el;
	@echo "[STEP 3/4] $(GREEN)Server is now running and will be listennig on host to port \033[0;42m3001$(NC)$(GREEN)..."
	@echo "$(NC)\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el;
	@echo "$(BG_RED)If you want to stop the dev server (gracefully):$(NC)"
	@echo "[STEP 3.5/4] Type \033[0;42mq$(NC) inside the view of the container : (when the view look like this)\n"
	@echo "\t\t\tVITE version  ready in  ms\n"
	@echo "\t\t\t➜  Local:   http://localhost:3000/"
	@echo "\t\t\t➜  Network: http://xxx.xxx.xx.x:3000/\n"
	@echo "$(NC)\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el;
	@echo "[STEP 4/4] $(GREEN)'make stop$(NC)' to stop the daemon (container)"
	@echo "$(NC)\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el; 
	@echo "$(RED)[OTHER STUFF] Before commiting:$(NC)"
	@echo "\t'$(GREEN)make linter$(NC)' to check norm (app must be installed)"
	@echo "\tIf linter show an error:\n\t\tYou think\
	 it is a anti-pattern, feel free to submit a issue about the linter\n\t\t\
	 add this line before the error // eslint-disable-next-line\n\t\t\
	 or disable eslint in the entire file with  /* eslint-disable */ \n\t\t\
	 this will be checked by the CI team Mates ('make check_norm_bypass' target FIX will be available soon)"
	@echo "$(NC)\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el; 
	@echo "[LAST STEP BEFORE CODE]\nIf new node package has been added to the app: (or if you want just to clean)"
	@echo "\t'make clean' to remove node_modules and package-lock.json and re-install the app with 'make install'"
	@echo "$(NC)\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el;

already_launch_serve:
ifneq ($(shell docker ps --filter "name=frontend" -q),)
	@echo "killing previous service..."
	@make -s -C . stop
endif

stop:
	@docker kill frontend

# WIP DEPENDANCY - NEED SEQUENCE FIX 
warn_check_norm_bypass_agreement:
	@echo "You are about to check the norm bypass, it will uninstall the app you need to re-install it after"
	@echo "Do you want to continue ? [y/n]"
	@read -r answer; \
	if [ "$$answer" = "y" ] || [ "$$answer" = "Y" ]; then \
		make -s -C . do_norm_bypass_check 2>/dev/null; \
		echo "Norm bypass checked"; \
	else \
		echo "Aborting"; \
		err "aborting";\
	fi
	@echo -n "Number of reported eslint rules : "
	@cat norm.report | wc -l
	@echo "Do you want to see report ? [y/n]"
	@read -r answer; \
	if [ "$$answer" = "y" ] || [ "$$answer" = "Y" ]; then \
		cat ./norm.report; \
	fi
	@echo "Keep report file norme.report ? [y/n]"
	@read -r answer; \
	if [ "$$answer" = "y" ] || [ "$$answer" = "Y" ]; then \
		echo "File keeped"; \
	else \
		make -s -C . clean; \
	fi

do_norm_bypass_check:
	@make -s -C . clean
	@grep -rw  "// eslint-disable-next-line" ./app > ./norm.report
	@grep -rw  "eslint-disable" ./app >> ./norm.report

check_norm_bypass: warn_check_norm_bypass_agreement

linter:
ifeq ($(DEV_APP_INSTALLATION_LOCKER), 0)
	@make -s -C . start_container
	@echo "cd /app && npm run lint" | docker exec -i frontend /bin/bash
	docker kill frontend
else
	@echo "Please install the dev server with 'make install' to have the benefit of the linter"
endif

attach_run_serve:
	@echo "cd /app && npm run serve" | docker exec -i frontend /bin/bash

create_container:
ifeq ($(shell docker ps --all --filter "name=frontend" -q),)
	@echo "Container doesnt exists"
	@echo "Starting instance of container (preparing installation) from $(pwd)/app"
	@docker run -d -i -v $(APP_HOST_DIR):/app -p 3001:3000 --name frontend dev_front
else
	@echo "Container already exists"
endif

check_lock_before_install:
ifeq ($(DEV_APP_INSTALLATION_LOCKER), 0)
	$(error The app cannot be re-installed, it seems you have already run the app on this commit \
		There is an error, you cannot have a package-lock.json while attempting to install the application dev server)
else
	@echo "Checking package-lock.json : no lock file found"
	@echo "Will now install the application"
endif

start_container:
	@echo "Check daemon instance please wait..."
ifeq ($(shell docker ps --filter "name=frontend" -q),)
	docker start frontend
	@echo "daemon restarted"
else
	@echo "daemon active"
endif

attach_container_app_install: start_container
	@echo "Installation in progress... please wait"
	@echo "cd /app && npm install --no-bin-links" | docker exec $(LOG) frontend /bin/bash

install_app: 
ifeq ($(DEV_APP_INSTALLED), 0)
	@echo "Application is installed"
	@make -s -C . check_lock_before_install
else
	@echo "Application is not installed"
endif
	@make -s -C . attach_container_app_install
	@make -s -C . install_global
	docker stop frontend

install_global:
	@echo "cd /app && npm install" | docker exec -i frontend /bin/bash

check_dev_image_build:
	@echo "Checking existing installation of previous dev server"
ifeq ($(shell docker images -q $(DEV_IMAGE_NAME) 2>/dev/null),)
	@echo "Image doesnt exist"
	@docker build . -t $(DEV_IMAGE_NAME)
else
	@echo "Image already exists"
endif
	@make -C . create_container -s
	@make -C . install_app -s

install: check_dev_image_build
	@clear -x
	@echo "Installation done\n\n"
	@make -s -C . all
clean:
ifneq ($(shell docker ps --filter "name=frontend" -q),)
	docker kill frontend
endif
ifneq ($(shell docker ps --all --filter "name=frontend" -q),)
	docker rm frontend
endif
	rm -rf ./app/node_modules ./app/package-lock.json norm.report

fclean: clean
ifneq ($(shell docker images -q $(DEV_IMAGE_NAME) 2>/dev/null),)
	docker rmi dev_front
endif

re: fclean
	make -s -C . install
	make -s -C . all 
