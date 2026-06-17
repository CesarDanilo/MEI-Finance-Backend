// domain/transaction/ITransactionRepository.ts
import { Transaction } from "@prisma/client";

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface ITransactionCreateDTO {
  type: TransactionType;
  amount: number;
  description?: string;
  transactionDate: Date;
  userId: string;
  categoryId: string;
}

export interface IUpdateTransactionDTO {
  type: TransactionType;
  amount: number;
  description?: string;
  transactionDate: Date;
  categoryId: string;
}

export interface ITransactionRepository {
  create(data: ITransactionCreateDTO): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findAll(userId: string): Promise<Transaction[]>;
  update(id: string, data: IUpdateTransactionDTO): Promise<Transaction>;
  delete(id: string): Promise<Transaction>;
}