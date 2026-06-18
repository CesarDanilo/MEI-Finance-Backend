import { Router } from "express";  
import { TransectionController } from "../controllers/transection/transection.controller";
import { authMiddleware } from "../middleware/authUser";

const router = Router();
const transactionController = new TransectionController();

router.post("/transaction", authMiddleware ,transactionController.create);
router.get("/transaction", authMiddleware ,transactionController.readAll);
router.get("/transaction/:id", authMiddleware ,transactionController.readById);
router.put("/transaction/:id", authMiddleware ,transactionController.update);
router.delete("/transaction/:id", authMiddleware ,transactionController.delete);

export default router;