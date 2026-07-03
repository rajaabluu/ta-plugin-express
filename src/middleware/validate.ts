import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((err) => {
        return {
          field: err.path.join(),
          code: err.code,
          message: err.message,
        };
      });
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "validation error",
        errors,
      });
    }
    req.body = result.data;
    next();
  };
