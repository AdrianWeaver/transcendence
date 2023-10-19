/*
  Warnings:

  - You are about to drop the `Admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BannedUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlockedUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserChannels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserChannels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admins" DROP CONSTRAINT "Admins_channelId_fkey";

-- DropForeignKey
ALTER TABLE "BannedUser" DROP CONSTRAINT "BannedUser_channelId_fkey";

-- DropForeignKey
ALTER TABLE "BlockedUser" DROP CONSTRAINT "BlockedUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_chatId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chatId_fkey";

-- DropForeignKey
ALTER TABLE "UserChannels" DROP CONSTRAINT "UserChannels_channelId_fkey";

-- DropForeignKey
ALTER TABLE "UserChannels" DROP CONSTRAINT "UserChannels_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserChannels" DROP CONSTRAINT "_UserChannels_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserChannels" DROP CONSTRAINT "_UserChannels_B_fkey";

-- DropTable
DROP TABLE "Admins";

-- DropTable
DROP TABLE "BannedUser";

-- DropTable
DROP TABLE "BlockedUser";

-- DropTable
DROP TABLE "Channel";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserChannels";

-- DropTable
DROP TABLE "_UserChannels";

-- DropEnum
DROP TYPE "ChanMode";

-- DropEnum
DROP TYPE "Role";
