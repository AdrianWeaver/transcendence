DEV_IMAGE_NAME = dev_back

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
	@echo "You can now enter into the Dev server with :\n\t$(GREEN)docker exec -ti backend /bin/bash"
	@echo "$(NC)\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el;
	@echo "then type inside container promt: :"
	@echo "\t$(GREEN)cd /app && npm run start:dev$(NC)"
	@echo "\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el;
	@echo "It will start the backend server dev_version"
	@echo "\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el;
	@echo "To check if backend is running successfully"
	@echo "Please use Postman software and goto "
	@echo "$(GREEN)\thttp://localhost:3000$(NC)"
	@echo "You should have a response : hello World"
	@echo "$(NC)\npress any key to continue"
	@bash -c "read -n 1 -s -r";
	@tput cuu1 && tput el;


already_launch_serve:
ifneq ($(shell docker ps --filter "name=backend" -q),)
	@echo "killing previous service..."
	@make -s -C . stop
endif

stop:
ifneq ($(shell docker ps --filter "name=backend" -q), $(shell docker ps -a --filter "name=backend" -q))
	@echo "Conatiner already stopped"
else
ifeq ($(shell docker ps -a --filter "name=backend" -q), )
	@echo container not created
else
	@echo "Force shutdown container"
	@docker kill backend
endif
endif
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
	@echo "cd /app && npm run lint" | docker exec -i backend /bin/bash
	docker kill backend
else
	@echo "Please install the dev server with 'make install' to have the benefit of the linter"
endif

attach_run_serve:
	@echo "cd /app && npm run start:dev" | docker exec -i backend /bin/bash

create_container:
ifeq ($(shell docker ps --all --filter "name=backend" -q),)
	@echo "Container doesnt exists"
	@echo "Starting instance of container (preparing installation) from $(pwd)/app"
	@docker run -d -i -v $(APP_HOST_DIR):/app -p 3000:3000 --name backend dev_back
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
ifeq ($(shell docker ps --filter "name=backend" -q),)
	docker start backend
	@echo "daemon restarted"
else
	@echo "daemon active"
endif

attach_container_app_install: start_container
	@echo "Installation in progress... please wait"
	@echo "cd /app && npm install --no-bin-links" | docker exec $(LOG) backend /bin/bash

install_app: 
ifeq ($(DEV_APP_INSTALLED), 0)
	@echo "Application is installed"
	@make -s -C . check_lock_before_install
else
	@echo "Application is not installed"
endif
	@make -s -C . attach_container_app_install
	@make -s -C . install_global
	docker stop backend

install_global:
	@echo "cd /app && npm install" | docker exec -i backend /bin/bash

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
ifneq ($(shell docker ps --filter "name=backend" -q),)
	docker stop backend
endif
ifneq ($(shell docker ps --all --filter "name=backend" -q),)
	docker rm backend
endif
	rm -rf ./app/node_modules ./app/package-lock.json norm.report ./app/dist

fclean: clean
ifneq ($(shell docker images -q $(DEV_IMAGE_NAME) 2>/dev/null),)
	docker rmi dev_back
endif

re: fclean
	make -s -C . all 