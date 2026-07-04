import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { movies } from "../lib/db/schema";

export const findMovieById = async (id: number) => {
  const [movie] = await db
    .select()
    .from(movies)
    .where(eq(movies.id, id))
    .limit(1);

  return movie;
};

export const parseId = (id: string): number | null => {
  const value = Number(id);

  return Number.isNaN(value) ? null : value;
};
