import * as z from "zod";
import { Prisma } from "./generated/prisma/client";

export const signInSchema = z.object({
  email: z
    .string("Email is required")
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string("Password is required")
    .min(6, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = z.object({
  email: z
    .string("Email is required")
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address." }),
  username: z
    .string("username is required")
    .min(2, "username can't be less then 2 characters"),
  password: z
    .string("Password is required")
    .min(1, "Password is required")
    .min(6, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type signInData = z.infer<typeof signInSchema>;
export type signUpData = z.infer<typeof signUpSchema>;

export type ListingWithOwner = Prisma.ListingGetPayload<{
  include: {
    createdBy: {
      select: {
        id: true;
        userName: true;
        name: true;
        image: true;
      };
    };
  };
}>;

export const formSchema = z.object({
  name: z
    .string()
    .min(3, "Item name must be at least 3 characters.")
    .max(50, "Item name must be at most 50 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(500, "Description must be at most 500 characters."),
  price: z.number().min(0, "Price cannot be negative."),
  type: z.enum(["Rent", "Borrow"]),
  category: z.string().min(1, "Please select a category."),
  images: z.array,
});
