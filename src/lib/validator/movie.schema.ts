import z from "zod";

export const MovieSchema = z.object({
  title: z.string().trim().min(1, { error: "judul movie harus diisi" }),
  director: z.string().trim().min(1, { error: "director harus diisi" }),
  release_year: z
    .string()
    .trim()
    .min(1, { error: "tahun rilis harus diisi" })
    .refine((value) => !Number.isNaN(Number(value)), {
      error: "Tahun rilis harus berupa angka",
    })
    .transform(Number),
  description: z.string().trim().optional(),
  poster_url: z.string().trim(),
});
