import { ConflictError, NotFoundError } from "../../shared/errors/AppError";
import { CategoryRepository } from "./category.repository";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(userId: string, input: CreateCategoryInput) {
    const existing = await this.categoryRepository.findByNameAndUserId(
      input.name,
      userId
    );
    if (existing) {
      throw new ConflictError("Categoria já existe");
    }

    return this.categoryRepository.create({ ...input, userId });
  }

  async findAll(userId: string) {
    return this.categoryRepository.findAll(userId);
  }

  async findById(id: string, userId: string) {
    const category = await this.categoryRepository.findByIdAndUserId(
      id,
      userId
    );
    if (!category) {
      throw new NotFoundError("Categoria não encontrada");
    }
    return category;
  }

  async update(id: string, userId: string, input: UpdateCategoryInput) {
    await this.findById(id, userId);

    const duplicate = await this.categoryRepository.findByNameAndUserId(
      input.name,
      userId
    );
    if (duplicate && duplicate.id !== id) {
      throw new ConflictError("Categoria já existe");
    }

    return this.categoryRepository.update(id, userId, input);
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    return this.categoryRepository.delete(id, userId);
  }
}
