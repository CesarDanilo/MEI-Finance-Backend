import { prisma } from "../../config/database";
import { CreateUserInput, UpdateUserInput } from "./user.schema";

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  googleId: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  googleId: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class UserRepository {
  async create(data: {
    name: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
    avatarUrl?: string;
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

  // Uso geral (Google auth, perfil, etc) — NÃO expõe passwordHash
  async findByEmail(email: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { email },
      select: userPublicSelect,
    });
  }

  // Uso exclusivo do login com senha — expõe passwordHash pra comparação
  async findByEmailWithPassword(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { googleId },
      select: userPublicSelect,
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      passwordHash: string;
      googleId: string;
      avatarUrl: string;
    }>
  ): Promise<PublicUser> {
    return prisma.user.update({
      where: { id },
      data,
      select: userPublicSelect,
    });
  }
}

export type { CreateUserInput, UpdateUserInput };