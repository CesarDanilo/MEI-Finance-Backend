import { Request, Response, NextFunction } from "express";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ data: user, message: "Usuário criado com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
