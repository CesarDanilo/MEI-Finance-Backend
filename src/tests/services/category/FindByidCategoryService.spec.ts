import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryCategoryRepository } from "../../../repository/inMemory/InMemoryCategoryRepository";

describe("InMemoryCategoryRepository - findById", () => {
    let repository: InMemoryCategoryRepository

    beforeEach(() => {
        repository = new InMemoryCategoryRepository()
    })

    it("should find a category by id", async () => {
        const created = await repository.create({
            name: "Alimentação",
            type: "INCOME",
            userId: "user-01",
        })

        const found = await repository.findById(created.id)

        expect(found).toBeTruthy()
        expect(found?.id).toBe(created.id)
        expect(found?.name).toBe("Alimentação")
        expect(found?.userId).toBe("user-01")
    })

    it("should return null when category does not exist", async () => {
        const found = await repository.findById("non-existing-id")

        expect(found).toBeNull()
    })

    it("should not return a category from another user", async () => {
        const created = await repository.create({
            name: "Transporte",
            type: "EXPENSE",
            userId: "user-01",
        })

        const found = await repository.findById(created.id)

        expect(found?.userId).toBe("user-01")
        expect(found?.userId).not.toBe("user-02")
    })
})