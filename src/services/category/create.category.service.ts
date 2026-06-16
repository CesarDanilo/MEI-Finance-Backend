import { ICategoryRepository, ICreateCategoryDTO } from "../../interfaces/ICategoryRepository"

export class CreateCategoryService {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(data: ICreateCategoryDTO) {
        const categoryAlreadyExists = await this.categoryRepository.findByNameAndUserId(
            data.name,
            data.userId
        )

        if (categoryAlreadyExists) throw new Error("Category already exists")

        return this.categoryRepository.create(data)
    }
}