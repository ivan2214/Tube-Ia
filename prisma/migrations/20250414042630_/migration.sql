/*
  Warnings:

  - You are about to drop the column `chatId` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[videoId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `videoId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Video_chatId_idx";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "videoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "chatId";

-- CreateIndex
CREATE UNIQUE INDEX "Chat_videoId_key" ON "Chat"("videoId");
