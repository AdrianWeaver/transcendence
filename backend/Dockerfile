FROM debian:buster

RUN apt update
RUN echo yes | apt upgrade

RUN echo yes | apt install nodejs npm curl git htop

RUN npm install -g n 
RUN n latest

RUN npm install -g nodemon
RUN npm install -g @nestjs/cli
RUN npm install -g pm2
RUN npm install -g pm2-monit
RUN npm install -g eslint


CMD [ "/bin/bash" ]