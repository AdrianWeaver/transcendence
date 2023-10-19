#!/bin/bash

cd app && npm install
cd src/prisma
npx prisma generate
npx npx prisma migrate dev --schema=./prisma/schema.prisma
npx prisma db pull
npm run start:dev

exec "$@"