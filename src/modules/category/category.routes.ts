import { Router } from "express";
import { categoryController } from "./category.controller";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from "./category.schema";
import { validateRequest } from "../../middlewares/validateRequest";
import { authMiddleware } from "../../middlewares/authMiddleware";

const categoryRouter = Router();

categoryRouter.use(authMiddleware);

const registerCategoryRoutes = (basePath: string) => {
  categoryRouter.post(
    basePath,
    validateRequest({ body: createCategorySchema }),
    categoryController.create.bind(categoryController)
  );
  categoryRouter.get(basePath, categoryController.readAll.bind(categoryController));
  categoryRouter.get(
    `${basePath}/:id`,
    validateRequest({ params: categoryIdParamSchema }),
    categoryController.readById.bind(categoryController)
  );
  categoryRouter.put(
    `${basePath}/:id`,
    validateRequest({
      params: categoryIdParamSchema,
      body: updateCategorySchema,
    }),
    categoryController.update.bind(categoryController)
  );
  categoryRouter.delete(
    `${basePath}/:id`,
    validateRequest({ params: categoryIdParamSchema }),
    categoryController.delete.bind(categoryController)
  );
};

registerCategoryRoutes("/category");
registerCategoryRoutes("/categories");

export { categoryRouter };
