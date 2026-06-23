import { Request, Response, NextFunction } from "express";
import { TransactionRepository } from "../transaction/transaction.repository";
import { MeiLimitService } from "./mei-limit.service";

const meiLimitService = new MeiLimitService(new TransactionRepository());

export class MeiLimitController {
  async getLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = await meiLimitService.getLimitStatus(req.user.id);
      res.status(200).json({ data: status });
    } catch (error) {
      next(error);
    }
  }
}

export const meiLimitController = new MeiLimitController();
