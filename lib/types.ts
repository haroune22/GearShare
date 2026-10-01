import { ListingStatus } from "./generated/prisma/enums";

export type ListingFormData = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "Rent" | "Borrow";
  categoryId: string;
  images: string[];
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
};
