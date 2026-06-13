import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/create.user.service";
import { PrismaUserRepository } from "../../repository/PrismaUserRepository";
import { createUserSchema } from "../../schemas/user.schema";

const userRepository = new PrismaUserRepository();
const userService = new CreateUserService(userRepository);

export class UserController {

    async Create(req: Request, res: Response) {
        try {
            const { name, email, passwordHash } = req.body;
            const result = createUserSchema.safeParse({ name, email, passwordHash });

            if (!result.success) {
                return res.status(400).json({
                    message: "Dados inválidos",
                    error: result.error.message
                })
            }

            const user = await userService.execute(result.data);
            return res.status(201).json({ data: user, message: "Usuário criado com sucesso!" })

        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }
}   