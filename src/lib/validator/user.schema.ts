import z from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "name is required" })
    .pipe(
      z
        .string()
        .min(3, { error: "name is too short, must be at least 3 character" }),
    ),
  email: z.email({ error: "email format is invalid" }),
  password: z
    .string()
    .trim()
    .min(1, { error: "password is required" })
    .pipe(
      z.string().min(6, {
        error: "password is too short, must be at least 6 character",
      }),
    ),
});
