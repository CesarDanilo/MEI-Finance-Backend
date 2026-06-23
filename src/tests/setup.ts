import { beforeEach } from "vitest";
import { resetEnvCache } from "../config/env";

process.env.NODE_ENV = "test";
process.env.PORT = "3333";
process.env.DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/mei_finance_test?schema=public";
process.env.JWT_SECRET = "a".repeat(64);
process.env.JWT_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_SECRET = "b".repeat(64);
process.env.JWT_REFRESH_EXPIRES_IN = "7d";
process.env.BCRYPT_SALT_ROUNDS = "10";
process.env.CORS_ALLOWED_ORIGINS = "http://localhost:5173";
process.env.RATE_LIMIT_WINDOW_MS = "900000";
process.env.RATE_LIMIT_MAX_REQUESTS = "100";
process.env.LOGIN_RATE_LIMIT_MAX = "5";
process.env.LOG_LEVEL = "silent";
process.env.MEI_ANNUAL_LIMIT = "81000";
process.env.MEI_ALERT_THRESHOLD_PERCENT = "80";

beforeEach(() => {
  resetEnvCache();
});
