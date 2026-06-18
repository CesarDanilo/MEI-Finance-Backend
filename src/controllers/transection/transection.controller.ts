import { Request, Response } from "express";
import { PrismaTransectionRepository } from "../../repository/PrismaTransectionRepository";
import { CreateTransectionService } from "../../services/transection/create.transection.service";
import { ReadTransectionService } from "../../services/transection/read.transection.service";
import { FindByIdTransectionService } from "../../services/transection/findById.transection.service";
import { UpdateTransectionService } from "../../services/transection/update.transection.service";
import { DeleteTransectionService } from "../../services/transection/delete.transaction.service";
import { ITransactionCreateDTO, IUpdateTransactionDTO } from "../../interfaces/ITransectionRepository";

const transectionRepository = new PrismaTransectionRepository();
const createTransectionService = new CreateTransectionService(transectionRepository);
const readAllTransectionService = new ReadTransectionService(transectionRepository);
const findByIdTransectionService = new FindByIdTransectionService(transectionRepository);
const updateTransectionService = new UpdateTransectionService(transectionRepository);
const deleteTransectionService = new DeleteTransectionService(transectionRepository);

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

    async readAll(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const transaction = await readAllTransectionService.execute(userId);
            return res.status(200).json({ data: transaction });
        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }

    async readById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const transaction = await findByIdTransectionService.execute(id);
            return res.status(200).json({ data: transaction });
        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const data: IUpdateTransactionDTO = req.body;
            const transaction = await updateTransectionService.execute(id, data);
            return res.status(200).json({ data: transaction });
        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const transaction = await deleteTransectionService.execute(id);
            return res.status(200).json({ data: transaction });
        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }
}