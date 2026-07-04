import z from "zod";

export const AddMovieSchema = z.object({
  title: z.string().trim().min(1, { error: "title is required" }),
  director: z.string().trim().min(1, { error: "director is required" }),
  releaseYear: z
    .string()
    .trim()
    .min(1, { error: "releaseYear is required" })
    .refine((value) => !Number.isNaN(Number(value)), {
      error: "releaseYear value must be number",
    })
    .transform(Number),
  description: z.string().trim().optional(),
});

export const UpdateMovieSchema = AddMovieSchema.partial();
