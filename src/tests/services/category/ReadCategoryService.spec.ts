// ReadCategoryService.spec.ts
import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryCategoryRepository } from "../../../repository/inMemory/InMemoryCategoryRepository";
import { ReadCategoryService } from "../../../services/category/read.category.service";

describe("ReadCategoryService", () => {
    let repository: InMemoryCategoryRepository
    let sut: ReadCategoryService

    beforeEach(() => {
        repository = new InMemoryCategoryRepository()
        sut = new ReadCategoryService(repository)
    })

    it("should return all categories from a user", async () => {
        await repository.create({ name: "Alimentação", type: "INCOME", userId: "user-01" })
        await repository.create({ name: "Transporte", type: "EXPENSE", userId: "user-01" })

        const categories = await sut.execute("user-01")

        expect(categories).toHaveLength(2)
    })

    it("should return empty array when user has no categories", async () => {
        const categories = await sut.execute("user-01")

        expect(categories).toHaveLength(0)
        expect(categories).toEqual([])
    })

    it("should return only categories from the correct user", async () => {
        await repository.create({ name: "Alimentação", type: "INCOME", userId: "user-01" })
        await repository.create({ name: "Transporte", type: "EXPENSE", userId: "user-02" })

        const categories = await sut.execute("user-01")

        expect(categories).toHaveLength(1)
        expect(categories[0].userId).toBe("user-01")
    })
})