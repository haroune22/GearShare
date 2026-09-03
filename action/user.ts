"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
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
      redirect: true,
    });
  } catch (error) {
    if (error instanceof AuthError) {
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
