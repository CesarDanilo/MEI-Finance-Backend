import { ICategoryRepository } from "../../interfaces/ICategoryRepository";

export class ReadCategoryService {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(userId: string) {
        return this.categoryRepository.readAll(userId);
    }
}