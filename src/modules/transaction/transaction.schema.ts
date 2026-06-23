import { z } from "zod";
import { TransactionType } from "@prisma/client";

export const transactionTypeSchema = z.nativeEnum(TransactionType);

export const createTransactionSchema = z.object({
  type: transactionTypeSchema,
  amount: z.coerce
    .number()
    .positive("Valor deve ser positivo")
    .max(999_999_999.99, "Valor excede o limite permitido"),
  description: z
    .string()
    .trim()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  transactionDate: z.coerce.date(),
  categoryId: z.string().uuid("ID de categoria inválido"),
});

export const updateTransactionSchema = createTransactionSchema;

export const transactionIdParamSchema = z.object({
  id: z.string().uuid("ID de transação inválido"),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
