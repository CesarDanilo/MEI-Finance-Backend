import { describe, it, expect, beforeEach } from "vitest";
import { DeleteTransectionService } from "../../../services/transection/delete.transaction.service";
import { InMemoryTransactionRepository } from "../../../repository/inMemory/InMemoryTransectionRepository";
import { TransactionType } from "../../../interfaces/ITransectionRepository";

describe("DeleteTransactionService", () => {
    let repository: InMemoryTransactionRepository;
    let sut: DeleteTransectionService;

    beforeEach(() => {
        repository = new InMemoryTransactionRepository();
        sut = new DeleteTransectionService(repository);
    });

    it("should delete a transaction successfully", async () => {
        const created = await repository.create({
            type: TransactionType.INCOME,
            amount: 1000,
            description: "Salário",
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        });

        const deleted = await sut.execute(created.id);

        expect(deleted.id).toBe(created.id);
    });

    it("should remove the transaction from the repository", async () => {
        const created = await repository.create({
            type: TransactionType.INCOME,
            amount: 1000,
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        });

        await sut.execute(created.id);

        expect(repository.items).toHaveLength(0);
    });

    it("should delete only the target transaction", async () => {
        const base = {
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        };

        const first = await repository.create({ ...base, type: TransactionType.INCOME, amount: 1000 });
        const second = await repository.create({ ...base, type: TransactionType.EXPENSE, amount: 200 });

        await sut.execute(first.id);

        expect(repository.items).toHaveLength(1);
        expect(repository.items[0].id).toBe(second.id);
    });

    it("should return the deleted transaction data", async () => {
        const created = await repository.create({
            type: TransactionType.INCOME,
            amount: 750,
            description: "Freelance",
            transactionDate: new Date("2024-02-01"),
            userId: "user-01",
            categoryId: "category-01",
        });

        const deleted = await sut.execute(created.id);

        expect(deleted.amount.toNumber()).toBe(750);
        expect(deleted.description).toBe("Freelance");
        expect(deleted.type).toBe(TransactionType.INCOME);
        expect(deleted.userId).toBe("user-01");
    });

    it("should throw an error when transaction does not exist", async () => {
        await expect(
            sut.execute("non-existent-id")
        ).rejects.toThrow("Transaction not found");
    });
});