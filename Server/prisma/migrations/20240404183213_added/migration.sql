/*
  Warnings:

  - Added the required column `User_fname` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "User_fname" TEXT NOT NULL;
