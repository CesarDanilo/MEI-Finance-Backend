import { describe, it, expect, beforeEach } from "vitest";
import { FindByIdTransectionService } from "../../../services/transection/findById.transection.service";
import { InMemoryTransactionRepository } from "../../../repository/inMemory/InMemoryTransectionRepository";
import { TransactionType } from "../../../interfaces/ITransectionRepository";

describe("FindByIdTransactionService", () => {
    let repository: InMemoryTransactionRepository;
    let sut: FindByIdTransectionService;

    beforeEach(() => {
        repository = new InMemoryTransactionRepository();
        sut = new FindByIdTransectionService(repository);
    });

    it("should find a transaction by id", async () => {
        const created = await repository.create({
            type: TransactionType.INCOME,
            amount: 1000,
            description: "Salário",
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        });

        const found = await sut.execute(created.id);

        expect(found).toBeDefined();
        expect(found?.id).toBe(created.id);
    });

    it("should return the correct transaction data", async () => {
        const created = await repository.create({
            type: TransactionType.EXPENSE,
            amount: 250,
            description: "Mercado",
            transactionDate: new Date("2024-02-10"),
            userId: "user-01",
            categoryId: "category-01",
        });

        const found = await sut.execute(created.id);

        expect(found?.type).toBe(TransactionType.EXPENSE);
        expect(found?.amount.toNumber()).toBe(250);
        expect(found?.description).toBe("Mercado");
        expect(found?.userId).toBe("user-01");
    });

    it("should return null when transaction does not exist", async () => {
        const found = await sut.execute("non-existent-id");

        expect(found).toBeNull();
    });

    it("should find the correct transaction among multiple", async () => {
        const base = {
            transactionDate: new Date("2024-01-01"),
            userId: "user-01",
            categoryId: "category-01",
        };

        const first = await repository.create({ ...base, type: TransactionType.INCOME, amount: 1000 });
        const second = await repository.create({ ...base, type: TransactionType.EXPENSE, amount: 200 });

        const found = await sut.execute(second.id);

        expect(found?.id).toBe(second.id);
        expect(found?.id).not.toBe(first.id);
        expect(found?.amount.toNumber()).toBe(200);
    });
});