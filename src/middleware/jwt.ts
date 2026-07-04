import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "../lib/config/env";
import { StatusCodes } from "http-status-codes";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        code: "AUTH_INVALID_TOKEN",
        message: "invalid or expired access token",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        code: "AUTH_INVALID_TOKEN",
        message: "invalid or expired access token",
      });
    }

    const payload = jwt.verify(token, env.JWT_SECRET);
    console.log(payload);
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        code: "AUTH_TOKEN_EXPIRED",
        message: "invalid or expired access token",
      });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: "AUTH_INVALID_TOKEN",
      message: "invalid or expired access token",
    });
  }
};
