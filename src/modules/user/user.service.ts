import { hash } from "bcryptjs";
import { getEnv } from "../../config/env";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";
import { UserRepository } from "./user.repository";
import { CreateUserInput, UpdateUserInput } from "./user.schema";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Registra novo usuário com senha hasheada.
   * Retorna apenas campos públicos — nunca expõe passwordHash.
   */
  async create(input: CreateUserInput) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("E-mail já cadastrado");
    }

    const passwordHash = await hash(input.password, getEnv().BCRYPT_SALT_ROUNDS);

    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }
    return user;
  }

  async update(id: string, input: UpdateUserInput) {
    await this.findById(id);

    if (input.email) {
      const existing = await this.userRepository.findByEmail(input.email);
      if (existing && existing.id !== id) {
        throw new ConflictError("E-mail já cadastrado");
      }
    }

    const data: Partial<{ name: string; email: string; passwordHash: string }> =
      {};
    if (input.name) data.name = input.name;
    if (input.email) data.email = input.email;
    if (input.password) {
      data.passwordHash = await hash(input.password, getEnv().BCRYPT_SALT_ROUNDS);
    }

    return this.userRepository.update(id, data);
  }
}
