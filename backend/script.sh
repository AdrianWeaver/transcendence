#!/bin/bash

cd app && npm install
cd src/prisma
npx prisma generate
npx npx prisma migrate dev --schema=./prisma/schema.prisma
# npm install -g bcrypt
npx prisma db pull
npm run start:dev

exec "$@"