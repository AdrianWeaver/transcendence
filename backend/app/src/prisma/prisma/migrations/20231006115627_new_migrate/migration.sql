-- CreateTable
CREATE TABLE "AnonymousUser" (
    "uuid" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "lastConnection" INTEGER NOT NULL,
    "userCreatedAt" TEXT NOT NULL,
    "revokeConnectionRequest" BOOLEAN NOT NULL,
    "isRegistredAsRegularUser" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousUser_uuid_key" ON "AnonymousUser"("uuid");
