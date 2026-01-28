import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8000),
  DATABASE_URL: z.string().min(1, { error: "DATABASE_URL is missing." }),
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
