/*
  Warnings:

  - You are about to drop the column `videoId` on the `History` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `History` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "History_userId_videoId_key";

-- AlterTable
ALTER TABLE "History" DROP COLUMN "videoId";

-- CreateIndex
CREATE UNIQUE INDEX "History_userId_key" ON "History"("userId");
