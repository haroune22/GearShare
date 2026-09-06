/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { CredentialsSignin, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "./lib/prisma";
import { compare } from "bcryptjs";
import { signInSchema } from "./lib/zod";
import { fi } from "zod/v4/locales";

declare module "next-auth" {
  interface User {
    profilePic?: string | null;
  }
  interface Session {
    user: {
      profilePic?: string | null;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
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

        if (!user) {
          throw new Error("invalid email or password");
        }

        const isMatched = await compare(password, user.password);

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
      if (token?.sub && token?.profilePic) {
        session.user.id = token.sub;
        session.user.profilePic = token.profilePic as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.profilePic = user.profilePic;
      }
      return token;
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;

          if (!email || !name || !image || !id) {
            throw new Error("invalid google account");
          }

          const existingUser = await prisma.user.findFirst({
            where: {
              email,
            },
          });

          if (!existingUser) {
            const user = await prisma.user.create({
              data: {
                email,
                password: "",
                userName: name,
                profilePic: image,
              },
            });
          } else {
            const userAccount = await prisma.account.findFirst({
              where: {
                userId: existingUser.id,
              },
            });
            if (!userAccount) {
              await prisma.account.create({
                data: {
                  provider: "google",
                  image: image,
                  providerAccountId: id,
                  userId: existingUser.id,
                },
              });
            } else {
              return true;
            }
          }
        } catch (error) {
          throw new Error("Error while creating user");
        }
      }

      if (account?.provider === "credentials") {
        return true;
      } else {
        return false;
      }
    },
  },
});
