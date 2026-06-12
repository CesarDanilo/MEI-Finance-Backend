// src/repository/inMemory/InMemoryUserRepository.ts
import { randomUUID } from "node:crypto"
import { User } from "@prisma/client"
import { CreateUserDTO, UpdateUserDTO, IUserRepository } from "../../interfaces/IUserRepository"

export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = []

    async create(data: CreateUserDTO) {
        const user: User = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            passwordHash: data.passwordHash,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.users.push(user)
        return user
    }

    async findByEmail(email: string) {
        return this.users.find(u => u.email === email) ?? null
    }

    async findById(id: string) {
        return this.users.find(u => u.id === id) ?? null
    }

    async update(id: string, data: UpdateUserDTO) {
        const index = this.users.findIndex(u => u.id === id)
        this.users[index] = { ...this.users[index], ...data, updatedAt: new Date() }
        return this.users[index]
    }
}