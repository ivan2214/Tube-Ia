/*
  Warnings:

  - You are about to drop the column `historyId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `historyId` on the `Timeline` table. All the data in the column will be lost.
  - Added the required column `videoId` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Chat_historyId_idx";

-- DropIndex
DROP INDEX "Timeline_historyId_idx";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "historyId";

-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "historyId",
ADD COLUMN     "videoId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Video" (
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "historyId" TEXT NOT NULL,
    "chatid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("url")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_url_key" ON "Video"("url");

-- CreateIndex
CREATE INDEX "Video_historyId_idx" ON "Video"("historyId");

-- CreateIndex
CREATE INDEX "Video_chatid_idx" ON "Video"("chatid");

-- CreateIndex
CREATE INDEX "Timeline_videoId_idx" ON "Timeline"("videoId");
