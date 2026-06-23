import { z } from "zod";
import { TransactionType } from "@prisma/client";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  type: z.nativeEnum(TransactionType),
});

export const updateCategorySchema = createCategorySchema;

export const categoryIdParamSchema = z.object({
  id: z.string().uuid("ID de categoria inválido"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
