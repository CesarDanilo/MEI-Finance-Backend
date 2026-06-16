// UpdateCategoryService.spec.ts
import { describe, it, expect, beforeEach } from "vitest"
import { InMemoryCategoryRepository } from "../../../repository/inMemory/InMemoryCategoryRepository" 
import { UpdateCategoryService } from "../../../services/category/update.category.service" 

describe("UpdateCategoryService", () => {
    let repository: InMemoryCategoryRepository
    let sut: UpdateCategoryService

    beforeEach(() => {
        repository = new InMemoryCategoryRepository()
        sut = new UpdateCategoryService(repository)
    })

    it("should update a category successfully", async () => {
        const created = await repository.create({
            name: "Alimentação",
            type: "INCOME",
            userId: "user-01",
        })

        const updated = await sut.execute(created.id, {
            name: "Alimentação Atualizada",
            type: "EXPENSE",
        })

        expect(updated.name).toBe("Alimentação Atualizada")
        expect(updated.type).toBe("EXPENSE")
    })

    it("should throw an error when category does not exist", async () => {
        await expect(
            sut.execute("non-existing-id", { name: "Teste", type: "INCOME" })
        ).rejects.toThrow("Category not exists")
    })

    it("should not affect other categories", async () => {
        const cat1 = await repository.create({ name: "Alimentação", type: "INCOME", userId: "user-01" })
        const cat2 = await repository.create({ name: "Transporte", type: "EXPENSE", userId: "user-01" })

        await sut.execute(cat1.id, { name: "Alimentação Atualizada", type: "INCOME" })

        expect(repository.items[1].name).toBe(cat2.name)
        expect(repository.items[1].type).toBe(cat2.type)
    })
})