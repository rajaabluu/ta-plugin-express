import z from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().transform(Number),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(" Invalid environment variables:", result.error.format());
  process.exit(1);
}

export const env = result.data;
