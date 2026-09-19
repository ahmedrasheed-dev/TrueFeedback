import { z } from 'zod';


export const usernameValidation = z.string()
    .trim()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be atleast 8 characters")
        .max(20, "Password must be no more than 20 characters")
})