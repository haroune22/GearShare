import { ListingStatus } from "./generated/prisma/enums";

export type ListingFormData = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "Rent" | "Borrow";
  categoryId: string;
  images: string[];
  location?: {
    address?: string;
    latitude?: string;
    longitude?: string;
  };
  status?: ListingStatus;
  createdBy?: {
    id?: string;
  };
};

export type createListingData = {
  name: string;
  description: string;
  price: number;
  type: "Rent" | "Borrow";
  categoryId: string;
  location: {
    address: string;
    latitude: string;
    longitude: string;
  };
};

import type { Prisma } from "@/lib/generated/prisma/client";

export type BookingWithRelations = Prisma.BookingGetPayload<{
  select: {
    id: true;
    totalPrice: true;
    createdAt: true;
    ownerId: true;
    renterId: true;
    pickupAt: true;
    returnAt: true;
    status: true;
    PricePerDay: true;
    listing: {
      select: {
        id: true;
        name: true;
        images: true;
      };
    };
    owner: {
      select: {
        id: true;
        userName: true;
        image: true;
      };
    };
    renter: {
      select: {
        id: true;
        userName: true;
        image: true;
      };
    };
  };
}>;

export type BookingCardData = Omit<
  BookingWithRelations,
  "owner" | "renter" | "PricePerDay" | "totalPrice"
> & {
  PricePerDay: number;
  totalPrice: number;
  otherUser: BookingWithRelations["owner"];
};
