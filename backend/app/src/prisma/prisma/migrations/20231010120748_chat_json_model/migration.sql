-- CreateTable
CREATE TABLE "chatJSON" (
    "chatJsonID" TEXT NOT NULL,
    "contents" JSONB NOT NULL,

    CONSTRAINT "chatJSON_pkey" PRIMARY KEY ("chatJsonID")
);
