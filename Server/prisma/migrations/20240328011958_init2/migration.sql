/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `Category` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "Category",
ADD COLUMN     "Category" TEXT NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("Event_id", "Category");
