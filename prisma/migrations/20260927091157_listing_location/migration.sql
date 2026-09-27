/*
  Warnings:

  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "location",
ADD COLUMN     "address" TEXT;

-- CreateTable
CREATE TABLE "ListingLocation" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "ListingLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListingLocation_listingId_key" ON "ListingLocation"("listingId");

-- AddForeignKey
ALTER TABLE "ListingLocation" ADD CONSTRAINT "ListingLocation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
