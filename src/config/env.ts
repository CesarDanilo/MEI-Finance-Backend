import { z } from "zod";

/**
 * Valida todas as variáveis de ambiente no boot.
 * A aplicação não inicia se alguma obrigatória estiver ausente ou inválida —
 * evita falhas silenciosas em produção (ex.: JWT_SECRET vazio).
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET deve ter no mínimo 32 caracteres (use crypto.randomBytes(64).toString('hex'))"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET deve ter no mínimo 32 caracteres"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .transform((value) =>
      value.split(",").map((origin) => origin.trim()).filter(Boolean)
    ),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  MEI_ANNUAL_LIMIT: z.coerce.number().positive().default(81_000),
  MEI_ALERT_THRESHOLD_PERCENT: z.coerce.number().min(0).max(100).default(80),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function loadEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Variáveis de ambiente inválidas:");
    console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));
    process.exit(1);
  }

  cachedEnv = result.data;
  return cachedEnv;
}

export function getEnv(): Env {
  return loadEnv();
}

/** Reseta cache — usado apenas em testes. */
export function resetEnvCache(): void {
  cachedEnv = null;
}
