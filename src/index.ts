import express from "express";
import cors from "cors";
import apiRouter from "./routes/index";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";

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

const swaggerDocs = yaml.load(path.join(__dirname, "docs", "apispec.yaml"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api", apiRouter);

if (env.NODE_ENV != "production") {
  app.listen(PORT, () => console.log("app started on http://localhost:3000"));
}

export default app;
