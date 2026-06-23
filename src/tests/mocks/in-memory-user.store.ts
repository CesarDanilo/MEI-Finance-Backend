import { randomUUID } from "node:crypto";
import { User } from "@prisma/client";

export class InMemoryUserStore {
  private users: User[] = [];

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email) ?? null;
  }

  async findById(id: string) {
    return this.users.find((u) => u.id === id) ?? null;
  }
}
