import { timestamp } from "drizzle-orm/pg-core";
import { integer, serial, varchar, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
});

export const movies = pgTable("movies", {
  id: serial().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  director: varchar({ length: 255 }).notNull(),
  releaseYear: integer().notNull(),
  description: text(),
  posterUrl: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
});
