import { Router } from "express";  
import { TransectionController } from "../controllers/transection/transection.controller";
import { authMiddleware } from "../middleware/authUser";

const router = Router();
const transactionController = new TransectionController();

router.post("/transaction", authMiddleware ,transactionController.create);

export default router;