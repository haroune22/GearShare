"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DateRange } from "react-day-picker";

export const createBooking = async (
  listingId: string,
  dateRange: DateRange,
) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!listingId || !dateRange?.from || !dateRange?.to) {
    throw new Error("Data required");
  }

  try {
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
      },
      select: {
        createdBy: {
          select: {
            id: true,
          },
        },
        price: true,
        type: true,
      },
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.type !== "Rent") {
      throw new Error("Cannot rent this item");
    }

    if (session.user.id === listing.createdBy.id) {
      throw new Error("You cannot rent your own tool");
    }

    const rentalDays = Math.max(
      1,
      Math.ceil(
        (dateRange.to.getTime() - dateRange.from.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );

    const totalPrice = rentalDays * Number(listing.price);

    const newBooking = await prisma.booking.create({
      data: {
        listingId,
        ownerId: listing.createdBy.id,
        renterId: session.user.id,
        status: "PENDING",
        pickupAt: dateRange.from,
        returnAt: dateRange.to,
        PricePerDay: listing.price,
        totalPrice,
      },
      select: {
        id: true,
      },
    });

    return {
      status: 201,
      message: "Booking created successfully",
      bookingId: newBooking.id,
    };
  } catch (error) {
    console.error(error);

    return {
      status: 500,
      message: "Internal server error",
    };
  }
};
