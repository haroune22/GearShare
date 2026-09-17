/*
  Warnings:

  - Added the required column `listingId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Made the column `bookingId` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_bookingId_fkey";

-- DropIndex
DROP INDEX "Category_slug_idx";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "listingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "bookingId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
