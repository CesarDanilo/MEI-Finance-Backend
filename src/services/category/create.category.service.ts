import { ICategoryRepository ,ICreateCategoryDTO } from "../../interfaces/ICategoryRepository";

export class CreateCategoryService {
    constructor(private categoryRepository: ICategoryRepository) {}
    async execute(data: ICreateCategoryDTO){
        
    }
}