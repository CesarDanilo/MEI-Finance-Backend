import { prisma } from "../../config/database";
import { Transaction, TransactionType } from "@prisma/client";

export type CreateTransactionDTO = {
  type: TransactionType;
  amount: number;
  description?: string;
  transactionDate: Date;
  userId: string;
  categoryId: string;
};

export type UpdateTransactionDTO = Omit<CreateTransactionDTO, "userId">;

export class TransactionRepository {
  async create(data: CreateTransactionDTO): Promise<Transaction> {
    return prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        description: data.description,
        transactionDate: data.transactionDate,
        userId: data.userId,
        categoryId: data.categoryId,
      },
    });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Transaction | null> {
    return prisma.transaction.findFirst({
      where: { id, userId },
    });
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: { transactionDate: "desc" },
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTransactionDTO
  ): Promise<Transaction> {
    const existing = await this.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new Error("Transação não encontrada");
    }
    return prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Transaction> {
    const existing = await this.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new Error("Transação não encontrada");
    }
    return prisma.transaction.delete({
      where: { id },
    });
  }

  /**
   * Soma receitas (INCOME) do ano vigente para cálculo do limite MEI.
   */
  async sumIncomeByYear(userId: string, year: number): Promise<number> {
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));

    const result = await prisma.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.INCOME,
        transactionDate: { gte: start, lt: end },
      },
      _sum: { amount: true },
    });

    return Number(result._sum.amount ?? 0);
  }

  async aggregateByTypeForPeriod(
    userId: string,
    start: Date,
    end: Date
  ): Promise<{ type: TransactionType; total: number; count: number }[]> {
    const grouped = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        transactionDate: { gte: start, lt: end },
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    return grouped.map((row) => ({
      type: row.type,
      total: Number(row._sum.amount ?? 0),
      count: row._count.id,
    }));
  }
}
