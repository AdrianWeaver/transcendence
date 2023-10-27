-- CreateTable
CREATE TABLE "secretTable" (
    "secret_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "secretTable_pkey" PRIMARY KEY ("secret_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "secretTable_secret_id_key" ON "secretTable"("secret_id");

-- CreateIndex
CREATE UNIQUE INDEX "secretTable_value_key" ON "secretTable"("value");
