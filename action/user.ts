"use server";

import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileFormData, ProfileUser } from "@/lib/types";
import { signInSchema } from "@/lib/zod";
import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const login = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData?.get("password");

  const validateSchema = signInSchema.safeParse({ email, password });

  if (!validateSchema.success) {
    throw new Error("all inputs required");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.log(error);
      redirect(`/login?error=${error.type}`);
    }
  }
  redirect("/");
};

const register = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const userName = formData.get("username") as string;

  if (!email || !password || !userName) {
    throw new Error("Please fill all fields");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) throw new Error("user already exists");

  const hashedPassword = await hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      userName,
      password: hashedPassword,
    },
  });
  console.log(`User created successfully 🥂`);
  redirect("/login");
};

export { register, login };

export const getUser = async (userId: string): Promise<ProfileUser | null> => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const isOwner = session.user.id === userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      userName: true,
      image: true,
      createdAt: true,

      ...(isOwner && {
        email: true,
        phoneNumber: true,
        age: true,
        address: true,
      }),

      listings: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          images: true,
          price: true,
          type: true,
          status: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    listings: user.listings.map((listing) => ({
      ...listing,
      price: listing.price.toString(),
    })),
  };
};

export const updateUser = async (id: string, data: ProfileFormData) => {
  try {
    return {
      status: 200,
      success: true,
      message: "Listing deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      success: false,
      message: "Internal Server Error",
    };
  }
};
