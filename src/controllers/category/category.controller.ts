import { Request, Response } from "express";
import { PrismaCategoryRepository } from "../../repository/PrismaCategoryRepository";
import { CreateCategoryService } from "../../services/category/create.category.service";
import { ReadCategoryService } from "../../services/category/read.category.service";
import { FindByIdCategoryService } from "../../services/category/findByid.category.service";
import { UpdateCategoryService } from "../../services/category/update.category.service";
import { DeleteCategoryService } from "../../services/category/delete.category.service";

const categoryRepository = new PrismaCategoryRepository();
const categoryService = new CreateCategoryService(categoryRepository);
const readCategoryService = new ReadCategoryService(categoryRepository);
const findByIdCategoryService = new FindByIdCategoryService(categoryRepository);
const updateCategoryService = new UpdateCategoryService(categoryRepository);
const deleteCategoryService = new DeleteCategoryService(categoryRepository);

export class CategoryController {
    async create(req: Request, res: Response) {
        try {
            const category = await categoryService.execute(req.body);
            return res.status(201).json({ data: category, message: "Categoria criada com sucesso!" })
        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }


}