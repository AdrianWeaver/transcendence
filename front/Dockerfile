FROM node:18.18.1-bullseye

RUN apt update && apt upgrade -y
RUN apt install -y curl htop

RUN npm install -g vite
RUN npm install -g eslint

CMD [ "/bin/bash" ]