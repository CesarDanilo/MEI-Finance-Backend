import { Request, Response, NextFunction } from "express";
import { TransactionRepository } from "../transaction/transaction.repository";
import { ReportsService } from "./reports.service";

const reportsService = new ReportsService(new TransactionRepository());

export class ReportsController {
  async getReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await reportsService.getReport(req.user.id, req.query);
      res.status(200).json({ data: report });
    } catch (error) {
      next(error);
    }
  }
}

export const reportsController = new ReportsController();
