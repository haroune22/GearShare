"use server";
import { auth } from "@/auth";
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
