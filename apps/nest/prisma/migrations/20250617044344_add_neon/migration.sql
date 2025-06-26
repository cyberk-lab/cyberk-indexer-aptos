/*
  Warnings:

  - You are about to drop the column `neonBranchId` on the `Indexer` table. All the data in the column will be lost.
  - You are about to drop the column `neonDbName` on the `Indexer` table. All the data in the column will be lost.
  - You are about to drop the column `neonProjectId` on the `Indexer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[databaseId]` on the table `Indexer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Indexer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Indexer" DROP COLUMN "neonBranchId",
DROP COLUMN "neonDbName",
DROP COLUMN "neonProjectId",
ADD COLUMN     "databaseId" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "NeonConfig" (
    "id" BIGINT NOT NULL,
    "projectCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentProjectId" TEXT,

    CONSTRAINT "NeonConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NeonProject" (
    "id" TEXT NOT NULL,
    "branchCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentBranchId" TEXT,

    CONSTRAINT "NeonProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NeonBranch" (
    "id" TEXT NOT NULL,
    "databaseCount" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NeonBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NeonDatabase" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NeonDatabase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NeonConfig_currentProjectId_key" ON "NeonConfig"("currentProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "NeonProject_currentBranchId_key" ON "NeonProject"("currentBranchId");

-- CreateIndex
CREATE UNIQUE INDEX "Indexer_databaseId_key" ON "Indexer"("databaseId");

-- AddForeignKey
ALTER TABLE "Indexer" ADD CONSTRAINT "Indexer_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "NeonDatabase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeonConfig" ADD CONSTRAINT "NeonConfig_currentProjectId_fkey" FOREIGN KEY ("currentProjectId") REFERENCES "NeonProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeonProject" ADD CONSTRAINT "NeonProject_currentBranchId_fkey" FOREIGN KEY ("currentBranchId") REFERENCES "NeonBranch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeonBranch" ADD CONSTRAINT "NeonBranch_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "NeonProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeonDatabase" ADD CONSTRAINT "NeonDatabase_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "NeonBranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
