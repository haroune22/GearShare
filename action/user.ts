"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

const login = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.type };
    }
    return { error: "Something went wrong" };
    console.log(error);
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
