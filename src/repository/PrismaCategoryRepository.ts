import { prisma } from "../config/prisma";
import { ICategoryRepository, ICreateCategoryDTO } from "../interfaces/ICategoryRepository";


export class PrismaCategoryRepository {
    async create(data: ICreateCategoryDTO) {
        return prisma.category.create({ data })
    }
}