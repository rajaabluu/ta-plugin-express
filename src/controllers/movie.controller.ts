import { Request, Response } from "express";
import { db } from "../lib/db";
import { movies } from "../lib/db/schema";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(movies);
    return res.status(StatusCodes.OK).json({
      message: "movies data retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("error on getting movies:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "an unexpected error occured in server",
    });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await db
      .select()
      .from(movies)
      .where(eq(movies.id, id))
      .limit(1);
    if (result.length == 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "resource not found",
        error: {
          code: "not_found",
          message: "movie not found",
        },
      });
    }
    const data = result[0];
    return res.status(StatusCodes.OK).json({
      message: "movie retrieved successfully",
      data,
    });
  } catch (err) {
    console.error("error on getting movies:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "an unexpected error occured in server",
    });
  }
};

export const addNewMovie = async (req: Request, res: Response) => {};

export const updateMovie = async (req: Request, res: Response) => {};

export const deleteMovie = async (req: Request, res: Response) => {};
