import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { getEnv } from "./config/env";
import { logger } from "./config/logger";
import { apiRateLimiter } from "./middlewares/rateLimiter";
import { errorHandler } from "./middlewares/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { userRouter } from "./modules/user/user.routes";
import { categoryRouter } from "./modules/category/category.routes";
import { transactionRouter } from "./modules/transaction/transaction.routes";
import { meiLimitRouter } from "./modules/mei-limit/mei-limit.routes";
import { reportsRouter } from "./modules/reports/reports.routes";
import { healthRouter } from "./routes/health.routes";

const app = express();
const env = getEnv();

/**
 * Ordem dos middlewares importa:
 * 1. helmet — headers de segurança antes de qualquer resposta
 * 2. cors — whitelist explícita (nunca '*' em produção)
 * 3. compression — após parsers, antes das rotas
 * 4. rate limit — após parsers para contar requisições válidas
 */
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.use(compression());
app.use(pinoHttp({ logger }));
app.use(cookieParser());
app.use(express.json());
app.use(apiRateLimiter);

app.use("/api", healthRouter);
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", transactionRouter);
app.use("/api", meiLimitRouter);
app.use("/api", reportsRouter);

app.use(errorHandler);

export { app };
