import { Router } from "express";
const r = Router();
import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { RegisterSchema } from "../lib/validator/user.schema";

r.post("/login", authController.login);
r.post("/register", validate(RegisterSchema), authController.register);

export default r;
