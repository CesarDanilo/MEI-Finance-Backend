// CreateTransactionService.spec.ts
import { describe, it, expect, beforeEach } from "vitest";
import { CreateTransectionService } from "../../../services/transection/create.transection.service";
import { InMemoryTransactionRepository } from "../../../repository/inMemory/InMemoryTransectionRepository";
import { TransactionType } from "../../../interfaces/ITransectionRepository";

describe("CreateTransactionService", () => {
    let repository: InMemoryTransactionRepository;
    let sut: CreateTransectionService;

    beforeEach(() => {
        repository = new InMemoryTransactionRepository();
        sut = new CreateTransectionService(repository);
    });

    it("should create a transaction successfully", async () => {
        const data = {
            type: TransactionType.INCOME,
            amount: 1000,
            description: "Salário",
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        };

        const transaction = await sut.execute(data);

        expect(transaction).toBeDefined();
        expect(transaction.id).toBeDefined();
        expect(transaction.userId).toBe("user-01");
        expect(transaction.categoryId).toBe("category-01");
    });

    it("should create a transaction without description", async () => {
        const data = {
            type: TransactionType.EXPENSE,
            amount: 200,
            transactionDate: new Date("2024-01-15"),
            userId: "user-01",
            categoryId: "category-02",
        };

        const transaction = await sut.execute(data);

        expect(transaction.description).toBeNull();
    });

    it("should persist the transaction in the repository", async () => {
        const data = {
            type: TransactionType.INCOME,
            amount: 500,
            transactionDate: new Date("2024-02-10"),
            userId: "user-01",
            categoryId: "category-01",
        };

        await sut.execute(data);

        expect(repository.items).toHaveLength(1);
    });

    it("should create multiple transactions independently", async () => {
        const base = {
            transactionDate: new Date("2024-03-01"),
            userId: "user-01",
            categoryId: "category-01",
        };

        await sut.execute({ ...base, type: TransactionType.INCOME, amount: 3000 });
        await sut.execute({ ...base, type: TransactionType.EXPENSE, amount: 150 });

        expect(repository.items).toHaveLength(2);
        expect(repository.items[0].type).toBe(TransactionType.INCOME);
        expect(repository.items[1].type).toBe(TransactionType.EXPENSE);
    });

    it("should store the correct amount as Decimal", async () => {
        const data = {
            type: TransactionType.INCOME,
            amount: 99.99,
            transactionDate: new Date("2024-04-01"),
            userId: "user-01",
            categoryId: "category-01",
        };

        const transaction = await sut.execute(data);

        expect(transaction.amount.toNumber()).toBe(99.99);
    });
});