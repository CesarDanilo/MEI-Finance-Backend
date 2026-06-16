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
            const category = await categoryService.execute({ ...req.body, userId: req.user.id })
            return res.status(201).json({ data: category, message: "Categoria criada com sucesso!" })
        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }

    async readAll(req: Request, res: Response) {
        try {
            const userId = req.user.id

            const categories = await readCategoryService.execute(userId)

            return res.status(200).json({ data: categories })

        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            const categories = await deleteCategoryService.execute(id);

            return res.status(200).json({ data: categories });

        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }

    async readById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            const categories = await findByIdCategoryService.execute(id);

            return res.status(200).json({ data: categories });
            
        } catch (error: any) {
            return res.status(500).json({ error: error.message, message: "Erro interno" })
        }
    }
}