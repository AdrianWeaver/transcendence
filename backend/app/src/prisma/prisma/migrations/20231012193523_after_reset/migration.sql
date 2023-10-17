-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "ChanMode" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- CreateTable
CREATE TABLE "AnonymousUser" (
    "uuid" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "lastConnection" TEXT NOT NULL,
    "userCreatedAt" TEXT NOT NULL,
    "revokeConnectionRequest" BOOLEAN NOT NULL,
    "isRegistredAsRegularUser" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "ChatJson" (
    "chatJsonID" TEXT NOT NULL,
    "contents" TEXT NOT NULL,

    CONSTRAINT "ChatJson_pkey" PRIMARY KEY ("chatJsonID")
);

-- CreateTable
CREATE TABLE "Chat" (
    "chatId" TEXT NOT NULL,
    "chanMap" JSONB[],
    "privateMessageMap" JSONB[],

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("chatId")
);

-- CreateTable
CREATE TABLE "User" (
    "name" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "friends" JSONB[],
    "isAdmin" "Role" NOT NULL DEFAULT 'BASIC',
    "userId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Channel" (
    "channelId" TEXT NOT NULL,
    "mode" "ChanMode" NOT NULL DEFAULT 'PUBLIC',
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "messages" JSONB[],
    "members" INTEGER NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "UserChannels" (
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "UserChannels_pkey" PRIMARY KEY ("userId","channelId")
);

-- CreateTable
CREATE TABLE "BannedUser" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "BannedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admins" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserChannels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousUser_uuid_key" ON "AnonymousUser"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UserChannels_AB_unique" ON "_UserChannels"("A", "B");

-- CreateIndex
CREATE INDEX "_UserChannels_B_index" ON "_UserChannels"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("chatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("chatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChannels" ADD CONSTRAINT "UserChannels_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChannels" ADD CONSTRAINT "UserChannels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannedUser" ADD CONSTRAINT "BannedUser_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChannels" ADD CONSTRAINT "_UserChannels_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChannels" ADD CONSTRAINT "_UserChannels_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
