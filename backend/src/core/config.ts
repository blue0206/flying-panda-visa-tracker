import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8000),
  DATABASE_URL: z.string().min(1, { error: "DATABASE_URL is missing." }),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "fatal"], {
    error: "LOG_LEVEL is missing.",
  }),
});

const parsedEnv = EnvSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error(
    "Invalid Environment Variables.",
    JSON.stringify(z.prettifyError(parsedEnv.error)),
  );
  process.exit(1);
}

export const envConfig = parsedEnv.data;
export type EnvConfig = z.infer<typeof EnvSchema>;
