-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
