import { TransactionType } from "@prisma/client";
import { TransactionRepository } from "../transaction/transaction.repository";
import { ReportsQuery } from "./reports.schema";

function parsePeriod(period: string): { start: Date; end: Date; label: string } {
  if (/^\d{4}$/.test(period)) {
    const year = Number(period);
    return {
      start: new Date(Date.UTC(year, 0, 1)),
      end: new Date(Date.UTC(year + 1, 0, 1)),
      label: String(year),
    };
  }

  const [yearStr, monthStr] = period.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;

  return {
    start: new Date(Date.UTC(year, month, 1)),
    end: new Date(Date.UTC(year, month + 1, 1)),
    label: period,
  };
}

export class ReportsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  /**
   * Agrega transações por tipo usando groupBy do Prisma —
   * evita carregar todos os registros em memória conforme o volume cresce.
   */
  async getReport(userId: string, query: ReportsQuery) {
    const period =
      query.period ??
      (() => {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        return `${now.getFullYear()}-${month}`;
      })();

    const { start, end, label } = parsePeriod(period);
    const aggregated =
      await this.transactionRepository.aggregateByTypeForPeriod(
        userId,
        start,
        end
      );

    const income =
      aggregated.find((row) => row.type === TransactionType.INCOME)?.total ?? 0;
    const expense =
      aggregated.find((row) => row.type === TransactionType.EXPENSE)?.total ?? 0;

    return {
      period: label,
      start,
      end,
      income,
      expense,
      balance: income - expense,
      breakdown: aggregated,
    };
  }
}
