import { Request, Response, NextFunction } from "express";
import { CategoryRepository } from "./category.repository";
import { CategoryService } from "./category.service";

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

export class CategoryController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.create(req.user.id, req.body);
      res
        .status(201)
        .json({ data: category, message: "Categoria criada com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async readAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.findAll(req.user.id);
      res.status(200).json({ data: categories });
    } catch (error) {
      next(error);
    }
  }

  async readById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.findById(
        req.params.id as string,
        req.user.id
      );
      res.status(200).json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.update(
        req.params.id as string,
        req.user.id,
        req.body
      );
      res.status(200).json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.delete(
        req.params.id as string,
        req.user.id
      );
      res.status(200).json({ data: category });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
