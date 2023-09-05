FROM debian:buster

RUN apt update && apt upgrade -y

RUN apt install -y curl htop

RUN groupadd -g 1000 node \
&& useradd -lm -u 1000 -g 1000 node 

#  if at school, comment out the following line
# USER node

ENV VOLTA_HOME "/home/node/.volta"
ENV PATH "$VOLTA_HOME/bin:$PATH"
RUN curl https://get.volta.sh | bash

RUN volta install node@18.17.1

RUN npm install -g @nestjs/cli
RUN npm install -g pm2
RUN npm install -g pm2-monit
RUN npm install -g eslint

CMD [ "/bin/bash" ]