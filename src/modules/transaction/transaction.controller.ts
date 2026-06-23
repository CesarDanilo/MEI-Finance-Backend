import { Request, Response, NextFunction } from "express";
import { CategoryRepository } from "../category/category.repository";
import { TransactionRepository } from "./transaction.repository";
import { TransactionService } from "./transaction.service";

const transactionRepository = new TransactionRepository();
const categoryRepository = new CategoryRepository();
const transactionService = new TransactionService(
  transactionRepository,
  categoryRepository
);

export class TransactionController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transaction = await transactionService.create(req.user.id, req.body);
      res
        .status(201)
        .json({ data: transaction, message: "Transação criada com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async readAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transactions = await transactionService.findAll(req.user.id);
      res.status(200).json({ data: transactions });
    } catch (error) {
      next(error);
    }
  }

  async readById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transaction = await transactionService.findById(
        req.params.id as string,
        req.user.id
      );
      res.status(200).json({ data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transaction = await transactionService.update(
        req.params.id as string,
        req.user.id,
        req.body
      );
      res.status(200).json({ data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transaction = await transactionService.delete(
        req.params.id as string,
        req.user.id
      );
      res.status(200).json({ data: transaction });
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();
