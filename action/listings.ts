"use server";
import { auth } from "@/auth";
import { ListingStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createListingData } from "@/lib/types";

type ListingFilters = {
  categorySlug?: string;
  name?: string;
  userId?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  take?: number;
  skip?: number;
};

const getDistanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getFilteredListings = async ({
  categorySlug,
  name,
  userId,
  latitude,
  longitude,
  radiusKm = 10,
}: ListingFilters) => {
  const listings = await prisma.listing.findMany({
    where: {
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(userId && { userId }),
      ...(categorySlug && {
        category: { slug: categorySlug },
      }),
    },
    include: {
      location: true,
      createdBy: {
        select: {
          id: true,
          userName: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (latitude == null || longitude == null) {
    return listings;
  }

  return listings.filter((listing) => {
    const listingLat = Number(listing?.location?.latitude);
    const listingLon = Number(listing?.location?.longitude);

    const distance = getDistanceInKm(
      latitude,
      longitude,
      listingLat,
      listingLon,
    );

    return distance <= radiusKm;
  });
};

export const getListings = async (filters: ListingFilters) => {
  const listings = await getFilteredListings(filters);

  const { take = 10, skip = 0 } = filters;

  return listings.slice(skip, skip + take);
};

export const getListingsCount = async (filters: ListingFilters) => {
  const listings = await getFilteredListings(filters);

  return listings.length;
};

export const getListingById = async (id: string) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        status: true,
        type: true,
        category: true,
        images: true,
        location: {
          select: {
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        booking: {
          select: {
            id: true,
            status: true,
            reviews: {
              where: {
                reviewType: "item",
              },
              select: {
                content: true,
                id: true,
                rating: true,
                reviewer: {
                  select: {
                    id: true,
                    userName: true,
                    name: true,
                    image: true,
                  },
                },
                title: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            userName: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return listing;
  } catch (error) {
    console.log(error);
  }
};

export const createListing = async (
  data: createListingData,
  images: string[],
) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  try {
    const newListing = await prisma.listing.create({
      data: {
        ...data,
        images,
        location: {
          create: {
            address: data.location.address,
            longitude: Number(data.location.latitude),
            latitude: Number(data.location.latitude),
          },
        },
        userId: session?.user.id,
      },
      select: {
        id: true,
      },
    });
    return newListing;
  } catch (error) {
    console.log(error);
  }
};

export const getListingForEdit = async (id: string) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        type: true,
        location: {
          select: {
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        categoryId: true,
        images: true,
        createdBy: {
          select: {
            id: true,
          },
        },
      },
    });

    return listing;
  } catch (error) {
    console.log(error);
  }
};

export const updateListing = async (
  id: string,
  data: createListingData,
  images: string[],
  status: ListingStatus,
) => {
  if (!id || !data) {
    throw new Error("Listing Id & Data required");
  }

  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        createdBy: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing) {
      throw new Error("list not found");
    }
    if (session.user.id !== listing?.createdBy.id) {
      throw new Error("Unauthorized");
    }
    const updatedListing = await prisma.listing.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price,
        type: data.type,
        images,
        status,
        location: {
          update: {
            address: data.location.address,
            latitude: Number(data.location.latitude),
            longitude: Number(data.location.longitude),
          },
        },
      },
      select: {
        id: true,
      },
    });
    return updatedListing;
  } catch (error) {
    console.log(error);
  }
};

export const deleteListing = async (listingId: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  if (!listingId) {
    throw new Error("Listing Id required");
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      select: {
        id: true,
        createdBy: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!listing) {
      return {
        success: false,
        message: "Listing not found",
      };
    }

    if (listing.createdBy.id !== session.user.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // Delete image files first from uploadThing

    const activeBooking = await prisma.booking.findFirst({
      where: {
        listingId,
        status: {
          notIn: ["RETURNED", "CANCELLED", "NO_SHOW"],
        },
      },
      select: {
        id: true,
      },
    });

    if (activeBooking) {
      return {
        success: false,
        message:
          "This listing has an active booking and cannot be deleted. Resolve the booking first.",
      };
    }
    const existingBooking = await prisma.booking.findFirst({
      where: {
        listingId,
      },
      select: {
        id: true,
      },
    });

    if (existingBooking) {
      return {
        success: false,
        message:
          "This listing cannot be deleted because it has booking history. You can deactivate it instead.",
      };
    }

    await prisma.listing.deleteMany({
      where: {
        id: listingId,
      },
    });

    return {
      success: true,
      message: "Listing deleted successfully",
    };
  } catch (error) {
    console.log("delete listing failed", error);
    return {
      success: false,
      error,
      message: "Something went wrong",
    };
  }
};
