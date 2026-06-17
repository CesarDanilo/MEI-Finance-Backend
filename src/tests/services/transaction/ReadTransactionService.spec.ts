import { describe, it, expect, beforeEach } from "vitest";
import { ReadTransectionService } from "../../../services/transection/read.transection.service";
import { InMemoryTransactionRepository } from "../../../repository/inMemory/InMemoryTransectionRepository";
import { TransactionType } from "../../../interfaces/ITransectionRepository";

describe("ReadTransactionService", () => {
    let repository: InMemoryTransactionRepository;
    let sut: ReadTransectionService;

    beforeEach(() => {
        repository = new InMemoryTransactionRepository();
        sut = new ReadTransectionService(repository);
    });

    it("should return all transactions from a user", async () => {
        const base = {
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        };

        await repository.create({ ...base, type: TransactionType.INCOME, amount: 1000 });
        await repository.create({ ...base, type: TransactionType.EXPENSE, amount: 200 });

        const transactions = await sut.execute("user-01");

        expect(transactions).toHaveLength(2);
    });

    it("should return only transactions from the requested user", async () => {
        const base = {
            transactionDate: new Date("2024-01-01"),
            categoryId: "category-01",
        };

        await repository.create({ ...base, userId: "user-01", type: TransactionType.INCOME, amount: 1000 });
        await repository.create({ ...base, userId: "user-02", type: TransactionType.EXPENSE, amount: 500 });

        const transactions = await sut.execute("user-01");

        expect(transactions).toHaveLength(1);
        expect(transactions[0].userId).toBe("user-01");
    });

    it("should return an empty array when user has no transactions", async () => {
        const transactions = await sut.execute("user-01");

        expect(transactions).toEqual([]);
    });

    it("should return transactions with correct data", async () => {
        await repository.create({
            type: TransactionType.INCOME,
            amount: 750,
            description: "Freelance",
            transactionDate: new Date("2024-02-15"),
            userId: "user-01",
            categoryId: "category-01",
        });

        const transactions = await sut.execute("user-01");

        expect(transactions[0].amount.toNumber()).toBe(750);
        expect(transactions[0].description).toBe("Freelance");
        expect(transactions[0].type).toBe(TransactionType.INCOME);
    });
});