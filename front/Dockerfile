FROM debian:buster

RUN apt update && apt upgrade -y

RUN apt install -y nodejs npm curl git htop

RUN npm install -g n 
RUN n latest

RUN npm install -g nodemon
RUN npm install -g vite
RUN npm install -g eslint

CMD [ "/bin/bash" ]