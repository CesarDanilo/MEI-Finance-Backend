import { z } from "zod";

export const reportsQuerySchema = z.object({
  period: z
    .string()
    .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, "Período inválido. Use YYYY ou YYYY-MM")
    .optional(),
});

export type ReportsQuery = z.infer<typeof reportsQuerySchema>;
