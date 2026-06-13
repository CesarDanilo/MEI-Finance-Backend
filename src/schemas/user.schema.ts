import { z } from "zod";

export const createUserSchema = z.object({
    name: z
        .string()
        .min(2, "Nome deve ter no mínimo 2 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres")
        .trim(),

    email: z
        .string()
        .email("E-mail inválido")
        .toLowerCase()
        .trim(),

    passwordHash: z
        .string()
        .min(8, "Senha deve ter no mínimo 8 caracteres")
        .max(72, "Senha deve ter no máximo 72 caracteres")
        .regex(/[A-Z]/, "Senha deve conter ao menos uma letra maiúscula")
        .regex(/[0-9]/, "Senha deve conter ao menos um número"),
});

export const updateUserSchema = z.object({
    name: z
        .string()
        .min(2, "Nome deve ter no mínimo 2 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres")
        .trim()
        .optional(),

    email: z
        .string()
        .email("E-mail inválido")
        .toLowerCase()
        .trim()
        .optional(),

    passwordHash: z
        .string()
        .min(8, "Senha deve ter no mínimo 8 caracteres")
        .max(72, "Senha deve ter no máximo 72 caracteres")
        .regex(/[A-Z]/, "Senha deve conter ao menos uma letra maiúscula")
        .regex(/[0-9]/, "Senha deve conter ao menos um número")
        .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "Ao menos um campo deve ser fornecido para atualização" }
);



export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;