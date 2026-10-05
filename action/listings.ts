"use server";
import { auth } from "@/auth";
import { ListingStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createListingData } from "@/lib/types";

export const getListings = async ({
  categorySlug,
  name,
  take = 10,
  skip = 0,
}: {
  categorySlug?: string;
  name?: string;
  take?: number;
  skip?: number;
}) => {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        ...(name && { name: { contains: name } }),
        ...(categorySlug && {
          category: {
            slug: categorySlug,
          },
        }),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            userName: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
    });
    return listings;
  } catch (error) {
    console.log(error);
  }
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
  if (!listingId) {
    throw new Error("Listing Id required");
  }
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
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

    await prisma.listing.delete({
      where: {
        id: listingId,
      },
    });

    return {
      success: true,
      message: "Listing deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error,
      message: "Something went wrong",
    };
  }
};
