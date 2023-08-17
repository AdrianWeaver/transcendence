FROM debian:buster

RUN apt update && apt upgrade -y

RUN apt install -y npm curl git htop

RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME "/root/.volta"
ENV PATH "$VOLTA_HOME/bin:$PATH"

RUN volta install node@18.12.0

RUN npm install -g vite
RUN npm install -g eslint

CMD [ "/bin/bash" ]