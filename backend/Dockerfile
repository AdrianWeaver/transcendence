FROM node:18.18.1-bullseye

COPY "./script.sh" "/srv/script.sh" 
RUN apt update && apt upgrade -y
RUN apt install -y curl htop

RUN npm install -g @nestjs/cli
RUN npm install -g pm2
RUN npm install -g pm2-monit
RUN npm install -g eslint
# RUN npm install -g bcrypt

ENTRYPOINT [ "/bin/bash", "srv/script.sh" ]