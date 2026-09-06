/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { CredentialsSignin, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "./lib/prisma";
import { compare } from "bcryptjs";
import { signInSchema } from "./lib/zod";
import { PrismaAdapter } from "@auth/prisma-adapter";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    profilePic?: string | null;
    userName: string;
  }
  interface Session {
    user: {
      profilePic?: string | null;
      userName: string;
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    userName: string;
    profilePic?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = await signInSchema.parseAsync(credentials);

        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email & password");
        }

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (!user || !user.password) {
          throw new Error("invalid email or password");
        }

        const isMatched = await compare(password, user?.password);

        if (!isMatched) {
          throw new Error("password did not match");
        }
        const { password: _, ...userData } = user;

        return userData;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && token.profilePic && token.userName) {
        session.user.id = token.sub;
        session.user.profilePic = token.profilePic;
        session.user.userName = token.userName;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.profilePic = user.profilePic;
        token.userName = user.userName;
      }
      return token;
    },
  },
});
