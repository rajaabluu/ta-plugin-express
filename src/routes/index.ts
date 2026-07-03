import { Router } from "express";
import authRouter from "./auth";
import movieRouter from "./movie";

const r = Router();

r.use("/auth", authRouter);
r.use("/movies", movieRouter);

export default r;
