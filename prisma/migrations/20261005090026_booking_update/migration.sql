/*
  Warnings:

  - Added the required column `pickupAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookingStatus" ADD VALUE 'PICKED_UP';
ALTER TYPE "BookingStatus" ADD VALUE 'NO_SHOW';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "pickedUpAt" TIMESTAMP(3),
ADD COLUMN     "pickupAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returnAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returnedAt" TIMESTAMP(3);
