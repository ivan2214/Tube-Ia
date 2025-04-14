/*
  Warnings:

  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `url` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Video_url_key";

-- AlterTable
ALTER TABLE "Video" DROP CONSTRAINT "Video_pkey",
DROP COLUMN "url",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Video_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Video_id_key" ON "Video"("id");
