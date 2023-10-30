#!/bin/bash

# cd app && npm install
# set -e
# until pg_isready -h "${POSTGRES_HOST}" -p 5432 -U "${POSTGRES_USER}"; do
#   echo "$(date) - waiting for db to start"
#   sleep 1
# done
# exec "$@"

rm -rf /app/src/prisma/prisma/migrations;
# cd /app/src/prisma && npx prisma db pull;

# Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
cd /app/src/prisma && npx prisma  migrate dev --schema=./prisma/schema.prisma --name=dev;
cd /app/src/prisma &&  npx prisma db push

npm run start:dev