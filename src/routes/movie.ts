import { Router } from "express";
import { verifyToken } from "../middleware/jwt";
import * as movieController from "../controllers/movie.controller";

const r = Router();

r.use(verifyToken);

r.get("", movieController.getAllMovies);
r.get("/:id", movieController.getMovieById);
r.post("", movieController.addNewMovie);
r.put("/:id", movieController.updateMovie);
r.delete("/:id", movieController.deleteMovie);

export default r;
