import { Router } from "express";
import { UserController } from "../controllers/user/user.controller";
import { authMiddleware } from "../middleware/authUser";

const router = Router();
const userController = new UserController();

router.post("/user", userController.Create)

export default router;