# # sleep 2 #very ugly
# set -e
# until pg_isready -h "${POSTGRES_HOST}" -p 5432 -U "${POSTGRES_USER}"; do
#   echo "$(date) - waiting for db to start"
#   sleep 1
# done
# exec "$@"
# # npx npx prisma migrate dev --name init
# # npx prisma db push
# npx prisma db reset
# npx prisma db pull
# npx prisma migrate dev --schema=./prisma/schema.prisma
# npx prisma db pull
# # npx prisma db seed
# # (npx prisma studio&) 
# # npm run start:dev