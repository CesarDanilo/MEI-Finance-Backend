import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";
import { getEnv } from "../config/env";
import { logger } from "../config/logger";

/**
 * Handler global — deve ser o último middleware registrado no Express.
 * Em produção, nunca expõe stack trace ao cliente.
 */
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    if (!error.isOperational) {
      logger.error({ err: error }, "Erro operacional inesperado");
    }
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  logger.error({ err: error }, "Erro não tratado");

  const isProduction = getEnv().NODE_ENV === "production";
  res.status(500).json({
    message: isProduction ? "Erro interno do servidor" : error.message,
  });
}
