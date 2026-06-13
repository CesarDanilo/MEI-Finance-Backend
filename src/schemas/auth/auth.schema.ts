import z from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("E-mail inválido")
        .toLowerCase()
        .trim(),

    passwordHash: z
        .string()
        .min(1, "Senha é obrigatória"),
});