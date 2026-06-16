import { Category } from "@prisma/client"
import { ICategoryRepository, ICreateCategoryDTO, IUpdateCategory } from "../../interfaces/ICategoryRepository"
import { randomUUID } from "crypto"

export class InMemoryCategoryRepository implements ICategoryRepository {
    public items: Category[] = []

    async create(data: ICreateCategoryDTO): Promise<Category> {
        const category: Category = {
            id: randomUUID(),
            name: data.name,
            type: data.type,
            userId: data.userId,
            createdAt: new Date(),
        }

        this.items.push(category)
        return category
    }

    async findById(id: string): Promise<Category | null> {
        return this.items.find(item => item.id === id) ?? null
    }

    async findByNameAndUserId(name: string, userId: string): Promise<Category | null> {
        return this.items.find(item => item.name === name && item.userId === userId) ?? null
    }

    async readAll(userId: string): Promise<Category[]> {
        return this.items.filter(item => item.userId === userId)
    }

    async delete(id: string): Promise<Category> {
        const index = this.items.findIndex(item => item.id === id)
        const category = this.items[index]
        this.items.splice(index, 1)
        return category
    }

    async update(id: string, data: IUpdateCategory): Promise<Category> {
        const index = this.items.findIndex(item => item.id === id)
        this.items[index] = { ...this.items[index], ...data }
        return this.items[index]
    }
}