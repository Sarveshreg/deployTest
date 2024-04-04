/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `Category` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `Picture` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "Category",
ADD COLUMN     "Category" TEXT NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("Event_id", "Category");

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "Latitude" DOUBLE PRECISION,
ADD COLUMN     "LocationDisplay" TEXT,
ADD COLUMN     "Longitude" DOUBLE PRECISION,
ALTER COLUMN "Picture" SET NOT NULL;

UPDATE "Event"
SET "Picture" = 'default_image_url'
WHERE "Picture" IS NULL;

