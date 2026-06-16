import { Router } from "express";
import { CategoryController } from "../controllers/category/category.controller";
import { authMiddleware } from "../middleware/authUser";

const router = Router();
const categoryController = new CategoryController();

router.post("/category", authMiddleware, categoryController.create);
router.get("/category", authMiddleware, categoryController.readAll);
router.delete("/category/:id", authMiddleware, categoryController.delete);


export default router;