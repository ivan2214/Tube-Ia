/*
  Warnings:

  - You are about to drop the column `userId` on the `Chat` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Chat_userId_idx";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "userId";
