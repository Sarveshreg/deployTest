/*
  Warnings:

  - The primary key for the `OTP` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `OTP` table. All the data in the column will be lost.
  - Added the required column `Email` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_pkey",
DROP COLUMN "email",
ADD COLUMN     "Email" TEXT NOT NULL,
ADD CONSTRAINT "OTP_pkey" PRIMARY KEY ("Email");
