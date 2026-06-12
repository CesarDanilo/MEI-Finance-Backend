import { prisma } from "../config/prisma";
import { IUserRepository, CreateUserDTO } from "../interfaces/IUserRepository";

export class PrismaUserRepository implements IUserRepository {

    async create(data: CreateUserDTO) {
        return prisma.user.create({ data });
    }

    async findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async update(id: string, data: CreateUserDTO) {
        return prisma.user.update({ where: { id }, data });
    }

    async delete(id: string) {
        return prisma.user.delete({ where: { id } })
    }
}