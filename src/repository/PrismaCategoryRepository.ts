import { prisma } from "../config/prisma";
import { ICategoryRepository, ICreateCategoryDTO, IUpdateCategory } from "../interfaces/ICategoryRepository";


export class PrismaCategoryRepository implements ICategoryRepository {
    async create(data: ICreateCategoryDTO) {
        return prisma.category.create({
            data: {
                name: data.name,
                type: data.type,
                userId: data.userId,
            }
        })
    }

    async findById(id: string) {
        return prisma.category.findUnique({ where: { id } });
    }

    async findByNameAndUserId(name: string, userId: string) {
        return prisma.category.findFirst({
            where: { name, userId }
        })
    }

    async readAll(userId: string) {
        return prisma.category.findMany({ where: { userId } })
    }

    async delete(id: string) {
        return prisma.category.delete({ where: { id } })
    }

    async update(id: string, data: IUpdateCategory) {
        return prisma.category.update({ where: { id }, data });
    }
}