import express from "express";
import cors from "cors";
import apiRouter from "./routes/index";

import "dotenv/config";
import { env } from "./lib/config/env";

const PORT = env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api", apiRouter);

app.listen(PORT, () => console.log("app started on http://localhost:3000"));
