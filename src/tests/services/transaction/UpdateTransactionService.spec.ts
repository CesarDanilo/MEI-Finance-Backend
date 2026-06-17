import { describe, it, expect, beforeEach } from "vitest";
import { UpdateTransectionService } from "../../../services/transection/update.transection.service";
import { InMemoryTransactionRepository } from "../../../repository/inMemory/InMemoryTransectionRepository";
import { TransactionType } from "../../../interfaces/ITransectionRepository";

describe("UpdateTransactionService", () => {
    let repository: InMemoryTransactionRepository;
    let sut: UpdateTransectionService;

    beforeEach(() => {
        repository = new InMemoryTransactionRepository();
        sut = new UpdateTransectionService(repository);
    });

    it("should update a transaction successfully", async () => {
        const created = await repository.create({
            type: TransactionType.INCOME,
            amount: 1000,
            description: "Salário",
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        });

        const updated = await sut.execute(created.id, {
            type: TransactionType.EXPENSE,
            amount: 200,
            description: "Mercado",
            transactionDate: new Date("2024-01-15"),
            categoryId: "category-02",
        });

        expect(updated.type).toBe(TransactionType.EXPENSE);
        expect(updated.amount.toNumber()).toBe(200);
        expect(updated.description).toBe("Mercado");
        expect(updated.categoryId).toBe("category-02");
    });

    it("should persist the updated data in the repository", async () => {
        const created = await repository.create({
            type: TransactionType.INCOME,
            amount: 1000,
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        });

        await sut.execute(created.id, {
            type: TransactionType.INCOME,
            amount: 1500,
            transactionDate: new Date("2024-01-01"),
            categoryId: "category-01",
        });

        expect(repository.items[0].amount.toNumber()).toBe(1500);
    });

    it("should keep the userId unchanged after update", async () => {
        const created = await repository.create({
            type: TransactionType.INCOME,
            amount: 1000,
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        });

        const updated = await sut.execute(created.id, {
            type: TransactionType.EXPENSE,
            amount: 300,
            transactionDate: new Date("2024-02-01"),
            categoryId: "category-02",
        });

        expect(updated.userId).toBe("user-01");
    });

    // ✅ toBeNull em vez de toBeUndefined
    it("should set description to null when not provided", async () => {
        const created = await repository.create({
            type: TransactionType.INCOME,
            amount: 1000,
            description: "Salário",
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        });

        const updated = await sut.execute(created.id, {
            type: TransactionType.INCOME,
            amount: 1000,
            transactionDate: new Date("2024-01-01"),
            categoryId: "category-01",
        });

        expect(updated.description).toBeNull();
    });

    // ✅ só funciona após adicionar o guard index === -1 no repositório
    it("should throw an error when transaction does not exist", async () => {
        await expect(
            sut.execute("non-existent-id", {
                type: TransactionType.INCOME,
                amount: 500,
                transactionDate: new Date("2024-01-01"),
                categoryId: "category-01",
            })
        ).rejects.toThrow("Transaction not found");
    });
});