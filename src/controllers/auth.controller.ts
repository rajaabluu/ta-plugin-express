import { Request, Response } from "express";
import { RegisterSchema } from "../lib/validator/user.schema";
import { ZodError } from "zod/v3";
import { StatusCodes } from "http-status-codes";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../lib/config/env";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (result.length == 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "authorization failed",
        error: {
          code: "invalid_credentials",
          message: "incorrect email or password",
        },
      });
    }
    const user = result[0];

    const match = await bcrypt.compare(password, user?.password as string);

    if (!match) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "incorrect email or password",
      });
    }

    const token = jwt.sign({ id: user?.id }, env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(StatusCodes.OK).json({
      message: "login success",
      data: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        access_token: token,
      },
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "an unexpected error occured in server",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (result.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "validation error",
        errors: [
          {
            field: "email",
            code: "duplicate_index",
            message: "email telah digunakan user lain",
          },
        ],
      });
    }

    const SALT_ROUNDS = 10;
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [user] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning();

    return res.status(StatusCodes.CREATED).json({
      message: "user succesfully created",
      data: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "an unexpected error occured in server",
    });
  }
};
