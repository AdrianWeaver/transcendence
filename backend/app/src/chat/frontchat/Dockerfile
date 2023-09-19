FROM node:20.3.0

WORKDIR /localghost/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
