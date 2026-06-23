import { prisma } from "../../config/database";
import { CreateUserInput, UpdateUserInput } from "./user.schema";

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserRepository {
  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<PublicUser> {
    return prisma.user.create({
      data,
      select: userPublicSelect,
    });
  }

  async findById(id: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async update(
    id: string,
    data: Partial<{ name: string; email: string; passwordHash: string }>
  ): Promise<PublicUser> {
    return prisma.user.update({
      where: { id },
      data,
      select: userPublicSelect,
    });
  }
}

export type { CreateUserInput, UpdateUserInput };
