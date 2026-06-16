import { InMemoryCategoryRepository } from "../../../repository/inMemory/InMemoryCategoryRepository"
import { CreateCategoryService } from "../../../services/category/create.category.service"
import { describe, it, expect, beforeEach } from "vitest"

describe("CreateCategoryService", () => {
    let repository: InMemoryCategoryRepository
    let sut: CreateCategoryService

    beforeEach(() => {
        repository = new InMemoryCategoryRepository()
        sut = new CreateCategoryService(repository)
    })

    it("should create a category successfully", async () => {
        const category = await sut.execute({
            name: "Alimentação",
            type: "INCOME",
            userId: "user-01",
        })

        expect(category).toBeTruthy()
        expect(category.id).toBeTruthy()
        expect(category.name).toBe("Alimentação")
        expect(category.type).toBe("INCOME")
        expect(category.userId).toBe("user-01")
        expect(repository.items).toHaveLength(1)
    })

    it("should not create a category with duplicate name for the same user", async () => {
        await sut.execute({
            name: "Alimentação",
            type: "INCOME",
            userId: "user-01",
        })

        await expect(
            sut.execute({
                name: "Alimentação",
                type: "EXPENSE",
                userId: "user-01",
            })
        ).rejects.toThrow("Category already exists")
    })

    it("should allow same category name for different users", async () => {
        await sut.execute({
            name: "Alimentação",
            type: "INCOME",
            userId: "user-01",
        })

        const category = await sut.execute({
            name: "Alimentação",
            type: "INCOME",
            userId: "user-02",
        })

        expect(category).toBeTruthy()
        expect(repository.items).toHaveLength(2)
    })

    it("should create multiple categories for the same user", async () => {
        await sut.execute({ name: "Alimentação", type: "INCOME", userId: "user-01" })
        await sut.execute({ name: "Transporte", type: "EXPENSE", userId: "user-01" })
        await sut.execute({ name: "Salário", type: "INCOME", userId: "user-01" })

        expect(repository.items).toHaveLength(3)
    })
})