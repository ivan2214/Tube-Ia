/*
  Warnings:

  - You are about to drop the column `chatid` on the `Video` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Video_chatid_idx";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "chatid",
ADD COLUMN     "chatId" TEXT;

-- CreateIndex
CREATE INDEX "Video_chatId_idx" ON "Video"("chatId");
