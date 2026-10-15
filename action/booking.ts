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

export const getBookings = async (view: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const filters = ["all", "renting", "request"];

  if (!filters.includes(view)) {
    return {
      status: 404,
      message: "View is needed",
    };
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        ...(view === "renting" && { renterId: session.user.id }),
        ...(view === "request" && { ownerId: session.user.id }),
        ...(view === "all" && {
          OR: [{ renterId: session.user.id }, { ownerId: session.user.id }],
        }),
      },
      select: {
        id: true,
        totalPrice: true,
        createdAt: true,
        ownerId: true,
        renterId: true,
        pickupAt: true,
        returnAt: true,
        status: true,
        PricePerDay: true,
        listing: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        owner: {
          select: {
            id: true,
            userName: true,
            image: true,
          },
        },
        renter: {
          select: {
            id: true,
            userName: true,
            image: true,
          },
        },
      },
    });

    if (bookings.length === 0) {
      return {
        status: 400,
        message: "No bookings found",
      };
    }

    const filteredBookings = bookings.map((b) => {
      const { owner, renter, ...bookingData } = b;

      return b.renterId === session.user.id
        ? { ...bookingData, otherUser: owner }
        : { ...bookingData, otherUser: renter };
    });

    return {
      status: 201,
      message: "Booking found",
      bookings: filteredBookings,
    };
  } catch (error) {
    console.error(error);

    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

export const getBookingInfo = async (id: string) => {
  const session = await auth();

  if (!session || !session.user.id) {
    throw new Error("unauthorized");
  }

  if (!id) {
    throw new Error("id required");
  }

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        OR: [{ renterId: session.user.id }, { ownerId: session.user.id }],
      },
      select: {
        id: true,
        PricePerDay: true,
        createdAt: true,
        pickupAt: true,
        pickedUpAt: true,
        returnAt: true,
        returnedAt: true,
        status: true,
        owner: {
          select: {
            id: true,
            name: true,
            userName: true,
            image: true,
          },
        },
        renter: {
          select: {
            id: true,
            name: true,
            userName: true,
            image: true,
          },
        },
        reviews: {
          select: {
            content: true,
            id: true,
            createdAt: true,
            rating: true,
            title: true,
            reviewer: {
              select: {
                id: true,
                name: true,
                userName: true,
                image: true,
              },
            },
          },
        },
        totalPrice: true,
        listing: {
          select: {
            category: true,
            description: true,
            images: true,
            name: true,
            location: true,
            price: true,
            type: true,
            id: true,
          },
        },
      },
    });

    if (!booking) {
      return {
        status: 404,
        message: "Not found",
      };
    }
    return {
      status: 200,
      message: "Booking found",
      booking,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};
