FROM debian:buster

RUN apt update
RUN echo yes | apt upgrade

RUN echo yes | apt install nodejs npm curl git

RUN npm install -g n 
RUN n latest

RUN npm install -g artillery

CMD ["/bin/bash"]
# docker run -ti -v $(pwd)/script/:/srv/script load_artillery