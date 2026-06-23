import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";
import { UnauthorizedError } from "../shared/errors/AppError";

interface TokenPayload {
  sub: string;
}

/**
 * Valida access token JWT no header Authorization.
 * Restringe algoritmo a HS256 para mitigar algorithm-confusion attacks.
 */
export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token não informado");
    }

    const token = authHeader.slice("Bearer ".length);
    const decoded = jwt.verify(token, getEnv().JWT_SECRET, {
      algorithms: ["HS256"],
    }) as TokenPayload;

    req.user = { id: decoded.sub };
    next();
  } catch {
    next(new UnauthorizedError("Token inválido ou expirado"));
  }
}
