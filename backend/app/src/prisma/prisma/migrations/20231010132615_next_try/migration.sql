/*
  Warnings:

  - You are about to drop the `chatJSON` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "chatJSON";

-- CreateTable
CREATE TABLE "ChatJson" (
    "chatJsonID" TEXT NOT NULL,
    "contents" TEXT NOT NULL,

    CONSTRAINT "ChatJson_pkey" PRIMARY KEY ("chatJsonID")
);
