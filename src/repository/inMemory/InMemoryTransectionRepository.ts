import { randomUUID } from "crypto";
import { Decimal } from "@prisma/client/runtime/library";
import { Transaction } from "@prisma/client";
import {
    ITransactionCreateDTO,
    ITransactionRepository,
    IUpdateTransactionDTO,
} from "../../interfaces/ITransectionRepository";

export class InMemoryTransactionRepository implements ITransactionRepository {
    public items: Transaction[] = [];

    async create(data: ITransactionCreateDTO): Promise<Transaction> {
        const transaction: Transaction = {
            id: randomUUID(),
            type: data.type,
            amount: new Decimal(data.amount),
            description: data.description ?? null,
            transactionDate: data.transactionDate,
            userId: data.userId,
            categoryId: data.categoryId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.items.push(transaction);
        return transaction;
    }

    async findById(id: string): Promise<Transaction | null> {
        return this.items.find((item) => item.id === id) ?? null;
    }

    async findAll(userId: string): Promise<Transaction[]> {
        return this.items.filter((item) => item.userId === userId);
    }

    async update(id: string, data: IUpdateTransactionDTO): Promise<Transaction> {
        const index = this.items.findIndex((item) => item.id === id);

        if (index === -1) {
            throw new Error("Transaction not found"); // <-- estava faltando
        }

        this.items[index] = {
            ...this.items[index],
            ...data,
            amount: new Decimal(data.amount),
            description: data.description ?? null, // <-- garante null quando omitido
        };

        return this.items[index];
    }

    async delete(id: string): Promise<Transaction> {
        const index = this.items.findIndex((item) => item.id === id);

        if (index === -1) {
            throw new Error("Transaction not found"); // <-- estava faltando
        }

        const transaction = this.items[index];
        this.items.splice(index, 1);
        return transaction;
    }q
}