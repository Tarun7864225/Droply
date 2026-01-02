import * as z from "zod";

export const signInSchema = z.object({
  identifier: z.email({message: "Please enter a valid email address" }),
  password: z.string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});