import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { ValidationError } from "../shared/errors/AppError";

type ValidationSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

/**
 * Middleware genérico de validação Zod — DRY para todas as rotas.
 * Substitui req.body/params/query pelos dados parseados (trim, coerce, etc.).
 */
export function validateRequest(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as Request["params"];
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as Request["query"];
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new ValidationError(error.message));
        return;
      }
      next(new ValidationError());
    }
  };
}
