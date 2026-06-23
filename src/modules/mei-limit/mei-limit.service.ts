import { TransactionRepository } from "../transaction/transaction.repository";
import {
  getMeiAlertThresholdPercent,
  getMeiAnnualLimit,
} from "../../shared/utils/mei-limit.constants";

export class MeiLimitService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  /**
   * Calcula uso do limite anual MEI somando receitas (INCOME) do ano vigente.
   * O limite legal é configurável via MEI_ANNUAL_LIMIT (padrão R$ 81.000).
   */
  async getLimitStatus(userId: string, year = new Date().getFullYear()) {
    const accumulated = await this.transactionRepository.sumIncomeByYear(
      userId,
      year
    );
    const limit = getMeiAnnualLimit();
    const usedPercent = limit > 0 ? (accumulated / limit) * 100 : 0;
    const alertThreshold = getMeiAlertThresholdPercent();

    return {
      year,
      accumulated,
      limit,
      usedPercent: Math.round(usedPercent * 100) / 100,
      remaining: Math.max(limit - accumulated, 0),
      alert: usedPercent >= alertThreshold,
      alertThresholdPercent: alertThreshold,
    };
  }
}
