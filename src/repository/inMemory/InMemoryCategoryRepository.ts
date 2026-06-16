import { Category, TransactionType } from "@prisma/client"
import { ICategoryRepository, ICreateCategoryDTO } from "../../interfaces/ICategoryRepository"
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
}   