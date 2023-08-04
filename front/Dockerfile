FROM debian:buster

RUN apt update && apt upgrade -y

# RUN curl https://get.volta.sh | bash
# ENV VOLTA_HOME "/root/.volta"
# ENV PATH "$VOLTA_HOME/bin:$PATH"

# RUN volta install node

RUN npm install -g nodemon
RUN npm install -g vite
RUN npm install -g eslint
# WORKDIR /app
# RUN npm install
# RUN npm run serve

CMD [ "/bin/bash" ]