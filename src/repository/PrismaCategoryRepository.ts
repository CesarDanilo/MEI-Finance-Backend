import { prisma } from "../config/prisma";
import { ICategoryRepository, ICreateCategoryDTO } from "../interfaces/ICategoryRepository";


export class PrismaCategoryRepository implements ICategoryRepository {
    async create(data: ICreateCategoryDTO) {
        return prisma.category.create({ data })
    }

    async findById(id: string) {
        return prisma.category.findUnique({ where: { id } });
    }

    async findByNameAndUserId(name: string, userId: string) {
        return prisma.category.findFirst({
            where: { name, userId }
        })
    }
}