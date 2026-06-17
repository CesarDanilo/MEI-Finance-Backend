import { prisma } from "../config/prisma";
import { ITransactionCreateDTO, ITransactionRepository, IUpdateTransactionDTO } from "../interfaces/ITransectionRepository";


export class PrismaTransectionRepository implements ITransactionRepository {
    async create(data: ITransactionCreateDTO) {
        return prisma.transaction.create({
            data: {
                type: data.type,
                amount: data.amount,
                description: data.description,
                transactionDate: data.transactionDate,
                userId: data.userId,
                categoryId: data.categoryId
            }
        })
    }

    async findById(id: string) {
        return prisma.transaction.findUnique({ where: { id } });
    }

    async findAll(userId: string) {
        return prisma.transaction.findMany({ where: { userId } });
    }

    async update(id: string, data: IUpdateTransactionDTO) {
        return prisma.transaction.update({ where: { id }, data });
    }

    async delete(id: string) {
        return prisma.transaction.delete({ where: { id } });
    }
}