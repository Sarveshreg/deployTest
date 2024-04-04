/*
  Warnings:

  - Added the required column `CreatorEmail` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CreatorName` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "CreatorEmail" TEXT NOT NULL,
ADD COLUMN     "CreatorName" TEXT NOT NULL;
