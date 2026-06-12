import { User } from "@prisma/client";

export interface CreateUserDTO {
    name: string;
    email: string;
    passwordHash: string;
}

export interface UpdateUserDTO {
  name?: string
  email?: string
  passwordHash?: string
}

export interface IUserRepository {
    create(data: CreateUserDTO): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, data: UpdateUserDTO): Promise<User>;
    delete(id: string):Promise<User>;
}