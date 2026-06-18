import { Request, Response } from "express";
import { PrismaTransectionRepository } from "../../repository/PrismaTransectionRepository";
import { CreateTransectionService } from "../../services/transection/create.transection.service";
import { ITransactionCreateDTO } from "../../interfaces/ITransectionRepository";
const transectionRepository = new PrismaTransectionRepository();
const createTransectionService = new CreateTransectionService(transectionRepository);

export class TransectionController {

    async create(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const data: ITransactionCreateDTO = req.body;
            data.userId = userId;
            const transection = await createTransectionService.execute(data);
            return res.status(201).json({ data: transection, message: "Transection criada com sucesso!" });
        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }
}