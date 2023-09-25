#############
#DEVELOPMENT#
#############

FROM node:20.3.0 AS development

WORKDIR /localghost/src/app

COPY    ./package*.json ./

RUN npm install

# COPY . .

# RUN npm run build

EXPOSE 3000


############
#PRODUCTION#
############

FROM node:20.3.0 AS production


WORKDIR /localghost/src/app

COPY --from=development /localghost/src/app .

EXPOSE 3000

CMD [ "node", "dist/main"]
