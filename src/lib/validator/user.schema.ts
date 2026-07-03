import z from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "nama harus diisi" })
    .pipe(
      z.string().min(3, { error: "nama terlalu pendek, minimal 3 karakter" }),
    ),
  email: z.email({ error: "format email tidak valid" }),
  password: z
    .string()
    .trim()
    .min(1, { error: "password harus diisi" })
    .pipe(
      z
        .string()
        .min(6, { error: "password terlalu pendek, minimal 6 karakter" }),
    ),
});
