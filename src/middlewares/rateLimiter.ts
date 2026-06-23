import rateLimit from "express-rate-limit";
import { getEnv } from "../config/env";

/** Limite geral da API — mitiga abuso de volume e DoS leve. */
export const apiRateLimiter = rateLimit({
  windowMs: getEnv().RATE_LIMIT_WINDOW_MS,
  max: getEnv().RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas requisições. Tente novamente mais tarde." },
});

/**
 * Limite agressivo só no login — mitiga brute force de senha,
 * o vetor de ataque mais comum em endpoints de autenticação.
 */
export const loginRateLimiter = rateLimit({
  windowMs: getEnv().RATE_LIMIT_WINDOW_MS,
  max: getEnv().LOGIN_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas tentativas de login. Tente novamente mais tarde." },
});
