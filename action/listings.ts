"use server";
import { prisma } from "@/lib/prisma";

export const getListings = async (
  categorySlug?: string,
  name?: string,
  take: number = 10,
  skip: number = 0,
) => {
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
