import { prisma } from "../../config/database";
import { Category, TransactionType } from "@prisma/client";

export class CategoryRepository {
  async create(data: {
    name: string;
    type: TransactionType;
    userId: string;
  }): Promise<Category> {
    return prisma.category.create({ data });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { id, userId },
    });
  }

  async findByNameAndUserId(
    name: string,
    userId: string
  ): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { name, userId },
    });
  }

  async findAll(userId: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  async update(
    id: string,
    userId: string,
    data: { name: string; type: TransactionType }
  ): Promise<Category> {
    const existing = await this.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new Error("Categoria não encontrada");
    }
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Category> {
    const existing = await this.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new Error("Categoria não encontrada");
    }
    return prisma.category.delete({
      where: { id },
    });
  }
}
