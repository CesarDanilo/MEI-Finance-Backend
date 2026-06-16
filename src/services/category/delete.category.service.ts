import { ICategoryRepository } from "../../interfaces/ICategoryRepository";

export class DeleteCategoryService {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(id: string) {
        const category = await this.categoryRepository.findById(id);
        if (!category) throw new Error('Category not exists');

        return this.categoryRepository.delete(id);
    }
}