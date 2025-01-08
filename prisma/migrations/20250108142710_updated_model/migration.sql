/*
  Warnings:

  - You are about to drop the column `isRead` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "isRead",
ADD COLUMN     "readStatus" BOOLEAN NOT NULL DEFAULT false;
