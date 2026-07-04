import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { MulterError } from "multer";

import cloudinary from "../lib/cloudinary";
import { db } from "../lib/db";
import { movies } from "../lib/db/schema";
import { findMovieById, parseId } from "../helper/movie";
import { uploadImage } from "../helper/upload";

export const getAllMovies = async (_: Request, res: Response) => {
  try {
    const movieList = await db.select().from(movies);
    return res.status(StatusCodes.OK).json({
      message: "movies data retrieved successfully",
      data: movieList,
    });
  } catch (err) {
    console.error("failed to get movies:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: "SERVER_ERROR",
      message: "an unexpected error occurred on the server",
    });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id as string);

    if (id === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: "INVALID_FORMAT",
        message: "invalid param id format",
      });
    }

    const movie = await findMovieById(id);

    if (!movie) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: "RESOURCE_NOT_FOUND",
        message: "data movie not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "movie retrieved successfully",
      data: movie,
    });
  } catch (err) {
    console.error("failed to get movie:", err);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: "SERVER_ERROR",
      message: "an unexpected error occurred on the server",
    });
  }
};

export const addNewMovie = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "validation error",
        code: "VALIDATION_ERROR",
        errors: [
          {
            field: "poster",
            message: "poster is required.",
          },
        ],
      });
    }

    const { title, director, releaseYear, description } = req.body;

    const image = await uploadImage(req.file.buffer);

    const [createdMovie] = await db
      .insert(movies)
      .values({
        title,
        director,
        releaseYear: Number(releaseYear),
        description,
        posterUrl: image.secure_url,
      })
      .returning();

    return res.status(StatusCodes.CREATED).json({
      message: "movie created successfully ",
      data: createdMovie,
    });
  } catch (err) {
    console.error("failed to create movie:", err);

    if (err instanceof MulterError) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "upload image error",
        code: "VALIDATION_ERROR",
        errors: [
          {
            field: "image",
            message: err.message,
          },
        ],
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: "SERVER_ERROR",
      message: "an unexpected error occurred on the server",
    });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id as string);

    if (id === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: "INVALID_FORMAT",
        message: "invalid param id format",
      });
    }

    const movie = await findMovieById(id);

    if (!movie) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: "RESOURCE_NOT_FOUND",
        message: "data movie not found",
      });
    }

    const { title, director, releaseYear, description } = req.body;

    const [updatedMovie] = await db
      .update(movies)
      .set({
        title,
        director,
        releaseYear,
        description,
      })
      .where(eq(movies.id, id))
      .returning();

    return res.status(StatusCodes.OK).json({
      message: "movie updated successfully",
      data: updatedMovie,
    });
  } catch (err) {
    console.error("failed to update movie:", err);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: "SERVER_ERROR",
      message: "an unexpected error occurred on the server",
    });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id as string);

    if (id === null) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: "INVALID_FORMAT",
        message: "invalid param id format",
      });
    }

    const movie = await findMovieById(id);

    if (!movie) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: "RESOURCE_NOT_FOUND",
        message: "data movie not found",
      });
    }

    const publicId =
      "test/movies/" + movie.posterUrl.split("/").at(-1)?.split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    await db.delete(movies).where(eq(movies.id, id));

    return res.status(StatusCodes.OK).json({
      message: "movie deleted successfully",
    });
  } catch (err) {
    console.error("failed to delete movie:", err);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: "SERVER_ERROR",
      message: "an unexpected error occurred on the server",
    });
  }
};
