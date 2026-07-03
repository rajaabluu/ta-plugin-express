import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/config/env";
import { StatusCodes } from "http-status-codes";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "unauthorized",
      error: {
        code: "invalid_token",
        message: "invalid or expired access token",
      },
    });
  }

  const token = req.headers.authorization?.slice(7) as string;

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    console.log(payload);
    next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "unauthorized",
      error: {
        code: "invalid_token",
        message: "invalid or expired access token",
      },
    });
  }
};
