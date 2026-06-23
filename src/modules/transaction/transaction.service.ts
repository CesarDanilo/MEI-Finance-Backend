import { ForbiddenError, NotFoundError } from "../../shared/errors/AppError";
import { CategoryRepository } from "../category/category.repository";
import { TransactionRepository } from "./transaction.repository";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "./transaction.schema";

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async create(userId: string, input: CreateTransactionInput) {
    await this.ensureCategoryBelongsToUser(input.categoryId, userId);

    return this.transactionRepository.create({
      ...input,
      userId,
    });
  }

  async findAll(userId: string) {
    return this.transactionRepository.findAll(userId);
  }

  /** Verifica ownership antes de retornar — mitiga IDOR. */
  async findById(id: string, userId: string) {
    const transaction = await this.transactionRepository.findByIdAndUserId(
      id,
      userId
    );
    if (!transaction) {
      throw new NotFoundError("Transação não encontrada");
    }
    return transaction;
  }

  async update(id: string, userId: string, input: UpdateTransactionInput) {
    await this.findById(id, userId);
    await this.ensureCategoryBelongsToUser(input.categoryId, userId);

    return this.transactionRepository.update(id, userId, input);
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    return this.transactionRepository.delete(id, userId);
  }

  private async ensureCategoryBelongsToUser(
    categoryId: string,
    userId: string
  ): Promise<void> {
    const category = await this.categoryRepository.findByIdAndUserId(
      categoryId,
      userId
    );
    if (!category) {
      throw new ForbiddenError("Categoria não pertence ao usuário");
    }
  }
}
