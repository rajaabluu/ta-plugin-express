import { Router } from "express";
import { verifyToken } from "../middleware/jwt";
import * as movieController from "../controllers/movie.controller";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import {
  AddMovieSchema,
  UpdateMovieSchema,
} from "../lib/validator/movie.schema";

const r = Router();

r.use(verifyToken);

r.get("/", movieController.getAllMovies);
r.get("/:id", movieController.getMovieById);
r.post(
  "/",
  upload.single("poster"),
  validate(AddMovieSchema),
  movieController.addNewMovie,
);
r.put("/:id", validate(UpdateMovieSchema), movieController.updateMovie);
r.delete("/:id", movieController.deleteMovie);

export default r;
