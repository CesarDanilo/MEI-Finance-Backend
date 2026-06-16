// DeleteCategoryService.spec.ts
import { describe, it, expect, beforeEach } from "vitest"
import { InMemoryCategoryRepository } from "../../../repository/inMemory/InMemoryCategoryRepository"
import { DeleteCategoryService } from "../../../services/category/delete.category.service"

describe("DeleteCategoryService", () => {
    let repository: InMemoryCategoryRepository
    let sut: DeleteCategoryService

    beforeEach(() => {
        repository = new InMemoryCategoryRepository()
        sut = new DeleteCategoryService(repository)
    })

    it("should delete a category successfully", async () => {
        const created = await repository.create({
            name: "Alimentação",
            type: "INCOME",
            userId: "user-01",
        })

        await sut.execute(created.id)

        expect(repository.items).toHaveLength(0)
    })

    it("should throw an error when category does not exist", async () => {
        await expect(
            sut.execute("non-existing-id")
        ).rejects.toThrow("Category not exists")
    })

    it("should delete only the target category", async () => {
        const cat1 = await repository.create({ name: "Alimentação", type: "INCOME", userId: "user-01" })
        const cat2 = await repository.create({ name: "Transporte", type: "EXPENSE", userId: "user-01" })

        await sut.execute(cat1.id)

        expect(repository.items).toHaveLength(1)
        expect(repository.items[0].id).toBe(cat2.id)
    })
})