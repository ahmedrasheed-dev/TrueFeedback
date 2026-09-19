import { z } from "zod";

export const signInSchema = z.object({
    identifier: z
        .string()
        .trim()
        .min(3, "Identifier must be at least 3 characters")
        .max(100, "Identifier is too long"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password is too long"),
});