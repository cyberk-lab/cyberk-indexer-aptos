/*
  Warnings:

  - The `databaseId` column on the `Indexer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `NeonDatabase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `NeonDatabase` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Indexer" DROP CONSTRAINT "Indexer_databaseId_fkey";

-- AlterTable
ALTER TABLE "Indexer" DROP COLUMN "databaseId",
ADD COLUMN     "databaseId" INTEGER;

-- AlterTable
ALTER TABLE "NeonDatabase" DROP CONSTRAINT "NeonDatabase_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "NeonDatabase_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Indexer_databaseId_key" ON "Indexer"("databaseId");

-- AddForeignKey
ALTER TABLE "Indexer" ADD CONSTRAINT "Indexer_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "NeonDatabase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
