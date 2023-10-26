#!/bin/bash

cd app && npm install
cd src/prisma
npx prisma generate
npx prisma migrate dev --schema=./prisma/schema.prisma --name dev
# npm install -g bcrypt
npx prisma db pull
npm run start:dev

exec "$@"