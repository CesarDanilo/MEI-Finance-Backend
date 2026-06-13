import { Request, Response } from "express";
import { AuthenticateUserService } from "../../services/auth/authenticate.user.service";
import { PrismaUserRepository } from "../../repository/PrismaUserRepository";

const authRepository = new PrismaUserRepository();
const authenticateUserService = new AuthenticateUserService(authRepository);

export class AuthenticateController {
    async execute(req: Request, res: Response) {
        try {
            const { email, passwordHash } = req.body;
            const auth = await authenticateUserService.execute(email, passwordHash);
            return res.status(200).json(auth);
        } catch (error: any) {
            return res.status(500).json({ error: error.message })
        }
    }
}