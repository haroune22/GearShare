import * as z from "zod";

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
