import { ICategoryRepository, IUpdateCategory } from "../../interfaces/ICategoryRepository";

export class UpdateCategoryService {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(id: string, data: IUpdateCategory) {
        const category = await this.categoryRepository.findById(id);
        if (!category) throw new Error("Category not exists");

        return this.categoryRepository.update(id, data);
    }
}